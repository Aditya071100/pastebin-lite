import { NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: "ttl_seconds must be >= 1" },
        { status: 400 }
      );
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        { error: "max_views must be >= 1" },
        { status: 400 }
      );
    }

    const id = crypto.randomBytes(4).toString("hex");

    const expires_at =
      ttl_seconds !== undefined
        ? new Date(Date.now() + ttl_seconds * 1000)
        : null;

    const client = await pool.connect();

    await client.query(
      `
      INSERT INTO pastes (id, content, created_at, expires_at, max_views, views)
      VALUES ($1, $2, NOW(), $3, $4, 0)
      `,
      [id, content, expires_at, max_views ?? null]
    );

    client.release();

    return NextResponse.json({
      id,
      url: `/p/${id}`,
    });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json(
      { error: "invalid request" },
      { status: 400 }
    );
  }
}
