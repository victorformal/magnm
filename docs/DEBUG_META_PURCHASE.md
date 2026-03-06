# Debug Meta Purchase Event

## Problema Identificado
A thank-you page estava tentando enviar evento Purchase via `trackMetaEvent()`, mas o webhook do Stripe é o responsável por enviar o evento Production-ready para Meta CAPI.

## Fluxo Correto

### 1. **Checkout Session Criada** (client-side)
- `createCheckoutSession()` captura: `fbc`, `fbp`, `eventId`, `eventSourceUrl`
- Dados armazenados em `metadata` do Stripe

### 2. **Pagamento Completo** (Stripe)
- Stripe processa pagamento
- Dispara webhook: `checkout.session.completed` com `payment_status: "paid"`

### 3. **Webhook do Stripe** (backend - `/app/api/stripe/webhook/route.ts`)
- Recebe evento de checkout completo
- Chama `handlePurchaseEvent()` 
- Extrai dados do metadata (fbc, fbp, eventId, etc.)
- Chama `sendPurchaseEvent()` 
- Envia para **Meta Conversions API** (server-to-server, muito mais confiável)

### 4. **Thank You Page** (client-side)
- Apenas rastreia no **Meta Pixel** (client-side)
- Apenas rastreia no **TikTok Pixel** (client-side)
- NÃO envia para Meta CAPI (webhook já fez isso)

## Checklist para Verificação

### ✅ Environment Variables
\`\`\`bash
META_PIXEL_ID=<seu_pixel_id>
META_ACCESS_TOKEN=<seu_token>
STRIPE_WEBHOOK_SECRET=<seu_secret>
\`\`\`

### ✅ Logs a Verificar

1. **Stripe Webhook foi acionado:**
\`\`\`
[Stripe Webhook] Checkout completed: {
  session_id: "cs_test_...",
  payment_status: "paid",
  amount: 9999,
  currency: "gbp"
}
\`\`\`

2. **Meta Purchase enviado:**
\`\`\`
[Stripe Webhook] Sending Purchase to Meta: {
  value: 99.99,
  currency: "GBP",
  order_id: "cs_test_...",
  has_fbc: true,
  has_fbp: true,
  has_email: true
}

[Stripe Webhook] Purchase event sent successfully
\`\`\`

3. **Thank You Page (client-side only):**
\`\`\`
[v0] Thank You - Fetching session: cs_test_...
[v0] Meta Purchase event should have been sent by Stripe webhook
[v0] TikTok Purchase - window.ttq exists, calling track()
[v0] TikTok Purchase - ttq.track() called successfully
\`\`\`

### ❌ Red Flags / Problemas

1. **Se ver:** `[Stripe Webhook] Failed to send Purchase event: Error: Missing Meta configuration`
   - **Solução:** Verificar `META_PIXEL_ID` e `META_ACCESS_TOKEN` no Vercel

2. **Se webhook NÃO for acionado:**
   - Verificar se `STRIPE_WEBHOOK_SECRET` está correto
   - Verificar endpoint está sendo chamado: POST `/api/stripe/webhook`
   - Testar com `stripe listen --forward-to localhost:3000/api/stripe/webhook`

3. **Se Meta Pixel não registra purchase:**
   - Verificar se pixel ID está correto
   - Verificar console do navegador para erros
   - Verificar Meta Events Manager em tempo real

4. **Se TikTok não registra purchase:**
   - Verificar se `ttq` está carregado
   - Verificar `TIKTOK_PIXEL_ID` no Meta Pixel Provider

## Como Testar Localmente

### 1. **Stripe CLI**
\`\`\`bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
# Vai gerar um signing secret
\`\`\`

### 2. **Executar Compra de Teste**
- Abrir app localmente
- Adicionar produto ao carrinho
- Pagar com número de teste do Stripe: `4242 4242 4242 4242`
- Redireciona para thank-you page

### 3. **Verificar Logs**
- Vercel: `vercel logs --tail` 
- Localhost: terminal onde rodar `npm run dev`

## Meta Events Manager

1. Ir para: **facebook.com/events_manager**
2. Selecionar seu Pixel
3. Ir para **Test Events**
4. Filtrar por `Purchase`
5. Você deve ver:
   - Event Name: `Purchase`
   - Event ID: Seu ID (para deduplicação)
   - Event Source: `website` (vindo do webhook)
   - Event Time: Timestamp do Stripe (não do webhook receive)
   - Match Quality: `High` (com fbp/fbc)

## Fixes Aplicados

✅ Removido `trackMetaEvent()` da thank-you page
✅ Mantido apenas tracking de Pixel (client-side)
✅ Webhook do Stripe continua enviando para Meta CAPI (backend)
✅ Deduplicação via `eventId` no Stripe metadata

## Próximos Passos

1. **Deploy** para produção
2. **Gerar compra de teste** 
3. **Verificar Meta Events Manager** em tempo real (5-30 seg delay)
4. **Conferir quality score** (deve estar "High" ou "Very High")
