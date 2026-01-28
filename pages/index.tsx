import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPaste() {
    setLoading(true);
    setError(null);
    setResultUrl(null);

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
      setResultUrl(data.url);
      setContent("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "40px" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        placeholder="Write your paste here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          height: "200px",
          marginTop: "20px",
          padding: "10px",
          background: "#000",
          color: "#fff",
          border: "1px solid #666",
        }}
      />

      <br />

      <button
        onClick={createPaste}
        disabled={loading || !content.trim()}
        style={{ marginTop: "15px", padding: "10px 16px", cursor: "pointer" }}
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {resultUrl && (
        <div style={{ marginTop: "20px", color: "#00ff88" }}>
          ✅ Paste created:
          <br />
          <a
            href={resultUrl.replace("/api", "/paste")}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#00ff88" }}
          >
            {resultUrl.replace("/api", "/paste")}
          </a>
        </div>
      )}

      {error && <div style={{ marginTop: "20px", color: "red" }}>❌ {error}</div>}
    </main>
  );
}
