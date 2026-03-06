# Auditoria Crítica - Problemas Encontrados e Soluções

## PROBLEMA 1: HttpOnly vs Client-side Document.Cookie Read
**Severidade: CRÍTICA**

### Issue Found
- `/proxy.ts`: httpOnly = true ✓ (CORRETO)
- `/components/stripe-checkout.tsx` linhas 30-44: `function getMetaCookies()` tenta ler com `document.cookie`

\`\`\`typescript
// ❌ PROBLEMA: Não consegue ler _fbc/_fbp se estão HttpOnly
const cookies = document.cookie.split(";").reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split("=")
  if (key) acc[key] = value
  return acc
}, {} as Record<string, string>)
\`\`\`

### Impacto
- Cookies _fbc e _fbp marcados como HttpOnly não são acessíveis no client
- A função `getMetaCookies()` retorna sempre `{}`, perdendo os dados de atribuição
- O trackingData enviado para `createCheckoutSession` não tem fbc/fbp

### Solução Correta
✓ Remover a tentativa de leitura no client  
✓ Ler fbc/fbp APENAS no server (onde cookies são acessíveis)  
✓ Passar para metadata do Stripe e recuperar no webhook

**Status**: FÁCIL DE CORRIGIR - removemos getMetaCookies() do cliente

---

## PROBLEMA 2: Falta de Idempotência Real no Webhook
**Severidade: CRÍTICA**

### Issue Found
- `/app/api/stripe/webhook/route.ts`: Não há persistência de "already processed" markers
- Se Stripe reenviar o mesmo evento (retry), você envia Purchase duplicado para Meta

\`\`\`typescript
// ❌ PROBLEMA: Nenhuma verificação se já foi processado
switch (event.type) {
  case "checkout.session.completed": {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status === "paid") {
      await handlePurchaseEvent(session)  // ← Sem idempotência
    }
  }
}
\`\`\`

### Impacto
- Webhook retry de Stripe = múltiplos Purchase duplicados na Meta
- Mesmo com event_id, depende de como Meta deduplicar (não é garantido)
- Custo: ROI inflado, budget gasto com conversões fantasma

### Solução Correta
✓ Usar Upstash KV para persistir `processed:stripe_event_{id}`  
✓ Verificar antes de processar:
\`\`\`typescript
const processed = await kv.get(`processed:stripe_${event.id}`)
if (processed) return NextResponse.json({ received: true })
// processar...
await kv.set(`processed:stripe_${event.id}`, "true", { ex: 86400 })
\`\`\`

**Status**: REQUER KV Storage (Upstash)

---

## PROBLEMA 3: Event Time Não Vem do Stripe
**Severidade: ALTA**

### Issue Found
- `/lib/meta/sendEvent.ts` linha 70:
\`\`\`typescript
event_time: data.eventTime || Math.floor(Date.now() / 1000),  // ❌ PROBLEMA
\`\`\`

- Quando o webhook envia Purchase, event_time vem como undefined
- Usa Date.now() que é QUANDO O WEBHOOK FOI PROCESSADO, não quando foi pago

### Impacto
- Event time pode estar horas/dias diferente do tempo real do pagamento
- Meta depende de event_time para atribuição em janelas de conversão

### Solução Correta
✓ Usar `created` do Stripe (unix timestamp em segundos):
\`\`\`typescript
// No webhook, ao chamar sendPurchaseEvent:
await sendPurchaseEvent({
  // ...
  eventTime: Math.floor(session.created),  // ← Timestamp do Stripe
})
\`\`\`

**Status**: FÁCIL DE CORRIGIR - adicionar eventTime no webhook

---

## PROBLEMA 4: Currency Não É Uppercase Consistentemente
**Severidade**: MÉDIA

### Issue Found
- `/lib/meta/sendEvent.ts` linha 96:
\`\`\`typescript
...(data.customData.currency && { currency: data.customData.currency }),
\`\`\`

- Stripe retorna lowercase: "eur", "gbp", "usd"
- Meta espera UPPERCASE: "EUR", "GBP", "USD"
- Já tem `.toUpperCase()` em sendPurchaseEvent, mas sendMetaEvent não garante

### Impacto
- Meta pode rejeitar ou não reconhecer a moeda
- Quebra attribution de multi-moeda

### Solução Correta
✓ Forçar uppercase na camada de sendMetaEvent:
\`\`\`typescript
currency: data.customData.currency?.toUpperCase() || undefined
\`\`\`

**Status**: FÁCIL DE CORRIGIR

---

## PROBLEMA 5: IP Address Pode Estar Vazio
**Severidade: ALTA**

### Issue Found
- `/lib/meta/cookies.ts`: Função `getClientIpFromHeaders()` provavelmente não trata Vercel corretamente

### Impacto
- Sem IP, EMQ cai (Email Match Quality)
- Meta não consegue fazer cross-device matching

### Solução Correta
\`\`\`typescript
function getClientIpFromHeaders(headers: Headers): string | undefined {
  // Tentar x-forwarded-for primeiro (proxy Vercel)
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded && forwarded !== "") {
    return forwarded.split(",")[0].trim()
  }
  
  // Fallback
  const ip = headers.get("cf-connecting-ip") || 
             headers.get("x-real-ip") ||
             headers.get("x-client-ip")
  
  return ip && ip !== "" ? ip : undefined
}
\`\`\`

**Status**: TESTAR + VERIFICAR

---

## PROBLEMA 6: Event Source URL Inconsistente
**Severidade: MÉDIA**

### Issue Found
- `/app/api/meta/event/route.ts` linha 47:
\`\`\`typescript
const eventSourceUrl = body.event_source_url || request.headers.get('referer') || undefined
\`\`\`

- Pode vir vazio ou de referer que não é confiável
- No webhook, usa metadata.event_source_url que pode estar desatualizado

### Solução Correta
✓ Usar APP_URL como fallback seguro:
\`\`\`typescript
const eventSourceUrl = body.event_source_url || 
  request.headers.get('referer') || 
  process.env.APP_URL || 
  undefined
\`\`\`

**Status**: FÁCIL DE CORRIGIR

---

## PROBLEMA 7: Phone Hashing Sem E.164
**Severidade: ALTA**

### Issue Found
- `/lib/meta/hash.ts`: Provavelmente normaliza só dígitos, sem country code

### Impacto
- Phone hash pode ser inválido
- Meta não consegue fazer match
- EMQ fica ruim

### Solução Correta
✓ Normalizar para E.164 antes de hashear:
\`\`\`typescript
function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined
  
  // Remove tudo que não for dígito ou +
  let cleaned = phone.replace(/[^\d+]/g, '')
  
  // Se não tem +, assume +1 (USA) ou parse de country
  if (!cleaned.startsWith('+')) {
    cleaned = '+1' + cleaned
  }
  
  return cleaned // Agora em E.164
}
\`\`\`

**Status**: VERIFICAR hash.ts

---

## PROBLEMA 8: Logs Expõem PII Crítica
**Severidade: MÉDIA**

### Issue Found
- Várias console.log que podem logar email, phone parcialmente

### Impacto
- Violação de privacidade
- Dados sensíveis em logs públicos

### Solução Correta
✓ Nunca logar email/phone raw
✓ Logar apenas hash ou padrão:
\`\`\`typescript
// ❌ NÃO FAZER
console.log("Email:", data.userData?.email)

// ✓ FAZER
console.log("Has email:", !!data.userData?.email)
console.log("Email hash:", emailHash?.substring(0, 8) + "...")
\`\`\`

**Status**: AUDIT TODO código

---

## RESUMO DE AÇÕES PRIORITÁRIAS

| Problema | Severidade | Ação | Tempo |
|----------|-----------|------|-------|
| 1. HttpOnly vs Client Read | CRÍTICA | Remover getMetaCookies() client | 5 min |
| 2. Falta de Idempotência | CRÍTICA | Implementar KV check | 15 min |
| 3. Event Time | ALTA | Adicionar eventTime ao webhook | 5 min |
| 4. Currency | MÉDIA | Force uppercase em sendMetaEvent | 2 min |
| 5. IP Address | ALTA | Validar getClientIpFromHeaders | 10 min |
| 6. Event Source URL | MÉDIA | Adicionar APP_URL fallback | 3 min |
| 7. Phone E.164 | ALTA | Implementar normalizePhone | 10 min |
| 8. PII Logging | MÉDIA | Audit + mascarar logs | 15 min |

**Total**: ~65 minutos para produção-ready
