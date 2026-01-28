import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  // Validate content
  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "content is required" });
  }

  // Validate ttl_seconds
  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return res.status(400).json({ error: "invalid ttl_seconds" });
  }

  // Validate max_views
  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return res.status(400).json({ error: "invalid max_views" });
  }

  const expiresAt =
    typeof ttl_seconds === "number"
      ? new Date(Date.now() + ttl_seconds * 1000)
      : null;

  // Insert paste
  const rows = await sql`
    INSERT INTO pastes (content, expires_at, max_views, views)
    VALUES (${content}, ${expiresAt}, ${max_views ?? null}, 0)
    RETURNING id
  `;

  const id = rows[0].id;

  return res.status(200).json({
    id,
    url: `/p/${id}`,
  });
}
