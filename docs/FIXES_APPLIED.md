# Fixes Applied - Auditoria Crítica Resolvida

## Status: 4/8 Fixes Implementados (Priority Fixes)

### ✅ APLICADO: Problema 1 - HttpOnly vs Client Read
**Arquivo**: `/components/stripe-checkout.tsx`  
**Mudança**: Removida função `getMetaCookies()` que tentava ler _fbc/_fbp do client  
**Por que funciona agora**:
- Cookies _fbc/_fbp são agora lidos APENAS no servidor via `getMetaCookies()` em `/lib/meta/cookies.ts`
- Passados através da metadata do Stripe (que é acessível no webhook)
- Cliente não tenta mais acessar cookies HttpOnly

\`\`\`typescript
// ❌ ANTES
const { fbc, fbp } = getMetaCookies()  // Não conseguia ler HttpOnly
const trackingData = { fbc, fbp, ... }

// ✅ DEPOIS
// Sem tentativa no client - fbc/fbp vêm do servidor
const { clientSecret } = await createCheckoutSession(items, origin)
\`\`\`

---

### ✅ APLICADO: Problema 3 - Event Time
**Arquivos**: 
- `/app/api/stripe/webhook/route.ts` (linhas 141-142, 191-192)
- `/lib/meta/sendEvent.ts` (linhas 187, 191)

**Mudança**: Usar `session.created` do Stripe em vez de `Date.now()`

\`\`\`typescript
// ❌ ANTES
event_time: data.eventTime || Math.floor(Date.now() / 1000)  // Hora do webhook, não do pagamento

// ✅ DEPOIS
eventTime: Math.floor(session.created)  // Timestamp real do pagamento
\`\`\`

**Impacto**: Event time agora é preciso para atribuição em janelas de conversão da Meta

---

### ✅ APLICADO: Problema 4 - Currency Uppercase
**Arquivo**: `/lib/meta/sendEvent.ts` (linha 100)

**Mudança**: Force `.toUpperCase()` na moeda

\`\`\`typescript
// ❌ ANTES
currency: data.customData.currency  // Stripe envia "eur", Meta espera "EUR"

// ✅ DEPOIS
currency: data.customData.currency.toUpperCase()  // Agora "EUR"
\`\`\`

**Impacto**: Meta reconhece a moeda corretamente, multi-moeda funciona

---

### ✅ APLICADO: Problema 6 - Event Source URL Fallback
**Já implementado em**: `/app/api/meta/event/route.ts` (linha 47)

\`\`\`typescript
const eventSourceUrl = body.event_source_url || 
  request.headers.get('referer') || 
  undefined
\`\`\`

**Nota**: Adicionar APP_URL como fallback adicional está na lista de ações

---

## ⏳ NÃO APLICADO AINDA (Requer Setup Adicional)

### ❌ Problema 2 - Idempotência Real (CRÍTICA)
**Status**: BLOQUEADO - Requer Upstash KV

**Por que não aplicado**:
- Requer `@upstash/redis` (não instalado)
- Requer integração Upstash KV no Vercel
- Requer env vars `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`

**Próximos passos**:
1. Usuário adiciona Upstash KV no Vercel Connect
2. v0 implementa `processed:stripe_${event.id}` check no webhook

**Código a ser implementado**:
\`\`\`typescript
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function POST(request: NextRequest) {
  let event: Stripe.Event
  // ... construct event ...
  
  // ✓ NEW: Check if already processed
  const processed = await redis.get(`processed:stripe_${event.id}`)
  if (processed) {
    return NextResponse.json({ received: true }) // Already processed
  }
  
  // Process event
  // ...
  
  // Mark as processed (24h expiry)
  await redis.setex(`processed:stripe_${event.id}`, 86400, "true")
  
  return NextResponse.json({ received: true })
}
\`\`\`

---

### ❌ Problema 5 - IP Address Validation (ALTA)
**Status**: PENDENTE - Verificação

**Ação necessária**:
1. Audit `/lib/meta/cookies.ts` função `getClientIpFromHeaders()`
2. Validar se está pegando corretamente em Vercel

**Checklist**:
- [ ] IP não é vazio
- [ ] Pega primeiro IP de x-forwarded-for se houver múltiplos
- [ ] Valida se IP é legítimo (não localhost em prod)

---

### ⚠️ Problema 7 - Phone E.164 Normalization (ALTA)
**Status**: PENDENTE - Implementação

**Ação necessária**:
1. Implementar `normalizePhone()` em `/lib/meta/hash.ts`
2. Usar antes de hashear phone

\`\`\`typescript
function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined
  
  // Remove tudo que não for dígito
  let cleaned = phone.replace(/[^\d]/g, '')
  
  // Se não tem +, assume +1 (USA) - IMPORTANTE: Precisar de country
  if (cleaned && !phone.includes('+')) {
    // Aqui você precisa do country code do usuário
    cleaned = '+1' + cleaned
  }
  
  return cleaned || undefined
}
\`\`\`

**Nota**: Para internacionalizar, precisa do country do usuário ou usar biblioteca como `libphonenumber-js`

---

### ⚠️ Problema 8 - PII Logging (MÉDIA)
**Status**: PENDENTE - Audit Completo

**Ação necessária**:
1. Auditar todos `console.log/error` que mencionam user_data
2. Mascarar email/phone em logs

**Exemplo correto**:
\`\`\`typescript
// ❌ NUNCA FAZER
console.log("Email:", user.email)  // PII exposto

// ✅ FAZER
console.log("Has email:", !!user.email)
console.log("Email (masked):", user.email?.substring(0, 3) + "***")
\`\`\`

---

## Checklist de Deployment

- [x] Problema 1: HttpOnly vs Client Read - FIXED
- [x] Problema 3: Event Time - FIXED
- [x] Problema 4: Currency Uppercase - FIXED
- [x] Problema 6: Event Source URL - JÁ OK
- [ ] Problema 2: Idempotência (Requer Upstash)
- [ ] Problema 5: IP Address (Verificar)
- [ ] Problema 7: Phone E.164 (Implementar)
- [ ] Problema 8: PII Logging (Audit)

---

## Próximos Passos Recomendados

### IMEDIATO (Hoje)
1. ✅ Deploy com os 4 fixes já aplicados
2. Testar Purchase event no Meta Test Event Code
3. Verificar que event_time, currency e fbc/fbp aparecem corretamente

### CURTO PRAZO (Próximos 2 dias)
1. Implementar Problema 5 (IP Address) - verificação + log
2. Implementar Problema 7 (Phone E.164) com country handling
3. Audit completo de PII logging (Problema 8)

### MÉDIO PRAZO (Antes de escalar)
1. Ativar Upstash KV para Problema 2 (Idempotência real)
2. Testar webhook retry scenario (simular reenvio do Stripe)

---

## Testing Checklist

\`\`\`bash
# 1. Validar event_time
curl -X POST https://your-app.com/api/meta/event \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "Purchase",
    "custom_data": {
      "value": 100,
      "currency": "eur"  # Lowercase
    }
  }'
# ✓ Should send currency as "EUR" (uppercase)
# ✓ Should use timestamp from Stripe, not Date.now()

# 2. Validar fbc/fbp
# Fazer compra com ?fbclid=xyz123
# No webhook, verificar que fbc/fbp estão em metadata
# No Meta Events Manager, ver que Purchase tem fbc/fbp preenchidos

# 3. Validar IP
# Cehcar logs do webhook por client_ip
# Deve mostrar IP real, não localhost

# 4. Validar currency
# Fazer compra em EUR
# Meta Event Manager deve mostrar "EUR", não "eur"
\`\`\`

---

## Documentação Relacionada

- `/docs/CRITICAL_ISSUES_FOUND.md` - Descrição detalhada de cada problema
- `/docs/PRODUCTION_DEPLOYMENT_GUIDE.md` - Guia completo de deployment
- `/docs/CRITICAL_FIXES_SUMMARY.md` - Referência rápida dos 8 problemas
