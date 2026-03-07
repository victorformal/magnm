// Meta Pixel client-side utilities
// Primary (and ONLY) Pixel ID from environment variable

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1139772708143683"

// Declare fbq type for TypeScript
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

// Generate unique event ID for deduplication between Pixel (browser) and CAPI (server)
// IMPORTANT: The SAME eventId must be sent to both fbq() and the /api/meta/track CAPI endpoint.
export function generateEventId(prefix?: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`
}

// Track ViewContent event (fires ONCE with eventID for deduplication)
export function trackViewContent(params: {
  contentId: string
  contentName: string
  contentType?: string
  value: number
  currency?: string
  eventId?: string
}) {
  const eventId = params.eventId || generateEventId("vc")

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_ids: [params.contentId],
      content_name: params.contentName,
      content_type: params.contentType || "product",
      value: params.value,
      currency: params.currency || "GBP",
    }, { eventID: eventId })
  }

  return eventId
}

// Track AddToCart event (fires ONCE with eventID for deduplication)
export function trackAddToCart(params: {
  contentId: string
  contentName: string
  quantity: number
  value: number
  currency?: string
  eventId?: string
}) {
  const eventId = params.eventId || generateEventId("atc")

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [params.contentId],
      contents: [
        {
          id: params.contentId,
          quantity: params.quantity,
          item_price: params.value / params.quantity,
        },
      ],
      content_name: params.contentName,
      content_type: "product",
      value: params.value,
      currency: params.currency || "GBP",
    }, { eventID: eventId })
  }

  return eventId
}

// Track InitiateCheckout event (fires ONCE with eventID for deduplication)
export function trackInitiateCheckout(params: {
  contentIds: string[]
  numItems: number
  value: number
  currency?: string
  eventId?: string
}) {
  const eventId = params.eventId || generateEventId("ic")

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_ids: params.contentIds,
      num_items: params.numItems,
      value: params.value,
      currency: params.currency || "GBP",
    }, { eventID: eventId })
  }

  return eventId
}

// Track Purchase event (fires ONCE with eventID for deduplication)
export function trackPurchase(params: {
  orderId: string
  contentIds: string[]
  contents: Array<{ id: string; quantity: number; item_price: number }>
  value: number
  currency?: string
  eventId?: string
}) {
  const eventId = params.eventId || `purchase_${params.orderId}`

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      content_ids: params.contentIds,
      contents: params.contents,
      content_type: "product",
      value: params.value,
      currency: params.currency || "GBP",
      order_id: params.orderId,
    }, { eventID: eventId })
  }

  return eventId
}

// Track PageView (for SPA navigation)
export function trackPageView() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView")
  }
}
