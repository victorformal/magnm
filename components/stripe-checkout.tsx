"use client"

import { useCallback, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { createCheckoutSession } from "@/app/actions/stripe"
import { trackAddPaymentInfo, formatCartForTikTok, storePurchaseData } from "@/lib/tiktok-events"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  product: {
    id: string
    name: string
    price: number
    salePrice?: number
  }
  quantity: number
}

interface StripeCheckoutProps {
  items: CartItem[]
  onInitiateCheckout?: () => void
}

export function StripeCheckout({ items, onInitiateCheckout }: StripeCheckoutProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    // Generate unique event ID for deduplication
    const eventId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Calculate total
    const totalValue = items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    // Format items for TikTok
    const tiktokItems = formatCartForTikTok(items)

    // Detect currency from items
    const currency = items[0]?.product?.currency || 'GBP'

    // Store purchase data for later (when user completes purchase)
    storePurchaseData({
      contents: tiktokItems,
      value: totalValue,
      currency,
      event_id: eventId,
    })

    // Read Meta cookies _fbc and _fbp from browser
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
      return match ? decodeURIComponent(match[2]) : undefined
    }
    const fbc = getCookie('_fbc')
    const fbp = getCookie('_fbp')

    const { clientSecret } = await createCheckoutSession(
      items, 
      window.location.origin,
      {
        eventId,
        eventSourceUrl: window.location.href,
        fbc,
        fbp,
      }
    )
    return clientSecret!
  }, [items])

  const handleStartCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    
    // Calculate total and items for TikTok
    const totalValue = items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price
      return sum + price * item.quantity
    }, 0)
    const tiktokItems = formatCartForTikTok(items)

    // Track AddPaymentInfo when payment form is shown
    try {
      await trackAddPaymentInfo({
        contents: tiktokItems,
        value: totalValue,
        currency: 'GBP',
      })
    } catch (error) {
      console.error('[v0] Error tracking AddPaymentInfo:', error)
    }

    onInitiateCheckout?.()
    setShowCheckout(true)
    setLoading(false)
  }

  if (showCheckout) {
    return (
      <div className="w-full space-y-3">
        <p className="text-xs text-muted-foreground text-center">
          Supported payment methods: Card, Apple Pay, Google Pay
        </p>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    )
  }

  return (
    <Button
      onClick={handleStartCheckout}
      disabled={loading || items.length === 0}
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        "Proceed to Checkout"
      )}
    </Button>
  )
}

export default StripeCheckout
