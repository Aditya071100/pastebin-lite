import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `
      SELECT content, views, max_views, expires_at
      FROM pastes
      WHERE id = $1
      `,
      [params.id]
    );

    if (result.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const paste = result.rows[0];
    const now = Date.now();

    // TTL check
    if (paste.expires_at && new Date(paste.expires_at).getTime() <= now) {
      client.release();
      return NextResponse.json({ error: "expired" }, { status: 404 });
    }

    // View limit check
    if (paste.max_views !== null && paste.views >= paste.max_views) {
      client.release();
      return NextResponse.json(
        { error: "view limit exceeded" },
        { status: 404 }
      );
    }

    // Increment views
    await client.query(
      "UPDATE pastes SET views = views + 1 WHERE id = $1",
      [params.id]
    );

    client.release();

    return NextResponse.json({
      content: paste.content,
      remaining_views:
        paste.max_views === null
          ? null
          : Math.max(paste.max_views - paste.views - 1, 0),
      expires_at: paste.expires_at,
    });
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json(
      { error: "internal error" },
      { status: 500 }
    );
  }
}
