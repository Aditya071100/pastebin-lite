"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
      }}
    >
      <div style={{ width: "600px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>
          Pastebin Lite
        </h1>

        <textarea
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            outline: "none",
            fontSize: "14px",
          }}
        />

        <button
          style={{
            marginTop: "12px",
            padding: "10px 16px",
            background: "#22c55e",
            color: "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => alert("Backend skipped for now 🙂")}
        >
          Create Paste
        </button>

        <p style={{ marginTop: "12px", fontSize: "12px", opacity: 0.7 }}>
          Backend temporarily skipped
        </p>
      </div>
    </main>
  );
}
