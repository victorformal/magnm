"use client"

import { useCallback, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { createCheckoutSessionFr } from "@/app/actions/stripe"
import { formatCartForTikTok, storePurchaseData } from "@/lib/tiktok-events"
import { Loader2, Lock, Gift, Check, Wrench } from "lucide-react"
import Image from "next/image"

const CLEANER_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg"
const PANEL_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneu01-COvuniuy0UAMH2wAwPKmS9Tlev4Qrt.avif"

interface BonusData {
  bonusPanels: number
  cleanerIncluded: boolean
  technicianIncluded: boolean
  installationCode: string
  bonusValue: number
}

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
  bonusData?: BonusData | null
}

export function StripeCheckoutFr({ items, onInitiateCheckout, bonusData }: StripeCheckoutFrProps) {
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

        {/* Bonus items reminder before payment */}
        {bonusData && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-800">Vos Bonus Inclus</span>
              <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">GRATUIT</span>
            </div>
            <div className="space-y-1.5">
              {/* Bonus panels */}
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded overflow-hidden bg-white flex-shrink-0 border border-amber-200">
                  <Image src={PANEL_IMAGE} alt="Panneaux Bonus" fill className="object-cover" unoptimized />
                </div>
                <span className="text-xs text-amber-900 flex-1">{bonusData.bonusPanels} Panneaux Bonus</span>
                <Check className="w-3.5 h-3.5 text-green-600" />
              </div>
              {/* Cleaner */}
              {bonusData.cleanerIncluded && (
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded overflow-hidden bg-white flex-shrink-0 border border-amber-200">
                    <Image src={CLEANER_IMAGE} alt="Nettoyant Clean" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-xs text-amber-900 flex-1">Nettoyant Clean</span>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
              )}
              {/* Technician */}
              {bonusData.technicianIncluded && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <Wrench className="w-4 h-4 text-amber-700" />
                  </div>
                  <span className="text-xs text-amber-900 flex-1">Technicien installation</span>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
              )}
            </div>
            {/* Installation code reminder */}
            <div className="mt-2 pt-2 border-t border-amber-200 flex items-center justify-between">
              <span className="text-[10px] text-amber-700">Code installation :</span>
              <span className="text-xs font-bold text-amber-900 bg-white border border-amber-200 rounded px-2 py-0.5 tracking-wider">
                {bonusData.installationCode}
              </span>
            </div>
          </div>
        )}

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
