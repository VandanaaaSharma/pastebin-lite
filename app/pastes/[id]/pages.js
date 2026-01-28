import { redis } from "@/lib/redis";
import { notFound } from "next/navigation";

export default async function PastePage({ params }) {
  const paste = await redis.get(`paste:${params.id}`);

  if (!paste) {
    notFound();
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Paste</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {paste.content}
      </pre>
    </main>
  );
}

