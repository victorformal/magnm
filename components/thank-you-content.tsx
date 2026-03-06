"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight, Truck, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackPurchase } from "@/lib/meta-pixel"

export function ThankYouContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const customerPhone = ""; // Declare customerPhone variable

  useEffect(() => {
    if (!sessionId) {
      setError("No session found")
      setLoading(false)
      return
    }

    const fetchSession = async () => {
      try {
        console.log("[v0] Thank You - Fetching session:", sessionId)
        const response = await fetch(`/api/stripe/session?session_id=${sessionId}`)
        
        console.log("[v0] Thank You - Response status:", response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to fetch session: ${errorData.error}`)
        }

        const data = await response.json()
        console.log("[v0] Thank You - Session data:", data)
        setSessionData(data)

        // Send Purchase event to Meta CAPI server-side
        console.log("[v0] Thank You - Sending Purchase event to Meta...")
        const metaResponse = await fetch("/api/meta/purchase-from-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const metaResult = await metaResponse.json()
        console.log("[v0] Thank You - Meta response:", {
          ok: metaResult.ok,
          events_received: metaResult.events_received,
          fbtrace_id: metaResult.fbtrace_id,
        })

        // Calculate purchase value
        const purchaseValue = Number(data.amount_total) / 100
        const purchaseCurrency = (data.currency || "GBP").toUpperCase()
        const sanitizedEmail = (data.customer_details?.email || "").trim().toLowerCase()
        const isValidEmail = sanitizedEmail && 
                            sanitizedEmail !== "null" && 
                            sanitizedEmail !== "undefined" && 
                            !sanitizedEmail.includes("example.com") &&
                            sanitizedEmail.includes("@")
        const customerEmail = isValidEmail ? sanitizedEmail : undefined

        // Parse contents from metadata if available
        let contentIds: string[] = []
        let contents: any[] = []
        
        if (data.metadata?.content_ids) {
          try {
            contentIds = JSON.parse(data.metadata.content_ids)
            contents = JSON.parse(data.metadata.contents || "[]")
          } catch (e) {
            console.error("[v0] Failed to parse metadata:", e)
          }
        }

        // Track purchase in Meta Pixel (client-side only)
        // Purchase event to CAPI is sent via Stripe webhook in backend
        if (data.amount_total) {
          trackPurchase({
            orderId: sessionId,
            contentIds: contentIds,
            contents: contents,
            value: purchaseValue,
            currency: purchaseCurrency,
          })
        }


      } catch (err) {
        console.error("Failed to fetch session:", err)
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (error || !sessionData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Unable to load your order"}</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  const orderTotal = sessionData.amount_total ? (sessionData.amount_total / 100).toFixed(2) : "0.00"
  const customerEmail = sessionData.customer_details?.email || "Not provided"
  const isFrench = sessionData.metadata?.content_ids?.includes('-fr') || false

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">
          {isFrench ? 'Félicitations !' : 'Order Confirmed!'}
        </h1>
        <p className="text-muted-foreground">
          {isFrench 
            ? 'Félicitations pour votre achat, vous recevrez votre commande dans 5 à 8 jours ouvrables ! Expédition sous 24-48h après commande. En cas de questions, envoyez un email à homepanel@panel.com'
            : `Thank you for your purchase. We've sent a confirmation email to ${customerEmail}`}
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
            <p className="font-mono text-sm">{sessionId.slice(-8)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-xl font-bold">£{orderTotal}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">Email</p>
          <p className="text-sm">{customerEmail}</p>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-secondary/30 border border-border/50 rounded-lg p-6 mb-8">
        <h2 className="font-serif text-lg font-medium mb-4">Delivery Information</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-sm">Estimated Delivery Time</p>
              <p className="text-muted-foreground text-sm mt-1">
                Your order will arrive in approximately <strong>14 business days</strong>. Delivery times may vary depending on your location.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-sm">Track Your Order</p>
              <p className="text-muted-foreground text-sm mt-1">
                Keep an eye on your email inbox! We will send you tracking information as soon as your order is shipped so you can follow its journey to you.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button className="w-full">
            Explore More <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
