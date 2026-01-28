import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request, { params }) {
  const { id } = await params;

  let paste;
  try {
    paste = await redis.get(`paste:${id}`);
  } catch (error) {
    console.error("Redis error:", error);
    return NextResponse.json(
      { error: "Redis connection failed" },
      { status: 500 }
    );
  }

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const { content, expires_at, remaining_views } = paste;
  const now = Date.now();

  if (expires_at !== null && now > expires_at) {
    await redis.del(`paste:${id}`);
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  if (remaining_views <= 0) {
    await redis.del(`paste:${id}`);
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  await redis.set(`paste:${id}`, {
    ...paste,
    remaining_views: remaining_views - 1,
  });

  return NextResponse.json(
    {
      content,
      remaining_views: remaining_views - 1,
      expires_at,
    },
    { status: 200 }
  );
}
