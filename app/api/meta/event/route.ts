// app/api/meta/event/route.ts
// Generic Meta CAPI endpoint - accepts any event with proper event_id for deduplication
import { type NextRequest, NextResponse } from "next/server"
import { sendCAPIEvent } from "@/lib/meta-capi"
import { parseFbpFbcFromCookies } from "@/lib/fbp-fbc"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event_name, event_id, custom_data, user_data, event_source_url } = body

    if (!event_name) {
      return NextResponse.json({ ok: false, error: "event_name is required" }, { status: 400 })
    }

    if (!event_id) {
      return NextResponse.json({ ok: false, error: "event_id is required for deduplication" }, { status: 400 })
    }

    // Get IP and User Agent from request headers
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown"
    const userAgent = req.headers.get("user-agent") || ""

    // Get fbp/fbc from cookies
    const cookieHeader = req.headers.get("cookie") || ""
    const { fbp, fbc } = parseFbpFbcFromCookies(cookieHeader)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://slatura.eu"
    const eventSourceUrl = event_source_url || siteUrl

    // Send to Meta CAPI with event_id for deduplication
    const result = await sendCAPIEvent({
      eventName: event_name,
      eventId: event_id,
      eventSourceUrl,
      userData: {
        email: user_data?.email || user_data?.em,
        phone: user_data?.phone || user_data?.ph,
        clientIpAddress: clientIp,
        clientUserAgent: userAgent,
        fbp: fbp || undefined,
        fbc: fbc || undefined,
        externalId: user_data?.external_id,
      },
      customData: custom_data,
    })

    if (!result.success) {
      console.error("[Meta Event API] CAPI error:", result.error)
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[Meta Event API] Error:", error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}
