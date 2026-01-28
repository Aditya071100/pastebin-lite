import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await pool.query(
    `
    SELECT content, expires_at, max_views, views
    FROM pastes
    WHERE id = $1
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (max_views IS NULL OR views < max_views)
    `,
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "not found" });
  }

  await pool.query(
    `UPDATE pastes SET views = views + 1 WHERE id = $1`,
    [id]
  );

  res.status(200).json(result.rows[0]);
}
