import { NextResponse } from "next/server";
import { notificationChannels } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function GET() {
  const channels = notificationChannels();
  return NextResponse.json(
    {
      ok: true,
      configured: channels.webhook || channels.email,
      channels,
    },
    {
      headers: {
        "cache-control": "private, no-store",
      },
    },
  );
}
