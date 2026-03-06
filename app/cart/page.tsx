"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, ShoppingBag, AlertTriangle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { PaymentRequestButton } from "@/components/payment-request-button"
import { StripeCheckout } from "@/components/stripe-checkout"
import { formatPrice } from "@/lib/price"
import { trackInitiateCheckout, generateEventId } from "@/lib/meta-pixel"
import { getFbpFbc } from "@/lib/fbp-fbc"
import { getStoredUTMs } from "@/lib/utm-client"

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCart()

  const hasFlexiblePanel = items.some((item) => item.product.id === "prod_U2rtV5Q5yVJ2XV")
  
  // Check if cart has products with mixed currencies (should never happen, but validate)
  const currencies = items.map((item) => item.product.currency || "GBP")
  const uniqueCurrencies = [...new Set(currencies)]
  const hasMixedCurrencies = uniqueCurrencies.length > 1

  // Check if cart has French products (EUR currency)
  const hasFrenchProducts = items.some((item) => item.product.currency === "EUR")
  const currencyCode = hasFrenchProducts ? "EUR" : "GBP"

  // Format prices using utility function to avoid floating point errors
  const formattedTotal = formatPrice(totalPrice, currencyCode)
  const currencySymbol = currencyCode === "EUR" ? "€" : "£"

  const handleInitiateCheckout = () => {
    const eventId = generateEventId("ic")
    const contentIds = items.map((item) => item.product.id)
    const numItems = items.reduce((sum, item) => sum + item.quantity, 0)

    trackInitiateCheckout({
      contentIds,
      numItems,
      value: totalPrice,
      currency: currencyCode,
      eventId,
    })

    // Send CAPI event
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
          content_ids: contentIds,
          num_items: numItems,
          value: totalPrice,
          currency: currencyCode,
          ...utms,
        },
        fbp,
        fbc,
      }),
    }).catch(console.error)
  }

  if (items.length === 0) {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="mt-6 font-serif text-3xl">Your cart is empty</h1>
            <p className="mt-4 text-muted-foreground">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Button asChild className="mt-8" size="lg">
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="mt-4 font-serif text-4xl">Your Cart</h1>
        </div>

        {hasFlexiblePanel && (
          <div className="mb-8 flex items-center gap-3 rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Items in your cart are selling fast!</p>
              <p className="text-xs text-amber-700">
                Only 30 units of Flexible Acoustic Panel remaining. Complete your order now.
              </p>
            </div>
          </div>
        )}

        {hasMixedCurrencies && (
          <div className="mb-8 flex items-center gap-3 rounded-md bg-red-50 border border-red-200 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Invalid cart</p>
              <p className="text-xs text-red-700">
                Your cart contains products from different markets. Please clear your cart and select products from the same market.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-6">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-secondary p-6">
              <h2 className="font-serif text-xl">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{hasFrenchProducts ? "Sous-total" : "Subtotal"}</span>
                  <span>{formatPrice(totalPrice, currencyCode)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{hasFrenchProducts ? "Livraison" : "Shipping"}</span>
                  <span>{hasFrenchProducts ? "Calcule a la caisse" : "Calculated at checkout"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{hasFrenchProducts ? "TVA" : "Tax"}</span>
                  <span>{hasFrenchProducts ? "Calcule a la caisse" : "Calculated at checkout"}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-serif text-xl">{formattedTotal}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <PaymentRequestButton
                  amount={totalPrice}
                  items={items.map((item) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                  }))}
                  currency={currencyCode}
                  onSuccess={(paymentIntent) => {
                    console.log("[v0] Payment success:", paymentIntent)
                    window.location.href = `/thank-you?session_id=${paymentIntent.id}`
                  }}
                  onError={(error) => {
                    console.error("[v0] Payment error:", error)
                    alert(`Payment failed: ${error}`)
                  }}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-secondary px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {hasMixedCurrencies ? (
                  <div className="text-center text-sm text-red-600 font-semibold p-4 bg-red-50 rounded">
                    Please clear your cart to proceed with checkout
                  </div>
                ) : (
                  <StripeCheckout items={items} onInitiateCheckout={handleInitiateCheckout} />
                )}
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">Secure checkout powered by Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
