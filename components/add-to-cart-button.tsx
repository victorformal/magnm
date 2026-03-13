"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react"
import { trackAddToCart, generateEventId } from "@/lib/meta-pixel"
import { trackAddToCart as trackTikTokAddToCart } from "@/lib/tiktok-events"
import { getFbpFbc } from "@/lib/fbp-fbc"
import { getStoredUTMs } from "@/lib/utm-client"

interface AddToCartButtonProps {
  product: Product
  variant?: "default" | "icon"
  className?: string
  isFrenchVersion?: boolean
  isEnglishFlexibleAcoustic?: boolean
  /** Callback fired after item is added to cart (FR only) — used for silent add + scroll behavior */
  onAddedToCart?: (orderData: { qty: number; price: number; totalPrice: number; ledFree: boolean }) => void
}

// FR upsell quantity options — base price €34,90/panneau
// original = qty × 34.90 | pack price = discounted total | savings = original - pack
const frQuantities = [
  { qty: 2,  price: 59.00,  original: 69.80,  label: "2 Panneaux",  badge: null,               savings: "€10,80", freeShipping: false, ledFree: false, coverage: "~6 m²",  ideal: "Coin TV ou colonne" },
  { qty: 6,  price: 179.00, original: 209.40, label: "6 Panneaux",  badge: "Meilleure Valeur", savings: "€30,40", freeShipping: true,  ledFree: false, coverage: "~18 m²", ideal: "Mur entier standard" },
  { qty: 8,  price: 229.00, original: 279.20, label: "8 Panneaux",  badge: "Le Plus Populaire",savings: "€50,20", freeShipping: true,  ledFree: false, coverage: "~24 m²", ideal: "Grand salon" },
  { qty: 10, price: 279.00, original: 349.00, label: "10 Panneaux", badge: null,               savings: "€70,00", freeShipping: true,  ledFree: false, coverage: "~30 m²", ideal: "Mur + accent" },
  { qty: 12, price: 329.00, original: 418.80, label: "12 Panneaux", badge: "Pack Pro",         savings: "€89,80", freeShipping: true,  ledFree: true,  coverage: "~36 m²", ideal: "Suite complete" },
]

// EN upsell quantity options for Flexible Acoustic Panel
const enQuantities = [
  { qty: 1, price: 17.90, label: "1 Panel", badge: null, savings: null, freeShipping: false },
  { qty: 2, price: 32.00, label: "2 Panels", badge: null, savings: "£3.80", freeShipping: false },
  { qty: 4, price: 60.00, label: "4 Panels", badge: "Most Popular", savings: "£11.60", freeShipping: true },
  { qty: 6, price: 85.00, label: "6 Panels", badge: "Best Value", savings: "£22.40", freeShipping: true },
]

