## Purchase Event Debug Guide

### Problem
Purchase events não estão aparecendo no Meta após teste de checkout.

### Fluxo Esperado
1. Checkout iniciado → Stripe session criada com metadata (fbc, fbp, event_id)
2. Payment realizado → Stripe envia webhook
3. Webhook recebe `checkout.session.completed` com `payment_status: "paid"`
4. Webhook chama `handlePurchaseEvent(session)`
5. `sendPurchaseEvent()` é chamado
6. `sendMetaEvent()` envia para Meta CAPI
7. Event registrado em Meta Dashboard → "Test Events"

### Logs que Você Deve Ver

#### No Vercel Logs (webhook):
\`\`\`
[Stripe Webhook] Checkout completed: {...}
[Stripe Webhook] Sending Purchase to Meta: {value: 0, is_free_product: true, ...}
[Stripe Webhook] Purchase event sent successfully
\`\`\`

#### No Vercel Logs (Meta):
\`\`\`
[Meta CAPI] Sending event: {event_name: "Purchase", event_id: "...", ...}
[Meta CAPI] Event sent successfully: {events_received: 1, fbtrace_id: "..."}
\`\`\`

### Checklist de Verificação

#### 1. Variáveis de Ambiente
- [ ] META_PIXEL_ID está definido no Vercel
- [ ] META_ACCESS_TOKEN está definido no Vercel
- [ ] META_TEST_EVENT_CODE está definido (opcional, mas recomendado para testes)
- [ ] STRIPE_WEBHOOK_SECRET está definido

Verificar em: Vercel → Project Settings → Environment Variables

#### 2. Webhook Configuração no Stripe
- [ ] Webhook endpoint registrado em: https://seu-dominio.com/api/stripe/webhook
- [ ] Eventos ativados: checkout.session.completed, charge.succeeded, payment_intent.succeeded
- [ ] Status do webhook: "Enabled" (não disabled)

Verificar em: Stripe Dashboard → Developers → Webhooks

#### 3. Dados do Checkout
Na thank-you page, procure por esses logs:
\`\`\`
[v0] Thank You - Response status: 200
\`\`\`

#### 4. Teste de Compra Passo a Passo

**Use o produto de teste:** `/product/test-free-product` (valor 0, sem frete)

1. **Checkout:**
   - Adicione ao carrinho
   - Clique em "Checkout"
   - Procure por: `[v0] Stripe checkout initiated`

2. **Pagamento:**
   - Complete o formulário de pagamento com dados de teste
   - Cartão de teste Stripe: 4242 4242 4242 4242 (qualquer data futura, qualquer CVV)
   - Procure por: `[v0] Checkout - Session created`

3. **Webhook (no Vercel Logs):**
   - Procure por: `[Stripe Webhook] Checkout completed:`
   - Procure por: `[Stripe Webhook] Sending Purchase to Meta:`
   - Procure por: `[Meta CAPI] Sending event:`
   - Procure por: `[Meta CAPI] Event sent successfully:` ✓ **CRÍTICO**

4. **Meta Dashboard:**
   - Vá para: Meta Business Suite → Events Manager → Test Events
   - Procure por evento "Purchase" com timestamp recente
   - Verifique: event_id, fbc, fbp, value (mesmo que 0)

### Erros Comuns

#### "Missing Meta configuration"
**Solução:** META_PIXEL_ID ou META_ACCESS_TOKEN não definidos
\`\`\`bash
# Vercel → Project Settings → Environment Variables
# Adicione:
META_PIXEL_ID=seu_pixel_id
META_ACCESS_TOKEN=seu_access_token
\`\`\`

#### "Invalid access token" (Meta API error)
**Solução:** ACCESS_TOKEN expirou ou está incorreto
\`\`\`bash
# Regenere em: Meta Apps → System User → Generate Token
\`\`\`

#### "Event validation failed" (Meta API error)
**Solução:** Falta email ou phone em user_data
- O webhook extrai automaticamente do customerDetails
- Para zero-value products, email pode ser vazio
- Verifique: `has_email` nos logs

#### Webhook não acionado
**Solução:**
1. Verifique Stripe Webhook endpoint status
2. Teste webhook manualmente: Stripe Dashboard → Webhooks → Send test event
3. Verifique logs no Stripe: Developers → Webhooks → Recent deliveries

### Debug Manual

#### 1. Teste Webhook Manualmente
\`\`\`bash
# Stripe Dashboard
Developers → Webhooks → [seu endpoint]
Clique em "Send test event" → checkout.session.completed
\`\`\`

Verifique Vercel Logs para ver a resposta.

#### 2. Teste Meta CAPI Diretamente
Se webhook funciona mas Meta não recebe, teste a chamada Meta:

\`\`\`bash
curl -X POST "https://graph.facebook.com/v20.0/{PIXEL_ID}/events?access_token={ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{
      "event_name": "Purchase",
      "event_time": '$(date +%s)',
      "event_id": "test_'$(date +%s%N)'",
      "action_source": "website",
      "user_data": {
        "email": "test@example.com"
      },
      "custom_data": {
        "value": 0,
        "currency": "GBP"
      }
    }],
    "test_event_code": "TEST_CODE"
  }'
\`\`\`

#### 3. Verifique Meta Pixel ID
\`\`\`bash
# Deve estar no formato numérico
META_PIXEL_ID=123456789  ✓
META_PIXEL_ID=goog12345  ✗
\`\`\`

### Logs Detalhados por Etapa

#### Etapa 1: Checkout Iniciado
\`\`\`
[Stripe Checkout] Creating session
\`\`\`

#### Etapa 2: Session Criada
\`\`\`
[v0] Stripe checkout initiated
\`\`\`

#### Etapa 3: Payment Realizado
\`\`\`
[Stripe Webhook] Checkout completed: {payment_status: "paid", ...}
\`\`\`

#### Etapa 4: Meta Event Enviado
\`\`\`
[Stripe Webhook] Sending Purchase to Meta: {value: 0, is_free_product: true}
[Meta CAPI] Sending event: {event_name: "Purchase", ...}
\`\`\`

#### Etapa 5: Meta Confirmou Recebimento
\`\`\`
[Meta CAPI] Event sent successfully: {events_received: 1, fbtrace_id: "12345..."}
\`\`\`

Se chegar até aqui ✓, o evento foi registrado no Meta!

### Verificar Meta Events Manager

1. Abra: https://business.facebook.com/events_manager
2. Selecione seu Pixel
3. Vá para: Test Events
4. Procure por evento "Purchase"
5. Verifique:
   - event_name: "Purchase" ✓
   - event_id: [deve ser único] ✓
   - fbc: [deve estar preenchido] ✓
   - fbp: [deve estar preenchido] ✓
   - value: 0 ✓
   - currency: "GBP" ✓

### Se Ainda Não Funcionar

1. Colete todos os logs: `[Stripe Webhook]` + `[Meta CAPI]`
2. Verifique se há `error:` em qualquer log
3. Procure por `fbtrace_id` - use isso para suporte Meta
4. Verifique: PIXEL_ID, ACCESS_TOKEN, WEBHOOK_SECRET estão corretos
