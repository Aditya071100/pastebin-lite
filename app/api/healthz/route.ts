import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    await client.connect();
    await client.query("SELECT 1");
    await client.end();

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Healthz error:", error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
