"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { StripeCheckoutFr } from "@/components/stripe-checkout-fr"
import { ArrowLeft, Lock, Package, RotateCcw, Star } from "lucide-react"
import { trackInitiateCheckout, generateEventId } from "@/lib/meta-pixel"
import { getFbpFbc } from "@/lib/fbp-fbc"
import { getStoredUTMs } from "@/lib/utm-client"

// Shape that comes from sessionStorage
interface StoredOrder {
  productId: string
  name: string
  price: number       // unit price
  totalPrice: number  // qty * unit
  quantity: number
  image: string
  currency: string
  ledFree?: boolean   // true when 12-panel pack (Kit LED included)
}

const LED_KIT_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg"
const LED_KIT_PRODUCT_URL = "/product/recessed-led-strip-lighting-fr"

export default function CheckoutFrPage() {
  const router = useRouter()
  const { items } = useCart()
  const [initiated, setInitiated] = useState(false)

  // Source of truth: sessionStorage first, then cart context
  const [storedOrder, setStoredOrder] = useState<StoredOrder | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("checkout_order_fr")
      if (raw) {
        setStoredOrder(JSON.parse(raw))
        setReady(true)
        return
      }
    } catch (e) {
      // ignore parse errors
    }

    // Fallback: build from cart context (EUR items only)
    const frItems = items.filter((i) => i.product.currency === "EUR")
    if (frItems.length > 0) {
      const first = frItems[0]
      const unitPrice = first.product.salePrice || first.product.price
      setStoredOrder({
        productId: first.product.id,
        name: first.product.name,
        price: unitPrice,
        totalPrice: unitPrice * first.quantity,
        quantity: first.quantity,
        image: first.product.images?.[0] || first.product.image || "",
        currency: "EUR",
      })
      setReady(true)
      return
    }

    // Nothing in sessionStorage or cart → redirect back
    router.replace("/product/flexible-acoustic-panel-fr")
  }, [items, router])

  if (!ready || !storedOrder) return null

  const totalEur = storedOrder.totalPrice
  const isFreeShipping = totalEur >= 80

  // Build a cart-like item array for StripeCheckoutFr
  const checkoutItems = [
    {
      product: {
        id: storedOrder.productId,
        name: storedOrder.name,
        price: storedOrder.price,
        salePrice: storedOrder.price,
        currency: "EUR" as const,
        image: storedOrder.image,
        images: [storedOrder.image],
      } as any,
      quantity: storedOrder.quantity,
    },
  ]

  const handleInitiateCheckout = () => {
    if (initiated) return
    setInitiated(true)

    const eventId = generateEventId("ic")

    trackInitiateCheckout({
      contentIds: [storedOrder.productId],
      numItems: storedOrder.quantity,
      value: totalEur,
      currency: "EUR",
      eventId,
    })

    const { fbp, fbc } = getFbpFbc()
    const utms = getStoredUTMs()

    fetch("/api/meta/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "InitiateCheckout",
        eventId,
        pageUrl: window.location.href,
        customData: {
          content_ids: [storedOrder.productId],
          num_items: storedOrder.quantity,
          value: totalEur,
          currency: "EUR",
          ...utms,
        },
        fbp,
        fbc,
      }),
    }).catch(console.error)
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4] py-8 px-4">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/product/flexible-acoustic-panel-fr"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Commande 100% Sécurisée</span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="rounded-xl bg-white border border-border shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">
            Récapitulatif de la commande
          </h2>

          {/* Main product item */}
          <div className="flex items-center gap-3 mb-3">
            {storedOrder.image && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary/30 flex-shrink-0">
                <Image
                  src={storedOrder.image}
                  alt={storedOrder.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{storedOrder.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Qté : {storedOrder.quantity}</p>
            </div>
            <p className="text-sm font-semibold flex-shrink-0">€{totalEur.toFixed(2)}</p>
          </div>

          {/* LED kit bonus item — only shown for 12-panel pack */}
          {storedOrder.ledFree && (
            <div className="flex items-center gap-3 mb-4 rounded-lg border border-dashed border-emerald-400 bg-emerald-50 px-3 py-2.5">
              <a href={LED_KIT_PRODUCT_URL} target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 block border border-emerald-200">
                <Image
                  src={LED_KIT_IMAGE}
                  alt="Kit Ruban LED Encastré"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </a>
              <div className="flex-1 min-w-0">
                <a
                  href={LED_KIT_PRODUCT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium leading-tight text-emerald-800 underline underline-offset-2 hover:text-emerald-600"
                >
                  Kit Ruban LED Encastré
                </a>
                <p className="text-xs text-emerald-700 mt-0.5">Bonus Pack Pro — inclus gratuitement</p>
              </div>
              <p className="text-sm font-semibold flex-shrink-0 text-emerald-700 line-through opacity-60">€49,00</p>
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span className={isFreeShipping ? "text-green-600 font-semibold" : ""}>
                {isFreeShipping ? "GRATUITE" : "€7,00"}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">€{totalEur.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="rounded-xl bg-white border border-border shadow-sm p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Paiement 100% sécurisé SSL</span>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Livraison 5-8 jours ouvrables</span>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Retour gratuit sous 30 jours</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">4.8/5 — 2 847 avis clients</span>
            </div>
          </div>
        </div>

        {/* Stripe Embedded Checkout */}
        <div className="rounded-xl bg-white border border-border shadow-sm p-5 mb-4">
          <StripeCheckoutFr items={checkoutItems} onInitiateCheckout={handleInitiateCheckout} />

          {/* Payment icons */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
            {["Visa", "Mastercard", "Amex"].map((method) => (
              <span
                key={method}
                className="inline-block border border-border rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-secondary/30"
              >
                {method}
              </span>
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            Vos données sont cryptées et 100% sécurisées
          </p>
        </div>

      </div>
    </div>
  )
}
