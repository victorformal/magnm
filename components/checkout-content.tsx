"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight, Package } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const { clearCart } = useCart()

  useEffect(() => {
    if (success === "true") {
      clearCart()
    }
  }, [success, clearCart])

  if (success === "true") {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-accent" />
            <h1 className="mt-6 font-serif text-3xl sm:text-4xl">Thank You for Your Order!</h1>
            <p className="mt-4 text-muted-foreground">
              We&apos;ve received your order and will send you a confirmation email shortly. Your beautiful new pieces
              are on their way.
            </p>

            <div className="mt-8 rounded-sm bg-secondary p-6">
              <div className="flex items-center justify-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Estimated delivery: 5-10 business days</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-serif text-3xl">Checkout</h1>
          <p className="mt-4 text-muted-foreground">Redirecting to secure checkout...</p>
        </div>
      </div>
    </div>
  )
}
