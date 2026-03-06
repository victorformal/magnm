/**
 * Server-side UTM utilities
 * Uses next/headers - only import in server components and server actions
 */

import { cookies } from "next/headers"

/**
 * Server-side: Get UTM data from _utm_data cookie (set by proxy.ts)
 */
export async function getUTMDataFromCookie(): Promise<Record<string, string>> {
  try {
    const cookieStore = await cookies()
    const utmCookie = cookieStore.get("_utm_data")?.value

    if (!utmCookie) return {}

    return JSON.parse(utmCookie)
  } catch (error) {
    console.warn("[UTM] Error parsing _utm_data cookie:", error)
    return {}
  }
}
