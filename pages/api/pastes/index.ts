import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";

type Paste = {
  id: string;
  content: string;
  expiresAt: number | null;
  maxViews: number | null;
  views: number;
};

// simple in-memory store (for now)
const store = new Map<string, Paste>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { content, ttl_seconds, max_views } = req.body || {};

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "content is required" });
    }

    const id = nanoid(8);
    const expiresAt =
      typeof ttl_seconds === "number"
        ? Date.now() + ttl_seconds * 1000
        : null;

    const paste: Paste = {
      id,
      content,
      expiresAt,
      maxViews: typeof max_views === "number" ? max_views : null,
      views: 0,
    };

    store.set(id, paste);

    return res.status(200).json({
      id,
      url: `/api/pastes/${id}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
}
