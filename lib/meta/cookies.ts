import { cookies } from 'next/headers'

/**
 * Reads fbc and fbp from cookies
 * Used by server-side code to include in Meta Conversions API requests
 */
export async function getMetaCookies(): Promise<{ fbc?: string; fbp?: string }> {
  try {
    const cookieStore = await cookies()
    const fbc = cookieStore.get('_fbc')?.value
    const fbp = cookieStore.get('_fbp')?.value

    return {
      fbc,
      fbp,
    }
  } catch (error) {
    console.error('[v0] Error reading meta cookies:', error)
    return {}
  }
}

/**
 * Gets the client IP address from request headers
 */
export function getClientIpFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    undefined
  )
}

/**
 * Gets the user agent from request headers
 */
export function getUserAgentFromHeaders(headers: Headers): string | undefined {
  return headers.get('user-agent') || undefined
}
