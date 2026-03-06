"use client"

/**
 * Client-side helper to send Meta events through our server endpoint
 * Ensures proper fbc/fbp cookies and IP/UA are captured server-side
 */

interface MetaEventOptions {
  event_name: string
  event_id?: string
  custom_data?: Record<string, any>
  user_data?: Record<string, any>
}

/**
 * Generate a unique event ID for deduplication
 */
export function generateEventId(prefix: string = "evt"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sends a server-side event to Meta Conversions API
 * The fbc and fbp cookies are automatically included by the API
 */
export async function sendMetaEvent(options: MetaEventOptions): Promise<boolean> {
  try {
    const eventId = options.event_id || generateEventId("meta")

    const response = await fetch("/api/meta/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: options.event_name,
        event_id: eventId,
        custom_data: options.custom_data,
        user_data: options.user_data,
        event_source_url: window.location.href,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[Meta Client] Event error:", error)
      return false
    }
    
    return true
  } catch (error) {
    console.error("[Meta Client] Error sending event:", error)
    return false
  }
}

/**
 * Track PageView event
 */
export async function trackPageView(): Promise<boolean> {
  return sendMetaEvent({
    event_name: "PageView",
    event_id: generateEventId("pv"),
  })
}

/**
 * Track ViewContent event
 */
export async function trackViewContent(params: {
  contentId: string
  contentName: string
  contentCategory?: string
  value?: number
  currency?: string
}): Promise<boolean> {
  return sendMetaEvent({
    event_name: "ViewContent",
    event_id: generateEventId("vc"),
    custom_data: {
      content_ids: [params.contentId],
      content_name: params.contentName,
      content_category: params.contentCategory,
      content_type: "product",
      value: params.value,
      currency: params.currency,
    },
  })
}

/**
 * Track AddToCart event
 */
export async function trackAddToCart(params: {
  contentId: string
  contentName: string
  value: number
  currency: string
  quantity?: number
}): Promise<boolean> {
  return sendMetaEvent({
    event_name: "AddToCart",
    event_id: generateEventId("atc"),
    custom_data: {
      content_ids: [params.contentId],
      content_name: params.contentName,
      content_type: "product",
      value: params.value,
      currency: params.currency,
      num_items: params.quantity || 1,
    },
  })
}

/**
 * Track InitiateCheckout event
 */
export async function trackInitiateCheckout(params: {
  contentIds: string[]
  value: number
  currency: string
  numItems: number
}): Promise<boolean> {
  return sendMetaEvent({
    event_name: "InitiateCheckout",
    event_id: generateEventId("ic"),
    custom_data: {
      content_ids: params.contentIds,
      content_type: "product",
      value: params.value,
      currency: params.currency,
      num_items: params.numItems,
    },
  })
}

/**
 * Track AddPaymentInfo event
 */
export async function trackAddPaymentInfo(params: {
  contentIds: string[]
  value: number
  currency: string
}): Promise<boolean> {
  return sendMetaEvent({
    event_name: "AddPaymentInfo",
    event_id: generateEventId("api"),
    custom_data: {
      content_ids: params.contentIds,
      content_type: "product",
      value: params.value,
      currency: params.currency,
    },
  })
}

/**
 * Track Search event
 */
export async function trackSearch(params: {
  searchString: string
  contentIds?: string[]
}): Promise<boolean> {
  return sendMetaEvent({
    event_name: "Search",
    event_id: generateEventId("search"),
    custom_data: {
      search_string: params.searchString,
      content_ids: params.contentIds,
    },
  })
}

/**
 * Track Lead event
 */
export async function trackLead(params: {
  email?: string
  phone?: string
  value?: number
  currency?: string
}): Promise<boolean> {
  return sendMetaEvent({
    event_name: "Lead",
    event_id: generateEventId("lead"),
    user_data: {
      email: params.email,
      phone: params.phone,
    },
    custom_data: {
      value: params.value,
      currency: params.currency,
    },
  })
}

/**
 * Track CompleteRegistration event
 */
export async function trackCompleteRegistration(params: {
  email?: string
  value?: number
  currency?: string
}): Promise<boolean> {
  return sendMetaEvent({
    event_name: "CompleteRegistration",
    event_id: generateEventId("reg"),
    user_data: {
      email: params.email,
    },
    custom_data: {
      value: params.value,
      currency: params.currency,
    },
  })
}
