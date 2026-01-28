import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import crypto from "crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "content is required" });
    }

    const id = crypto.randomBytes(4).toString("hex");
    const expiresAt = ttl_seconds
      ? new Date(Date.now() + ttl_seconds * 1000)
      : null;

    await pool.query(
      `INSERT INTO pastes (id, content, expires_at, max_views, views)
       VALUES ($1, $2, $3, $4, 0)`,
      [id, content, expiresAt, max_views ?? null]
    );

    return res.status(200).json({
      id,
      url: `/api/pastes/${id}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}
