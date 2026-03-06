# TikTok Pixel Events - Checkout Flow

## Overview
TikTok Pixel rastreia eventos de compra apenas no checkout (`/app/checkout`). Todos os eventos são disparados no lado do cliente.

## Eventos Configurados

### 1. **InitiateCheckout**
**Quando:** Quando o usuário entra na página de checkout
**Local:** `/components/tiktok-checkout.tsx` - `useEffect` ao montar
**Dados:**
- `currency: 'GBP'`
- `value: 0` (valor do carrinho)

**Logs:**
\`\`\`
[v0] TikTok - InitiateCheckout event
\`\`\`

---

### 2. **AddPaymentInfo**
**Quando:** Quando o usuário clica "Proceed to Checkout" e o Stripe form é exibido
**Local:** `/components/stripe-checkout.tsx` - função `handleStartCheckout`
**Dados:**
- `contents`: Array de produtos com `content_id`, `content_type`, `content_name`, `price`, `quantity`
- `value`: Total do carrinho em GBP
- `currency: 'GBP'`

**Função Helper:** `trackAddPaymentInfo()` em `/lib/tiktok-events.ts`

**Logs:**
\`\`\`
[v0] TikTok - AddPaymentInfo event
\`\`\`

---

### 3. **Purchase**
**Quando:** Quando a compra é completada e user é redirecionado para thank-you com `?success=true`
**Local:** `/components/tiktok-checkout.tsx` - `useEffect` quando `success === 'true'`
**Dados:**
- `contents`: Array de produtos
- `value`: Total da compra
- `currency: 'GBP'`
- `event_id`: ID único para deduplicação

**Dados Armazenados:** Os dados são armazenados em `sessionStorage` durante o checkout (`storePurchaseData()`) e recuperados no sucesso

**Logs:**
\`\`\`
[v0] TikTok - Purchase tracked with data: {...}
\`\`\`

---

## Fluxo Completo

\`\`\`
User entra em /checkout
    ↓
TikTokCheckout monta → Dispara InitiateCheckout
    ↓
User vê carrinho
    ↓
User clica "Proceed to Checkout"
    ↓
StripeCheckout exibe Stripe form → Dispara AddPaymentInfo
    ↓
User preenche dados e confirma pagamento
    ↓
Stripe processa pagamento
    ↓
User redirecionado para /checkout?success=true
    ↓
TikTokCheckout detecta success=true → Dispara Purchase
\`\`\`

---

## Verificação

### Console Logs para Monitorar
No DevTools (F12), procure por `[v0]`:
1. `InitiateCheckout event` - confirma entrada no checkout
2. `AddPaymentInfo event` - confirma exibição do Stripe form
3. `Purchase tracked with data:` - confirma compra registrada

### TikTok Pixel Debugger
- Abra TikTok Pixel Debugger (extensão do navegador)
- Monitore os eventos em tempo real durante o checkout
- Valide se os dados estão sendo enviados corretamente

---

## Estrutura de Dados TikTok

\`\`\`json
{
  "event": "Purchase",
  "event_time": 1769093614,
  "event_id": "purchase_1234567890_abc123",
  "user": {
    "email": null,
    "phone": null,
    "external_id": null
  },
  "properties": {
    "contents": [
      {
        "content_id": "product-123",
        "content_type": "product",
        "content_name": "Product Name",
        "price": 99.99,
        "quantity": 1
      }
    ],
    "currency": "GBP",
    "value": 99.99
  }
}
\`\`\`

---

## Environment Variables

**TikTok Pixel ID:**
- `D5P3D9BC77U3OQH693UG` (Configurado em `components/tiktok-checkout.tsx`)

**TikTok Access Token:**
- `a71dfd85a94baa186f299274306addcf7826a7af` (Para Conversions API, se necessário)

---

## Notas

- Todos os eventos ficam **APENAS** no checkout (`/app/checkout`)
- O TikTok Pixel script carrega apenas quando o usuário acessa `/checkout`
- Dados são armazenados em `sessionStorage` e não persistem após limpeza do navegador
- Event IDs são gerados para deduplicação
