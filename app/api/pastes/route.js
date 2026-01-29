import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import crypto from "crypto";

export async function POST(request) {
  const body = await request.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const now = Date.now();

  const paste = {
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    remaining_views: max_views ?? null,
  };

  if (ttl_seconds) {
    await redis.set(`paste:${id}`, paste, { ex: ttl_seconds });
  } else {
    await redis.set(`paste:${id}`, paste);
  }

  const origin = request.headers.get("origin");

  return NextResponse.json({
    id,
    url: `${origin}/pastes/${id}`,
  });
}
