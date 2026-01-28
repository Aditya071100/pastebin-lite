export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const expiresAt =
      typeof ttl_seconds === "number"
        ? new Date(Date.now() + ttl_seconds * 1000)
        : null;

    const rows = await sql`
      INSERT INTO pastes (content, expires_at, max_views, views)
      VALUES (${content}, ${expiresAt}, ${max_views ?? null}, 0)
      RETURNING id
    `;

    return NextResponse.json({
      id: rows[0].id,
      url: `/p/${rows[0].id}`,
    });
  } catch {
    return NextResponse.json(
      { error: "invalid request" },
      { status: 400 }
    );
  }
}
