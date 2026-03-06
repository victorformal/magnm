import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const { amount, currency = "gbp" } = await request.json()

    if (!amount || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return Response.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Payment intent error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create payment intent"
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
