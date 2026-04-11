// Meta Conversions API (Server-Side)
import crypto from "crypto"

const META_API_VERSION = "v20.0"

interface UserData {
  em?: string // email (will be hashed)
  ph?: string // phone (will be hashed)
  client_ip_address?: string
  client_user_agent?: string
  fbp?: string
  fbc?: string
  external_id?: string
}

interface CustomData {
  currency?: string
  value?: number
  order_id?: string
  content_ids?: string[]
  contents?: Array<{ id: string; quantity: number; item_price?: number }>
  content_type?: string
  content_name?: string
  num_items?: number
  // UTM params
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

interface CAPIEvent {
  event_name: string
  event_time: number
  event_id: string
  action_source: "website"
  event_source_url: string
  user_data: UserData
  custom_data?: CustomData
}

// SHA-256 hash function with normalization
function sha256Hash(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex")
}

// Normalize and hash email
function hashEmail(email: string): string {
  const normalized = email.trim().toLowerCase()
  return sha256Hash(normalized)
}

// Normalize and hash phone (digits only)
function hashPhone(phone: string): string {
  const normalized = phone.replace(/\D/g, "")
  return sha256Hash(normalized)
}

// Send event to Meta Conversions API
export async function sendCAPIEvent(params: {
  eventName: string
  eventId: string
  eventSourceUrl: string
  userData: {
    email?: string
    phone?: string
    clientIpAddress?: string
    clientUserAgent?: string
    fbp?: string
    fbc?: string
    externalId?: string
  }
  customData?: CustomData
}): Promise<{ success: boolean; error?: string }> {
  const accessToken = process.env.META_ACCESS_TOKEN

  if (!accessToken) {
    console.error("[Meta CAPI] META_ACCESS_TOKEN not configured")
    return { success: false, error: "META_ACCESS_TOKEN not configured" }
  }

  // Build user_data with hashed PII
  const userData: Record<string, string | undefined> = {}

  if (params.userData.email) {
    userData.em = hashEmail(params.userData.email)
  }
  if (params.userData.phone) {
    userData.ph = hashPhone(params.userData.phone)
  }
  if (params.userData.clientIpAddress) {
    userData.client_ip_address = params.userData.clientIpAddress
  }
  if (params.userData.clientUserAgent) {
    userData.client_user_agent = params.userData.clientUserAgent
  }
  if (params.userData.fbp) {
    userData.fbp = params.userData.fbp
  }
  if (params.userData.fbc) {
    userData.fbc = params.userData.fbc
  }
  if (params.userData.externalId) {
    userData.external_id = sha256Hash(params.userData.externalId)
  }

  const event: CAPIEvent = {
    event_name: params.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website",
    event_source_url: params.eventSourceUrl,
    user_data: userData,
  }

  if (params.customData) {
    event.custom_data = params.customData
  }

  const payload: Record<string, unknown> = {
    data: [event],
  }

  // Add test event code if configured
  const testEventCode = process.env.META_TEST_EVENT_CODE
  if (testEventCode) {
    payload.test_event_code = testEventCode
  }

  try {
    const pixelId = process.env.META_PIXEL_ID || "2453601435024296"

    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    )

    const result = await response.json()

    if (!response.ok) {
      console.error("[Meta CAPI] Error:", result)
      return { success: false, error: JSON.stringify(result) }
    }

    return { success: true }
  } catch (error) {
    console.error("[Meta CAPI] Request failed:", error)
    return { success: false, error: String(error) }
  }
}
