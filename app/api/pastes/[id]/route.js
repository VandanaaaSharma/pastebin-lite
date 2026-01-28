import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // ✅ FIX: params MUST be awaited
  const { id } = await params;

  const paste = await redis.get(`paste:${id}`);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found or expired" },
      { status: 404 }
    );
  }

  const { content, expiresAt, remainingViews } = paste;
  const now = Date.now();

  // TTL check
  if (now > expiresAt) {
    await redis.del(`paste:${id}`);
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  // View limit check
  if (remainingViews <= 0) {
    await redis.del(`paste:${id}`);
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  // Decrement views
  await redis.set(`paste:${id}`, {
    content,
    expiresAt,
    remainingViews: remainingViews - 1,
  });

  return NextResponse.json({ content });
}