export function AddToCartButton({ product, variant = "default", className, isFrenchVersion = false, isEnglishFlexibleAcoustic = false, onAddedToCart }: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const router = useRouter()

  // FR: default to 6 panels option (index 1)
  const [selectedQtyOptionFr, setSelectedQtyOptionFr] = useState(frQuantities[1])
  // EN Flexible Acoustic: default to 4 panels option (index 2)
  const [selectedQtyOptionEn, setSelectedQtyOptionEn] = useState(enQuantities[2])
  // Non-FR/EN flexible: simple quantity
  const [quantity, setQuantity] = useState(1)
  
  // Determine which option set to use
  const selectedQtyOption = isFrenchVersion ? selectedQtyOptionFr : selectedQtyOptionEn
  const setSelectedQtyOption = isFrenchVersion ? setSelectedQtyOptionFr : setSelectedQtyOptionEn
  const quantityOptions = isFrenchVersion ? frQuantities : enQuantities

  const handleBuyNow = (overrideQty?: number, overridePrice?: number) => {
    // Check if cart has products with different currency
    const cartHasProducts = items.length > 0
    if (cartHasProducts) {
      const existingProduct = items[0]?.product
      const existingCurrency = existingProduct?.currency
      const newProductCurrency = product.currency

      // Prevent mixing EUR and GBP products
      if (existingCurrency !== newProductCurrency) {
        alert(`Cannot mix products from different markets. Please clear your cart and try again.`)
        return
      }
    }

    const usePackages = isFrenchVersion || isEnglishFlexibleAcoustic

    // FR: always use the discounted pack price (€179/€229/€279/€329)
    const frEffectiveTotal = isFrenchVersion ? selectedQtyOptionFr.price : 0

    const qty = overrideQty ?? (usePackages ? selectedQtyOption.qty : quantity)
    const unitPrice = overridePrice ?? (
      isFrenchVersion
        ? frEffectiveTotal / selectedQtyOptionFr.qty
        : usePackages
          ? selectedQtyOption.price / selectedQtyOption.qty
          : (product.salePrice || product.price)
    )
    const totalValue = overridePrice ?? (
      isFrenchVersion
        ? frEffectiveTotal
        : usePackages
          ? selectedQtyOption.price
          : (product.salePrice || product.price) * quantity
    )

    const eventId = generateEventId("atc")
    const currency = isFrenchVersion ? "EUR" : "GBP"

    // Track Meta
    trackAddToCart({
      contentId: product.id,
      contentName: product.name,
      quantity: qty,
      value: totalValue,
      currency: currency,
      eventId,
    })

    // Track TikTok
    trackTikTokAddToCart({
      contents: [
        {
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
          content_category: product.category,
          price: unitPrice,
          num_items: qty,
          brand: 'Acoustic Design',
        }
      ],
      value: totalValue,
      currency: currency,
      description: product.name,
    })

    // Send CAPI event
    const { fbp, fbc } = getFbpFbc()
    const utms = getStoredUTMs()

    fetch("/api/meta/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "AddToCart",
        eventId,
        pageUrl: window.location.href,
        customData: {
          content_ids: [product.id],
          contents: [{ id: product.id, quantity: qty, item_price: unitPrice }],
          content_name: product.name,
          content_type: "product",
          value: totalValue,
          currency: currency,
          ...utms,
        },
        fbp,
        fbc,
      }),
    }).catch(console.error)

    // For FR/EN upsell, add the selected qty as a single cart entry with adjusted price
    const productToAdd = usePackages
      ? { ...product, price: isFrenchVersion ? frEffectiveTotal / selectedQtyOptionFr.qty : selectedQtyOption.price / selectedQtyOption.qty }
      : product
    addItem(productToAdd, qty)

    // FR: persist order in sessionStorage so /checkout-fr always has data
    if (isFrenchVersion) {
      const orderData = {
        productId: product.id,
        name: product.name,
        price: frEffectiveTotal / selectedQtyOptionFr.qty,
        totalPrice: frEffectiveTotal,
        quantity: selectedQtyOptionFr.qty,
        image: product.images?.[0] || product.image || "",
        currency: "EUR",
        ledFree: selectedQtyOptionFr.ledFree,  // true when 12-panel pack selected
      }
      try {
        sessionStorage.setItem("checkout_order_fr", JSON.stringify(orderData))
      } catch (e) {
        // sessionStorage not available — cart context will be used as fallback
      }

      // FR: if callback provided, do silent add + scroll instead of redirect
      if (onAddedToCart) {
        onAddedToCart({
          qty: selectedQtyOptionFr.qty,
          price: frEffectiveTotal / selectedQtyOptionFr.qty,
          totalPrice: frEffectiveTotal,
          ledFree: selectedQtyOptionFr.ledFree,
        })
        return // Don't redirect — let parent handle scroll to Order Summary
      }
    }

    // Redirect to cart/checkout
    router.push(isFrenchVersion ? "/checkout-fr" : "/cart")
  }

  const displayPrice = product.salePrice || product.price

  // Icon variant for order bump - compact add to cart button
  if (variant === "icon") {
    return (
      <Button
        onClick={() => handleBuyNow(1, displayPrice)}
        size="sm"
        variant="outline"
        className={`gap-1 ${className || ""}`}
        disabled={!product.inStock}
      >
        <ShoppingBag className="h-3 w-3" />
        <span>Add</span>
      </Button>
    )
  }

  // French version: upsell quantity selector + orange CTA button
  if (isFrenchVersion) {
    const selectedFr = selectedQtyOptionFr
    return (
      <div className="flex flex-col gap-3 w-full">
        {/* Quantity upsell cards */}
        <div className="space-y-2">
          {frQuantities.map((option) => {
            const isSelected = selectedFr.qty === option.qty
            return (
              <button
                key={option.qty}
                type="button"
                onClick={() => setSelectedQtyOptionFr(option)}
                className={`w-full rounded-lg border-2 px-4 py-3 transition-all text-left ${
                  isSelected
                    ? "border-[#FF6B00] bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Top row: label + badge + price */}
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{option.label}</span>
                    {option.badge && (
                      <span className={`text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        option.badge.startsWith("Pack Pro") ? "bg-purple-600" : "bg-amber-600"
                      }`}>
                        {option.badge}
                      </span>
                    )}
                    {option.ledFree && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100">
                        Kit LED OFFERT
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-xs text-gray-400 line-through">€{option.original.toFixed(2).replace(".", ",")}</span>
                    <span className="text-sm font-bold text-gray-900">€{option.price.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
                {/* Coverage info */}
                <div className="text-[11px] text-gray-500 mb-1">
                  {option.coverage} - Ideal pour: {option.ideal}
                </div>
                {/* Bottom row: savings + free shipping */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-700 font-medium">Economisez {option.savings}</span>
                  {option.freeShipping && <span className="text-green-700 font-medium">Livraison gratuite</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* LED kit nudge — shown only when pack of 12 is NOT selected */}
        {!selectedFr.ledFree && (
          <div className="flex items-start gap-2 rounded-lg border border-dashed border-amber-400 bg-amber-50 px-3 py-2.5 text-xs text-gray-700">
            <span className="text-base leading-none flex-shrink-0">💡</span>
            <span>
              Passez à <strong className="text-[#FF6B00]">12 Panneaux</strong> et recevez le{" "}
              <a
                href="/product/recessed-led-strip-lighting-fr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2 text-emerald-800 hover:text-emerald-600"
              >
                Kit Ruban LED Encastré
              </a>{" "}
              (valeur €49,00) <strong>OFFERT</strong> — éclairage parfait inclus.
            </span>
          </div>
        )}

        {/* LED kit banner — shown only when pack of 12 is selected */}
        {selectedFr.ledFree && (
          <div className="rounded-lg bg-emerald-800 text-white px-4 py-3 text-xs leading-relaxed">
            <p className="font-bold text-emerald-200 text-[10px] uppercase tracking-wider mb-1">Inclus gratuitement</p>
            <p className="font-semibold text-sm mb-0.5">
              <a
                href="/product/recessed-led-strip-lighting-fr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-white hover:text-emerald-200"
              >
                Kit Ruban LED Encastré
              </a>{" "}
              — OFFERT !
            </p>
            <p className="text-emerald-100 opacity-90">
              8 strips (18&#34;, 26&#34;, 34&#34;, 42&#34; — 2 de chaque), driver LED premium, variateur tactile 10–100%, lumière blanche chaude 3000K. Valeur : €49,00.
            </p>
          </div>
        )}

        {/* Orange CTA button with dynamic copy */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => handleBuyNow()}
          data-add-to-cart="true"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base py-4 px-8 transition-colors duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" />
          Transformer mes {selectedFr.coverage} — {selectedFr.price.toFixed(0)} EUR
        </button>

        {/* Price per panel anchor */}
        <p className="text-center text-xs text-gray-600">
          soit {(selectedFr.price / selectedFr.qty).toFixed(2).replace(".", ",")} EUR / panneau — Economisez {Math.round((1 - selectedFr.price / selectedFr.original) * 100)}% vs piece unique
        </p>

        {/* Trust signals row */}
        <div className="flex items-center justify-center gap-4 flex-wrap text-[11px] text-gray-500">
          <span className="flex items-center gap-1">🔒 Paiement securise</span>
          <span className="flex items-center gap-1">🚚 Livraison gratuite</span>
          <span className="flex items-center gap-1">↩ Retour 30j gratuit</span>
          <span className="flex items-center gap-1">🛡 Garantie 5 ans</span>
        </div>
      </div>
    )
  }

  // English Flexible Acoustic Panel version: upsell quantity selector + orange CTA button
  if (isEnglishFlexibleAcoustic) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {/* Quantity upsell cards */}
        <div className="space-y-2">
          {enQuantities.map((option) => {
            const isSelected = selectedQtyOptionEn.qty === option.qty
            return (
              <button
                key={option.qty}
                type="button"
                onClick={() => setSelectedQtyOptionEn(option)}
                className={`w-full rounded-lg border-2 px-4 py-3 transition-all ${
                  isSelected
                    ? "border-[#FF6B00] bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{option.label}</span>
                    {option.badge && (
                      <span className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        option.badge === "Most Popular" ? "bg-green-600" : "bg-amber-600"
                      }`}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-900">£{option.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  {option.savings ? (
                    <span className="text-green-700 font-medium">Save {option.savings}</span>
                  ) : (
                    <span></span>
                  )}
                  {option.freeShipping && (
                    <span className="text-green-700 font-medium">Free shipping included!</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Orange CTA button */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => handleBuyNow()}
          data-add-to-cart="true"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base py-4 px-8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" />
          Order Now £{selectedQtyOptionEn.price.toFixed(2)}
        </button>

        {/* Reassurance line */}
        <p className="text-center text-xs text-gray-500">
          100% Secure Payment &nbsp;|&nbsp; Free Shipping Over £80
        </p>
      </div>
    )
  }

  // Default English version
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Quantity Selector - compact and centered */}
      <div className="flex h-10 w-32 items-center justify-center border border-border rounded-md">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-full w-10 items-center justify-center transition-colors hover:bg-secondary rounded-l-md"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-12 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-full w-10 items-center justify-center transition-colors hover:bg-secondary rounded-r-md"
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <Button onClick={() => handleBuyNow()} size="lg" className="h-12 w-full" disabled={!product.inStock} data-add-to-cart="true">
        <ShoppingBag className="mr-2 h-4 w-4" />
        {product.currency === "BRL"
          ? `Comprar - R$${(displayPrice * quantity).toFixed(2)}`
          : `Buy Now - £${displayPrice * quantity}`}
      </Button>
    </div>
  )
}
