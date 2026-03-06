import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id")

    console.log("[v0] Stripe Session API - Session ID:", sessionId)

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Retrieve the session from Stripe
    console.log("[v0] Stripe Session API - Fetching from Stripe...")
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    })

    console.log("[v0] Stripe Session API - Retrieved successfully:", {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_details: session.customer_details,
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error("[v0] Error fetching session:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to retrieve session", details: errorMessage },
      { status: 500 }
    )
  }
}
