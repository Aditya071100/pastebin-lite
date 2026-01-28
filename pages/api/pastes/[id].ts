import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(404).json({ error: "not found" });
  }

  const rows = await sql`
    SELECT content, expires_at, max_views, views
    FROM pastes
    WHERE id = ${id}
  `;

  // Missing paste
  if (rows.length === 0) {
    return res.status(404).json({ error: "not found" });
  }

  const paste = rows[0];

  // TTL check
  if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
    return res.status(404).json({ error: "not found" });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return res.status(404).json({ error: "not found" });
  }

  // Increment views
  await sql`
    UPDATE pastes
    SET views = views + 1
    WHERE id = ${id}
  `;

  return res.status(200).json({
    content: paste.content,
    remaining_views:
      paste.max_views !== null ? paste.max_views - paste.views - 1 : null,
    expires_at: paste.expires_at,
  });
}
