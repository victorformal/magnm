import { type NextRequest, NextResponse } from "next/server"
import { sendCAPIEvent } from "@/lib/meta-capi"
import { parseFbpFbcFromCookies } from "@/lib/fbp-fbc"
import { getUTMsFromCookie } from "@/lib/utm-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventName, eventId, pageUrl, customData, email, phone, fbp, fbc } = body

    // Get IP and User Agent from request
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || ""
    const cookieHeader = request.headers.get("cookie") || ""

    // Get fbp/fbc from cookies if not provided
    const cookieFbpFbc = parseFbpFbcFromCookies(cookieHeader)
    const finalFbp = fbp || cookieFbpFbc.fbp
    const finalFbc = fbc || cookieFbpFbc.fbc

    // Get UTMs from cookies
    const utms = getUTMsFromCookie(cookieHeader)

    // Merge UTMs with customData
    const mergedCustomData = {
      ...customData,
      ...utms,
    }

    // Determine event source URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://slatura.eu"
    const eventSourceUrl = pageUrl || siteUrl

    // Send to Meta CAPI
    const result = await sendCAPIEvent({
      eventName,
      eventId,
      eventSourceUrl,
      userData: {
        email,
        phone,
        clientIpAddress: clientIp,
        clientUserAgent: userAgent,
        fbp: finalFbp,
        fbc: finalFbc,
      },
      customData: mergedCustomData,
    })

    if (!result.success) {
      console.error("[Meta Track API] CAPI error:", result.error)
    }

    return NextResponse.json({ success: result.success })
  } catch (error) {
    console.error("[Meta Track API] Error:", error)
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 })
  }
}
