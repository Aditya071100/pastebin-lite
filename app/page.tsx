"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    setLoading(true);
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

      const data = await res.json();

      if (!res.ok) {
        setResult("Error creating paste");
        return;
      }

      setResult(`Paste created! ID: ${data.id}`);
    } catch (err) {
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Write your paste here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          height: 200,
          background: "black",
          color: "white",
          border: "1px solid white",
          padding: 10,
        }}
      />

      <br />
      <br />

      <button onClick={createPaste} disabled={loading}>
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {result && (
        <p style={{ marginTop: 20 }}>
          {result}
        </p>
      )}
    </main>
  );
}
