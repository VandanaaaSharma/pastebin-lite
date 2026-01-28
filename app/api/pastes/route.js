import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import crypto from "crypto";

export async function POST(request) {
  let body;

  // STEP 0: Parse JSON safely
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // STEP 1: Validation
  if (typeof content !== "string" || content.trim() === "") {
    return NextResponse.json(
      { error: "content must be a non-empty string" },
      { status: 400 }
    );
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return NextResponse.json(
      { error: "ttl_seconds must be an integer >= 1" },
      { status: 400 }
    );
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return NextResponse.json(
      { error: "max_views must be an integer >= 1" },
      { status: 400 }
    );
  }

  // STEP 2: Generate ID
  const id = crypto.randomUUID();
  const now = Date.now();

  // STEP 3: Calculate expiry timestamp
  const expires_at =
    ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null;

  // STEP 4: Create paste object
  const paste = {
    content,
    created_at: now,
    expires_at,
    remaining_views: max_views ?? Infinity,
  };

  // STEP 5: Save to Redis (IMPORTANT FIX)
  if (ttl_seconds !== undefined) {
    // Set Redis TTL so key auto-expires
    await redis.set(`paste:${id}`, paste, {
      ex: ttl_seconds,
    });
  } else {
    await redis.set(`paste:${id}`, paste);
  }

  // STEP 6: Return response
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return NextResponse.json(
    {
      id,
      url: `${baseUrl}/pastes/${id}`,
    },
    { status: 200 }
  );
}
