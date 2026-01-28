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
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Body safety
    if (!req.body) {
      return res.status(400).json({ error: "Missing request body" });
    }

    const { content, ttl_seconds = 300, max_views = 1 } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Invalid content" });
    }

    const id = Math.random().toString(16).slice(2, 10);

    const expiresAt = new Date(
      Date.now() + Number(ttl_seconds) * 1000
    );

    await pool.query(
      `INSERT INTO pastes (id, content, expires_at, remaining_views)
       VALUES ($1, $2, $3, $4)`,
      [id, content, expiresAt, max_views]
    );

    return res.status(200).json({
      id,
      url: `/api/pastes/${id}`,
    });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err?.message ?? "unknown",
    });
  }
}
