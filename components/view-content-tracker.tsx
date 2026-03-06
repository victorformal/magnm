"use client"

import { useEffect } from "react"
import { trackViewContent, generateEventId } from "@/lib/meta-pixel"
import { trackViewContent as trackTikTokViewContent } from "@/lib/tiktok-events"
import { getFbpFbc } from "@/lib/fbp-fbc"
import { getStoredUTMs } from "@/lib/utm-client"
import type { Product } from "@/lib/products"

interface ViewContentTrackerProps {
  product: Product
}

export function ViewContentTracker({ product }: ViewContentTrackerProps) {
  useEffect(() => {
    const eventId = generateEventId("vc")
    const price = product.salePrice || product.price

    // Track client-side (Meta)
    trackViewContent({
      contentId: product.id,
      contentName: product.name,
      contentType: "product",
      value: price,
      currency: "GBP",
      eventId,
    })

    // Track TikTok ViewContent
    trackTikTokViewContent({
      contents: [
        {
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
          content_category: product.category,
          price: price,
          num_items: 1,
          brand: 'Acoustic Design',
        }
      ],
      value: price,
      currency: 'GBP',
      description: product.description,
    })

    // Send server-side CAPI event (Meta)
    const { fbp, fbc } = getFbpFbc()
    const utms = getStoredUTMs()

    fetch("/api/meta/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "ViewContent",
        eventId,
        pageUrl: window.location.href,
        customData: {
          content_ids: [product.id],
          content_name: product.name,
          content_type: "product",
          value: price,
          currency: "GBP",
          ...utms,
        },
        fbp,
        fbc,
      }),
    }).catch(console.error)
  }, [product])

  return null
}
