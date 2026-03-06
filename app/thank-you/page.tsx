import ThankYouClient from "./thank-you-client"

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  // ✓ FIXED: In Next.js 16, searchParams is a Promise and must be awaited
  const params = await searchParams
  const sessionId = params.session_id ?? null
  
  return <ThankYouClient sessionId={sessionId} />
}
