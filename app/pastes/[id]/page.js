import { notFound } from "next/navigation";

export default async function PastePage({ params }) {
  // ✅ REQUIRED in Next.js 14
  const { id } = await params;

  // ❗ IMPORTANT: absolute URL for server-side fetch
  const res = await fetch(
    `http://localhost:3000/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const { content, remaining_views, expires_at } = await res.json();

  return (
    <main style={container}>
      <div style={card}>
        <div style={header}>
          <span style={icon}>📄</span>
          <h2 style={{ margin: 0 }}>Shared Paste</h2>
        </div>

        <pre style={codeBox}>{content}</pre>

        <div style={meta}>
          <span>👁 Remaining views: {remaining_views}</span>
          {expires_at && (
            <span>⏱ Expires: {new Date(expires_at).toLocaleString()}</span>
          )}
        </div>
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
  maxWidth: "800px",
  background: "#ffffff",
  borderRadius: "24px",
  padding: "2rem",
  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "1rem",
};

const icon = {
  fontSize: "1.4rem",
};

const codeBox = {
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "1.25rem",
  whiteSpace: "pre-wrap",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "14px",
  border: "1px solid #e5e7eb",
  marginBottom: "1rem",
};

const meta = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "0.5rem",
  color: "#6b7280",
  fontSize: "0.9rem",
};
