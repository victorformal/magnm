/**
 * DEPRECATED: Use sendMetaEvent from lib/meta/client-events.ts instead
 * This function is kept for backward compatibility but new code should use sendMetaEvent
 */
export async function trackMetaEvent({
  event_name = "Purchase",
  email,
  phone,
  external_id,
  value,
  currency = "GBP",
}: {
  event_name?: string
  email?: string
  phone?: string
  external_id?: string
  value?: number
  currency?: string
}) {
  try {
    // Use the new server-side endpoint that properly handles fbc
    const response = await fetch("/api/meta/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name,
        custom_data: {
          value,
          currency,
        },
        user_data: {
          ...(email && { em: email }),
          ...(phone && { ph: phone }),
          ...(external_id && { external_id }),
        },
        event_source_url: window.location.href,
      }),
    })

    if (!response.ok) {
      console.error("Meta tracking error:", await response.json())
      return { ok: false }
    }

    const result = await response.json()
    console.log("[v0] Meta event tracked:", { event_name, value })
    return result
  } catch (error) {
    console.error("[v0] Meta tracking failed:", error)
    return { ok: false }
  }
}
