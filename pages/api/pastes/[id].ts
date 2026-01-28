import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const result = await pool.query(
      `SELECT id, content, max_views, views, expires_at
       FROM pastes
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const paste = result.rows[0];

    if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
      return res.status(410).json({ error: "Expired" });
    }

    if (paste.max_views !== null && paste.views >= paste.max_views) {
      return res.status(410).json({ error: "View limit reached" });
    }

    await pool.query(
      `UPDATE pastes SET views = views + 1 WHERE id = $1`,
      [id]
    );

    return res.status(200).json({
      content: paste.content,
      remaining_views:
        paste.max_views === null
          ? null
          : paste.max_views - paste.views - 1,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}
