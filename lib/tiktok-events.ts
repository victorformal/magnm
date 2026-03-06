/**
 * TikTok Events Helper
 * Implements all TikTok Pixel events with proper data formatting
 */

interface TikTokContent {
  content_id?: string
  content_type?: 'product' | 'product_group'
  content_name?: string
  content_category?: string
  price?: number
  num_items?: number
  brand?: string
}

interface TikTokTrackData {
  contents?: TikTokContent[]
  value?: number
  currency?: string
  search_string?: string
  description?: string
  status?: string
}

interface TikTokIdentifyData {
  email?: string
  phone_number?: string
  external_id?: string
}

declare global {
  interface Window {
    ttq?: {
      track: (eventName: string, data: Record<string, any>, options?: Record<string, any>) => void
      identify: (data: Record<string, any>) => void
      page: () => void
    }
  }
}

/**
 * SHA-256 hash function for PII data (client-side using SubtleCrypto)
 */
async function hashSHA256(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return data
}

/**
 * Wait for TikTok script to load with retries
 */
async function waitForTikTok(maxAttempts = 20, delayMs = 100): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    if (typeof window !== 'undefined' && window.ttq) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  console.warn('[v0] TikTok - Script not available after', maxAttempts * delayMs, 'ms')
  return false
}

/**
 * Identify user with PII data (hashed)
 */
export async function trackIdentify(data: TikTokIdentifyData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  const identifyData: Record<string, any> = {}
  
  if (data.email) {
    identifyData.email = await hashSHA256(data.email.toLowerCase().trim())
  }
  if (data.phone_number) {
    identifyData.phone_number = await hashSHA256(data.phone_number.replace(/\D/g, ''))
  }
  if (data.external_id) {
    identifyData.external_id = await hashSHA256(data.external_id)
  }

  try {
    window.ttq.identify(identifyData)
    console.log('[v0] TikTok - User identified')
  } catch (error) {
    console.error('[v0] TikTok - Error in identify:', error)
  }
}

/**
 * Track ViewContent event - when user views product/page
 */
export async function trackViewContent(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('ViewContent', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
      description: data.description || '',
    })
    console.log('[v0] TikTok - ViewContent tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking ViewContent:', error)
  }
}

/**
 * Track AddToWishlist event
 */
export async function trackAddToWishlist(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('AddToWishlist', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
    })
    console.log('[v0] TikTok - AddToWishlist tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking AddToWishlist:', error)
  }
}

/**
 * Track Search event
 */
export async function trackSearch(searchString: string, data?: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('Search', {
      contents: data?.contents || [],
      value: data?.value || 0,
      currency: data?.currency || 'GBP',
      search_string: searchString,
    })
    console.log('[v0] TikTok - Search tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking Search:', error)
  }
}

/**
 * Track AddPaymentInfo event
 */
export async function trackAddPaymentInfo(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('AddPaymentInfo', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
      description: data.description || '',
    })
    console.log('[v0] TikTok - AddPaymentInfo tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking AddPaymentInfo:', error)
  }
}

/**
 * Track AddToCart event
 */
export async function trackAddToCart(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('AddToCart', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
      description: data.description || '',
    })
    console.log('[v0] TikTok - AddToCart tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking AddToCart:', error)
  }
}

/**
 * Track InitiateCheckout event
 */
export async function trackInitiateCheckout(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('InitiateCheckout', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
      description: data.description || '',
    })
    console.log('[v0] TikTok - InitiateCheckout tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking InitiateCheckout:', error)
  }
}

/**
 * Track PlaceAnOrder event
 */
export async function trackPlaceAnOrder(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('PlaceAnOrder', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
      status: data.status || 'submitted',
    })
    console.log('[v0] TikTok - PlaceAnOrder tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking PlaceAnOrder:', error)
  }
}

/**
 * Track CompleteRegistration event
 */
export async function trackCompleteRegistration(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('CompleteRegistration', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
      status: data.status || 'completed',
    })
    console.log('[v0] TikTok - CompleteRegistration tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking CompleteRegistration:', error)
  }
}

/**
 * Track Purchase event (with full parameters)
 */
export async function trackPurchase(data: TikTokTrackData) {
  const isAvailable = await waitForTikTok()
  if (!isAvailable || !window.ttq) return

  try {
    window.ttq.track('Purchase', {
      contents: data.contents || [],
      value: data.value || 0,
      currency: data.currency || 'GBP',
      description: data.description || '',
      status: data.status || 'completed',
    })
    console.log('[v0] TikTok - Purchase tracked')
  } catch (error) {
    console.error('[v0] TikTok - Error tracking Purchase:', error)
  }
}

/**
 * Format cart items for TikTok
 */
export function formatCartForTikTok(items: Array<{ product: any; quantity: number }>) {
  return items.map((item) => ({
    content_id: item.product.id,
    content_type: 'product' as const,
    content_name: item.product.name,
    content_category: item.product.category,
    price: item.product.salePrice || item.product.price,
    num_items: item.quantity,
    brand: 'Acoustic Design',
  }))
}

/**
 * Store purchase data for later tracking on success page
 */
export function storePurchaseData(data: TikTokTrackData) {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.setItem('tiktok_purchase_data', JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    }))
    console.log('[v0] TikTok - Purchase data stored')
  } catch (e) {
    console.error('[v0] Error storing purchase data:', e)
  }
}
