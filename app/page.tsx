"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPaste() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ttl_seconds: 300,
          max_views: 5,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create paste");
      }

      const data = await res.json();
      setResult(window.location.origin + data.url);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your paste here..."
        rows={8}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <button onClick={createPaste} disabled={loading || !content}>
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {result && (
        <p style={{ marginTop: 16 }}>
          ✅ Paste created: <br />
          <a href={result} target="_blank">
            {result}
          </a>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
