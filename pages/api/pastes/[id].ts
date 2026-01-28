import type { NextApiRequest, NextApiResponse } from "next";

// same in-memory store reference
const globalAny = global as any;
const store: Map<string, any> =
  globalAny.__PASTE_STORE__ || new Map();
globalAny.__PASTE_STORE__ = store;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  const paste = store.get(id);

  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  if (paste.expiresAt && Date.now() > paste.expiresAt) {
    store.delete(id);
    return res.status(404).json({ error: "Expired" });
  }

  paste.views++;

  if (paste.maxViews && paste.views > paste.maxViews) {
    store.delete(id);
    return res.status(404).json({ error: "View limit exceeded" });
  }

  return res.status(200).json({
    content: paste.content,
    remaining_views:
      paste.maxViews ? paste.maxViews - paste.views : null,
    expires_at: paste.expiresAt,
  });
}
