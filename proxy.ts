import { NextRequest, NextResponse } from "next/server"

/**
 * proxy.ts (Next.js 16 + Vercel)
 * - Captura fbclid -> cria _fbc no formato correto: fb.1.<creationTime_ms>.<fbclid>
 * - NÃO recria _fbc se já existir (não “modifica creationTime”)
 * - Cria _fbp se não existir
 * - Salva UTMs em cookie
 *
 * Observação importante:
 * - _fbc/_fbp NÃO devem ser HttpOnly, porque o Pixel (client-side) lê document.cookie.
 *   Se você marca HttpOnly, você pode piorar o match do Pixel.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const url = request.nextUrl
  const sp = url.searchParams

  const isProd = process.env.NODE_ENV === "production"

  const baseCookie = {
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
  }

  // 1) FBC: só cria se tiver fbclid e NÃO existir _fbc
  const fbclid = sp.get("fbclid")
  const existingFbc = request.cookies.get("_fbc")?.value

  if (fbclid && !existingFbc) {
    // creationTime em MILISSEGUNDOS (Date.now), conforme recomendação do diagnóstico
    const creationTimeMs = Date.now()
    const fbc = `fb.1.${creationTimeMs}.${fbclid}`

    response.cookies.set("_fbc", fbc, {
      ...baseCookie,
      maxAge: 90 * 24 * 60 * 60, // 90 dias
      httpOnly: false,
    })
  }

  // 2) FBP: cria se não existir
  const existingFbp = request.cookies.get("_fbp")?.value
  if (!existingFbp) {
    // formato típico: fb.1.<timestamp_ms>.<random>
    const ts = Date.now()
    const rnd = Math.floor(Math.random() * 2147483647)
    const fbp = `fb.1.${ts}.${rnd}`

    response.cookies.set("_fbp", fbp, {
      ...baseCookie,
      maxAge: 90 * 24 * 60 * 60, // 90 dias
      httpOnly: false,
    })
  }

  // 3) UTMs (30 dias)
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
  const utmData: Record<string, string> = {}

  for (const k of utmKeys) {
    const v = sp.get(k)
    if (v) utmData[k] = v
  }

  if (Object.keys(utmData).length) {
    response.cookies.set("_utm_data", JSON.stringify(utmData), {
      ...baseCookie,
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: false,
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
}
