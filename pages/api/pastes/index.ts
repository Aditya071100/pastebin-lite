import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import crypto from "crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  if (!content) {
    return res.status(400).json({ error: "content required" });
  }

  const id = crypto.randomBytes(4).toString("hex");

  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000)
    : null;

  await pool.query(
    `
    INSERT INTO pastes (id, content, expires_at, max_views)
    VALUES ($1, $2, $3, $4)
    `,
    [id, content, expiresAt, max_views ?? null]
  );

  res.status(200).json({
    id,
    url: `/p/${id}`,
  });
}
