"use client"

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: any
  }
}

// ONLY Pixel ID from environment variable
// The pixel script is loaded via layout.tsx <head> with strategy="beforeInteractive"
// This provider only renders the <noscript> fallback and wraps children.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "2453601435024296"

export function MetaPixelProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fallback noscript para ambientes sem JS */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {children}
    </>
  )
}
