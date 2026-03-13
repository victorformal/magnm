// Analytics helper for WOODBOIS FR page
// Integrates with Meta Pixel and Vercel Analytics

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    va?: (...args: unknown[]) => void
  }
}

export const track = (event: string, properties?: Record<string, unknown>) => {
  // Vercel Analytics
  if (typeof window !== "undefined" && window.va) {
    window.va("event", { name: event, ...properties })
  }

  // Facebook Pixel (Meta Ads retargeting)
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, properties)
  }

  // Console log for debugging in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties)
  }
}

// Required events for conversion tracking
export const Events = {
  PAGE_VIEW: () => track("PageView"),
  HERO_CTA_CLICK: () => track("HeroCTAClick"),
  CALCULATOR_USED: (qty: number) => track("CalculatorUsed", { quantity: qty }),
  CALCULATOR_CTA_CLICK: (qty: number) => track("CalculatorCTAClick", { quantity: qty }),
  ADD_TO_CART: (qty: number, value: number) => track("AddToCart", { qty, value, currency: "EUR" }),
  CHECKOUT_INITIATED: () => track("InitiateCheckout"),
  PURCHASE: (value: number) => track("Purchase", { value, currency: "EUR" }),
  FAQ_OPENED: (q: string) => track("FAQOpened", { question: q }),
  SCROLL_50: () => track("Scroll50Percent"),
  SCROLL_CALCULATOR: () => track("ScrolledToCalculator"),
  VIDEO_PLAY: () => track("VideoPlay"),
}

// Helper to track scroll depth
export function useScrollTracking() {
  if (typeof window === "undefined") return

  let scrolled50 = false
  let scrolledCalculator = false

  const handleScroll = () => {
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100

    if (!scrolled50 && scrollPercentage >= 50) {
      scrolled50 = true
      Events.SCROLL_50()
    }

    const calculator = document.getElementById("calculator-section")
    if (!scrolledCalculator && calculator) {
      const rect = calculator.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        scrolledCalculator = true
        Events.SCROLL_CALCULATOR()
      }
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true })
  return () => window.removeEventListener("scroll", handleScroll)
}
