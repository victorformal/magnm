/**
 * Client-side UTM utilities
 * Safe to import in client components, doesn't use server-only APIs
 */

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  fbclid?: string
  gclid?: string
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const

/**
 * Client-side: Capture UTMs from URL and persist to localStorage
 */
export function captureAndPersistUTMs(): UTMParams {
  if (typeof window === "undefined") return {}

  const urlParams = new URLSearchParams(window.location.search)
  const utms: UTMParams = {}

  UTM_KEYS.forEach((key) => {
    const value = urlParams.get(key)
    if (value) {
      utms[key] = value
    }
  })

  if (Object.keys(utms).length > 0) {
    try {
      const existing = getStoredUTMs()
      const merged = { ...existing, ...utms }
      localStorage.setItem("slatura_utms", JSON.stringify(merged))
    } catch (e) {
      console.error("Error persisting UTMs:", e)
    }
  }

  return utms
}

/**
 * Client-side: Get stored UTMs from localStorage
 */
export function getStoredUTMs(): UTMParams {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem("slatura_utms")
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Client-side: Get UTMs from cookie string
 */
export function getUTMsFromCookie(cookieHeader?: string): UTMParams {
  if (!cookieHeader) return {}

  try {
    const match = cookieHeader.match(/slatura_utms=([^;]+)/)
    if (match) {
      return JSON.parse(decodeURIComponent(match[1]))
    }
  } catch {
    // Ignore parse errors
  }

  return {}
}
