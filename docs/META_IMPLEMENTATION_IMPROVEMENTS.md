# Implementação de Melhorias para Meta Pixels

## 1. Adicionar Logging Estruturado para Monitoramento

Crie o arquivo `/lib/meta/debug.ts`:

\`\`\`typescript
// lib/meta/debug.ts
/**
 * Debug utilities for Meta Pixel and CAPI tracking
 */

export interface MetaDebugLog {
  timestamp: string
  event: string
  pixelId: "primary" | "secondary" | "both"
  eventId: string
  status: "sent" | "error" | "pending"
  details: Record<string, any>
}

const logs: MetaDebugLog[] = []

export function logMetaEvent(data: Omit<MetaDebugLog, "timestamp">) {
  const log: MetaDebugLog = {
    timestamp: new Date().toISOString(),
    ...data,
  }

  logs.push(log)

  // Keep only last 50 logs in memory
  if (logs.length > 50) {
    logs.shift()
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Meta Event]", log)
  }
}

export function getMetaLogs() {
  return logs
}

export function clearMetaLogs() {
  logs.length = 0
}

/**
 * Exported for testing/debugging via window
 */
if (typeof window !== "undefined") {
  (window as any).__META_DEBUG__ = {
    getLogs: getMetaLogs,
    clearLogs: clearMetaLogs,
  }
}
\`\`\`

Após criar, atualize `/lib/meta-pixel.ts` para incluir logging:

\`\`\`typescript
// No topo do arquivo meta-pixel.ts, adicione:
import { logMetaEvent } from "./meta/debug"

// Atualize trackViewContent():
export function trackViewContent(params: {
  contentId: string
  contentName: string
  contentType?: string
  value: number
  currency?: string
  eventId?: string
  pixelId?: "primary" | "secondary" | "both"
}) {
  const eventId = params.eventId || generateEventId("vc")
  const trackBoth = params.pixelId === "both" || params.pixelId === undefined

  logMetaEvent({
    event: "ViewContent",
    pixelId: params.pixelId || "both",
    eventId,
    status: "sent",
    details: {
      contentId: params.contentId,
      contentName: params.contentName,
      value: params.value,
      currency: params.currency || "GBP",
    },
  })

  if (typeof window !== "undefined" && window.fbq) {
    const eventData = {
      content_ids: [params.contentId],
      content_name: params.contentName,
      content_type: params.contentType || "product",
      value: params.value,
      currency: params.currency || "GBP",
    }

    if (params.pixelId === "primary" || trackBoth) {
      window.fbq("track", "ViewContent", eventData, { eventID: eventId })
    }
    if (params.pixelId === "secondary" || trackBoth) {
      window.fbq("track", "ViewContent", eventData, { eventID: eventId })
    }
  }

  return eventId
}
\`\`\`

---

## 2. Adicionar Validação de Cookies FBC/FBP

Crie `/lib/meta/validate.ts`:

\`\`\`typescript
// lib/meta/validate.ts
/**
 * Validates Meta cookies presence and correctness
 */

export interface CookieValidation {
  fbp: {
    present: boolean
    valid: boolean
    value?: string
  }
  fbc: {
    present: boolean
    valid: boolean
    value?: string
  }
  score: number // 0-100
}

export function validateMetaCookies(): CookieValidation {
  if (typeof document === "undefined") {
    return {
      fbp: { present: false, valid: false },
      fbc: { present: false, valid: false },
      score: 0,
    }
  }

  const fbpCookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("_fbp="))
    ?.split("=")[1]

  const fbcCookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("_fbc="))
    ?.split("=")[1]

  // FBP format: fb.1.XXXXXXXXXXX.XXXXXXXXXXX
  const fbpValid = fbpCookie ? /^fb\.\d+\.\d+\.\d+$/.test(fbpCookie) : false

  // FBC format: fb.1.XXXXXXXXXXX.XXXXXXXXXXX
  const fbcValid = fbcCookie ? /^fb\.\d+\.\d+\.\d+$/.test(fbcCookie) : false

  let score = 0
  if (fbpCookie) score += 50
  if (fbpValid) score += 25
  if (fbcCookie) score += 15
  if (fbcValid) score += 10

  return {
    fbp: {
      present: !!fbpCookie,
      valid: fbpValid,
      value: fbpCookie,
    },
    fbc: {
      present: !!fbcCookie,
      valid: fbcValid,
      value: fbcCookie,
    },
    score,
  }
}

/**
 * Log validation to console (development only)
 */
export function logCookieValidation() {
  if (process.env.NODE_ENV === "development") {
    const validation = validateMetaCookies()
    console.log("[Meta Cookies Validation]", {
      fbp: validation.fbp,
      fbc: validation.fbc,
      score: `${validation.score}/100`,
    })
    return validation
  }
}

/**
 * Exported for testing
 */
if (typeof window !== "undefined") {
  (window as any).__META_VALIDATE__ = {
    validateMetaCookies,
    logCookieValidation,
  }
}
\`\`\`

---

## 3. Criar Dashboard de Monitoramento (Opcional)

Crie `/app/admin/meta-debug/page.tsx`:

\`\`\`typescript
// app/admin/meta-debug/page.tsx
"use client"

import { useEffect, useState } from "react"

export default function MetaDebugPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [validation, setValidation] = useState<any>(null)

  useEffect(() => {
    const getLogs = () => {
      if (typeof window !== "undefined" && (window as any).__META_DEBUG__) {
        setLogs((window as any).__META_DEBUG__.getLogs())
      }
    }

    const validateCookies = () => {
      if (typeof window !== "undefined" && (window as any).__META_VALIDATE__) {
        setValidation((window as any).__META_VALIDATE__.validateMetaCookies())
      }
    }

    getLogs()
    validateCookies()

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      getLogs()
      validateCookies()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Meta Pixel Debug Dashboard</h1>

      {/* Validation Section */}
      {validation && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Cookie Validation</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>FBP Cookie:</span>
              <span className={validation.fbp.present ? "text-green-600" : "text-red-600"}>
                {validation.fbp.present ? "✓ Present" : "✗ Missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>FBC Cookie:</span>
              <span className={validation.fbc.present ? "text-green-600" : "text-red-600"}>
                {validation.fbc.present ? "✓ Present" : "✗ Missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Score:</span>
              <span className={validation.score >= 75 ? "text-green-600" : "text-yellow-600"}>
                {validation.score}/100
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Logs Section */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Recent Events ({logs.length})</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No events tracked yet</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="p-2 bg-white rounded border text-sm">
                <div className="font-mono">
                  <span className="text-gray-600">{log.event}</span>
                  {" "}
                  <span className="text-blue-600">{log.pixelId}</span>
                  {" "}
                  <span className={log.status === "sent" ? "text-green-600" : "text-red-600"}>
                    [{log.status}]
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{log.timestamp}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
\`\`\`

---

## 4. Adicionar Verificação no Purchase Event

Atualize `/app/api/meta/purchase-from-session/route.ts`:

\`\`\`typescript
// Adicione este import no topo:
import { getMetaCookies, getClientIpFromHeaders, getUserAgentFromHeaders } from "@/lib/meta/cookies"

// Após enviar o evento, adicione logging:
const metaRes = await sendMetaEvent({
  // ... dados existentes
})

// Adicione logging estruturado:
console.log("[Purchase Event Sent]", {
  timestamp: new Date().toISOString(),
  orderId,
  purchaseEventId,
  pixelId: process.env.META_PIXEL_ID,
  fbc_captured: !!fbc,
  fbp_captured: !!fbp,
  email_present: !!email,
  phone_present: !!phone,
  value,
  currency,
  meta_response: {
    events_received: metaRes.events_received,
    has_error: !!metaRes.error,
  },
})

return NextResponse.json({
  ok: true,
  metaRes,
  debug: {
    session_id,
    orderId,
    purchaseEventId,
    has_email: !!email,
    has_phone: !!phone,
    has_fbc: !!fbc,
    has_fbp: !!fbp,
    has_ip: !!clientIpAddress,
    has_ua: !!clientUserAgent,
    value,
    currency,
  },
})
\`\`\`

---

## 5. Adicionar Test Event Code (se disponível)

Atualize seu `.env`:

\`\`\`bash
# Meta Conversions API
META_PIXEL_ID=2121061958705826
META_ACCESS_TOKEN=your_access_token_here
META_TEST_EVENT_CODE=TEST12345  # Obter do Meta Events Manager
\`\`\`

Atualize `/lib/meta/sendEvent.ts` para usar automaticamente:

\`\`\`typescript
const testEventCode = process.env.META_TEST_EVENT_CODE

if (testEventCode) {
  console.log("[v0] Using Meta test event code:", testEventCode.substring(0, 4) + "***")
}

const apiPayload: { data: typeof eventPayload[]; test_event_code?: string } = {
  data: [eventPayload],
}

if (testEventCode) {
  apiPayload.test_event_code = testEventCode
}
\`\`\`

---

## 6. Verificação Simples via Console

Qualquer usuário pode executar no navegador para verificar:

\`\`\`javascript
// Verificar que fbq foi inicializado
console.log("FBQ disponível:", typeof window.fbq === 'function')

// Ver pixels iniciados
console.log("Meta Pixel inited:", window.__META_PIXEL_INITED__)

// Ver cookies
console.log("FBP:", document.cookie.match(/_fbp=([^;]*)/)?.[1])
console.log("FBC:", document.cookie.match(/_fbc=([^;]*)/)?.[1])

// Ver logs de debug (se implementado)
console.log("Meta Events:", window.__META_DEBUG__?.getLogs())

// Ver validação de cookies
console.log("Cookies Valid:", window.__META_VALIDATE__?.validateMetaCookies())
\`\`\`

---

## Checklist de Implementação

- [ ] Criar `/lib/meta/debug.ts`
- [ ] Atualizar `/lib/meta-pixel.ts` com logging
- [ ] Criar `/lib/meta/validate.ts`
- [ ] Criar `/app/admin/meta-debug/page.tsx` (opcional)
- [ ] Atualizar `/app/api/meta/purchase-from-session/route.ts` com logging
- [ ] Adicionar `META_TEST_EVENT_CODE` ao `.env`
- [ ] Testar via console do navegador
- [ ] Validar eventos em Meta Events Manager
- [ ] Documentar processo de troubleshooting

---

## Como Testar

1. **Abra o site em desenvolvimento**
2. **Execute no console:**
   \`\`\`javascript
   window.__META_DEBUG__?.getLogs()
   window.__META_VALIDATE__?.validateMetaCookies()
   \`\`\`
3. **Faça um pedido de teste**
4. **Verifique se Purchase aparece:**
   - Em `/admin/meta-debug` (se criado)
   - Em Meta Events Manager (~15 min de delay)
   - Com eventId: `purchase_stripe_xxxxx`
