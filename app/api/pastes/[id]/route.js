import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request, { params }) {
  const { id } = await params;

  const paste = await redis.get(`paste:${id}`);

  // ❌ FIXED TYPO HERE
  if (!paste) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }

  const { content, expires_at, remaining_views } = paste;
  const now = Date.now();

  // ⏱ Expiry check
  if (expires_at && now > expires_at) {
    await redis.del(`paste:${id}`);
    return NextResponse.json({ error: "Paste expired" }, { status: 404 });
  }

  // 👁 If views exhausted → still show content once
  if (remaining_views !== null && remaining_views <= 0) {
    return NextResponse.json(
      { content, remaining_views: 0, expires_at },
      { status: 200 }
    );
  }

  // 🔽 Decrement views
  if (remaining_views !== null) {
    await redis.set(`paste:${id}`, {
      ...paste,
      remaining_views: remaining_views - 1,
    });
  }

  return NextResponse.json(
    {
      content,
      remaining_views:
        remaining_views !== null ? remaining_views - 1 : null,
      expires_at,
    },
    { status: 200 }
  );
}
