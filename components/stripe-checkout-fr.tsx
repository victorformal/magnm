"use client"

import { useCallback, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { createCheckoutSessionFr } from "@/app/actions/stripe"
import { formatCartForTikTok, storePurchaseData } from "@/lib/tiktok-events"
import { Loader2, Lock } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  product: {
    id: string
    name: string
    price: number
    salePrice?: number
    currency?: string
  }
  quantity: number
}

interface StripeCheckoutFrProps {
  items: CartItem[]
  onInitiateCheckout?: () => void
}

export function StripeCheckoutFr({ items, onInitiateCheckout }: StripeCheckoutFrProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    const eventId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const totalValue = items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price
      return sum + price * item.quantity
    }, 0)

    const tiktokItems = formatCartForTikTok(items)

    storePurchaseData({
      contents: tiktokItems,
      value: totalValue,
      currency: "EUR",
      event_id: eventId,
    })

    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
      return match ? decodeURIComponent(match[2]) : undefined
    }
    const fbc = getCookie("_fbc")
    const fbp = getCookie("_fbp")

    const { clientSecret } = await createCheckoutSessionFr(items, window.location.origin, {
      eventId,
      eventSourceUrl: window.location.href,
      fbc,
      fbp,
    })
    return clientSecret!
  }, [items])

  const handleStartCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    onInitiateCheckout?.()
    setShowCheckout(true)
    setLoading(false)
  }

  if (showCheckout) {
    return (
      <div className="w-full space-y-3">
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          Paiement 100% Sécurisé SSL • Visa, Mastercard, American Express
        </p>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    )
  }

  return (
    <button
      onClick={handleStartCheckout}
      disabled={loading || items.length === 0}
      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-lg py-4 px-8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          <Lock className="h-5 w-5 flex-shrink-0" />
          Confirmer ma commande
        </>
      )}
    </button>
  )
}
