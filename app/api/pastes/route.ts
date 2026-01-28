import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const result = await sql`
    SELECT content, expires_at, max_views, views
    FROM pastes
    WHERE id = ${id}
  `;

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const paste = result.rows[0];

  // Check expiry
  if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Check view limit
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Increment views
  await sql`
    UPDATE pastes
    SET views = views + 1
    WHERE id = ${id}
  `;

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views !== null ? paste.max_views - paste.views - 1 : null,
    expires_at: paste.expires_at,
  });
}
