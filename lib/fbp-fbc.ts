// Meta _fbp and _fbc cookie utilities

// Generate _fbp cookie value if missing
export function getOrCreateFbp(): string {
  if (typeof window === "undefined") return ""

  // Check if _fbp already exists
  const existingFbp = getCookie("_fbp")
  if (existingFbp) return existingFbp

  // Generate new _fbp: fb.1.{timestamp}.{random}
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000000000)
  const fbp = `fb.1.${timestamp}.${random}`

  // Set cookie
  document.cookie = `_fbp=${fbp};path=/;max-age=${60 * 60 * 24 * 400};SameSite=Lax`

  return fbp
}

// Generate _fbc cookie from fbclid if present in URL
export function getOrCreateFbc(): string {
  if (typeof window === "undefined") return ""

  // Check if _fbc already exists
  const existingFbc = getCookie("_fbc")

  // Check for fbclid in URL
  const urlParams = new URLSearchParams(window.location.search)
  const fbclid = urlParams.get("fbclid")

  if (fbclid) {
    // Generate _fbc: fb.1.{timestamp}.{fbclid}
    const timestamp = Date.now()
    const fbc = `fb.1.${timestamp}.${fbclid}`

    // Set cookie
    document.cookie = `_fbc=${fbc};path=/;max-age=${60 * 60 * 24 * 400};SameSite=Lax`

    return fbc
  }

  return existingFbc || ""
}

// Get cookie value by name
export function getCookie(name: string): string {
  if (typeof window === "undefined") return ""

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : ""
}

// Get fbp and fbc values
export function getFbpFbc(): { fbp: string; fbc: string } {
  return {
    fbp: getOrCreateFbp(),
    fbc: getOrCreateFbc(),
  }
}

// Parse fbp/fbc from cookie header (server-side)
export function parseFbpFbcFromCookies(cookieHeader?: string): { fbp: string; fbc: string } {
  if (!cookieHeader) return { fbp: "", fbc: "" }

  const fbpMatch = cookieHeader.match(/_fbp=([^;]+)/)
  const fbcMatch = cookieHeader.match(/_fbc=([^;]+)/)

  return {
    fbp: fbpMatch ? fbpMatch[1] : "",
    fbc: fbcMatch ? fbcMatch[1] : "",
  }
}
