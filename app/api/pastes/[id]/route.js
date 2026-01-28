import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request, { params }) {
  // Next.js 14+ requires awaiting params
  const { id } = await params;

  const paste = await redis.get(`paste:${id}`);

  // 1️⃣ Paste not found
  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const { content, expires_at, remaining_views } = paste;
  const now = Date.now();

  // 2️⃣ TTL expired (extra safety even though Redis TTL exists)
  if (expires_at !== null && now > expires_at) {
    await redis.del(`paste:${id}`);
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  // 3️⃣ View limit exceeded
  if (remaining_views <= 0) {
    await redis.del(`paste:${id}`);
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  // 4️⃣ Decrement views
  await redis.set(`paste:${id}`, {
    ...paste,
    remaining_views: remaining_views - 1,
  });

  // 5️⃣ Return paste (PDF-required fields)
  return NextResponse.json(
    {
      content,
      remaining_views: remaining_views - 1,
      expires_at,
    },
    { status: 200 }
  );
}
