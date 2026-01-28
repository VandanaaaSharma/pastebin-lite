"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function createPaste() {
    setError(null);
    setResult(null);

    if (!content.trim()) {
      setError("Please enter some text to share 🙂");
      return;
    }

    const body = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (views) body.max_views = Number(views);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setResult(data);
  }

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={{ marginBottom: "0.25rem" }}>✨ Pastebin Lite</h1>
        

        <label style={label}>📝 Your Paste</label>
        <textarea
          rows={8}
          placeholder="Type or paste something here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textarea}
        />

        <div style={row}>
          <div style={{ flex: 1 }}>
            <label style={label}>⏱ Time to live (seconds)</label>
            <input
              type="number"
              placeholder="e.g. 120"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              style={input}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={label}>👁 Max views</label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={views}
              onChange={(e) => setViews(e.target.value)}
              style={input}
            />
          </div>
        </div>

        <button onClick={createPaste} style={button}>
          🚀 Create Paste
        </button>

        {error && <p style={errorText}>{error}</p>}

        {result && (
          <div style={resultBox}>
            <p style={{ margin: 0 }}>🎉 Paste created!</p>
            <a href={result.url} target="_blank" style={link}>
              {result.url}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- styles ---------- */

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
};

const card = {
  width: "100%",
  maxWidth: "640px",
  background: "#ffffff",
  borderRadius: "24px",
  padding: "2rem",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const label = {
  fontSize: "0.9rem",
  fontWeight: 500,
  marginBottom: "0.25rem",
  display: "block",
};

const textarea = {
  width: "100%",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  padding: "1rem",
  marginBottom: "1.25rem",
  fontSize: "14px",
  resize: "vertical",
};

const row = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
};

const input = {
  width: "100%",
  borderRadius: "999px",
  border: "1px solid #e5e7eb",
  padding: "0.6rem 0.9rem",
};

const button = {
  width: "100%",
  background: "#8b5cf6",
  color: "#ffffff",
  border: "none",
  padding: "0.85rem",
  borderRadius: "999px",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
};

const resultBox = {
  marginTop: "1.5rem",
  background: "#f0fdf4",
  borderRadius: "16px",
  padding: "1rem",
};

const link = {
  color: "#2563eb",
  wordBreak: "break-all",
};

const errorText = {
  color: "#dc2626",
  marginTop: "1rem",
};
