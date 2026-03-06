# TikTok Pixel Debug Guide

## Como verificar se TikTok está funcionando

### 1. Verificar console.log
Abra o DevTools (F12) → Console e procure por logs `[v0] TikTok`:

\`\`\`
[v0] TikTok - Script element loaded
[v0] TikTok - Pixel initialized
[v0] TikTok - Waiting for script... (attempt 1/20)
[v0] TikTok - Script loaded, tracking InitiateCheckout
[v0] TikTok - InitiateCheckout event dispatched
\`\`\`

### 2. Fluxo completo de eventos esperados

#### No Checkout Page:
\`\`\`
[v0] TikTok - Script element loaded
[v0] TikTok - ttq object confirmed available
[v0] TikTok - Pixel initialized
[v0] TikTok - Script loaded, tracking InitiateCheckout
[v0] TikTok - InitiateCheckout event dispatched
\`\`\`

#### Quando clica "Proceed to Checkout":
\`\`\`
[v0] TikTok - Tracking AddPaymentInfo: {contents: [...], currency: 'GBP', value: XXX}
[v0] TikTok - AddPaymentInfo event dispatched
\`\`\`

#### Quando compra é confirmada (success=true):
\`\`\`
[v0] TikTok - Script loaded, tracking Purchase
[v0] TikTok - Purchase data found: {contents: [...], value: XXX, ...}
[v0] TikTok - Purchase event dispatched with data
\`\`\`

### 3. Verificar se dados foram armazenados

No console, execute:
\`\`\`javascript
// Verificar se purchase data está armazenado
sessionStorage.getItem('tiktok_purchase_data')
\`\`\`

Deve retornar algo como:
\`\`\`json
{
  "contents": [
    {
      "content_id": "product-id",
      "content_type": "product",
      "content_name": "Product Name",
      "price": 99.99,
      "quantity": 1
    }
  ],
  "value": 99.99,
  "currency": "GBP",
  "event_id": "purchase_XXXXX"
}
\`\`\`

### 4. Verificar no TikTok Ads Manager

1. Vá para: TikTok Ads Manager → Business Tools → Events Manager
2. Procure pelo Pixel ID: `D5P3D9BC77U3OQH693UG`
3. Você deve ver:
   - **InitiateCheckout** events quando users entram no checkout
   - **AddPaymentInfo** events quando clicam "Proceed to Checkout"
   - **Purchase** events quando compra é confirmada

### 5. Common Issues

#### Problema: "window.ttq is undefined"
- O script pode não ter carregado a tempo
- O componente `TikTokCheckout` agora espera até 2 segundos (20 tentativas x 100ms)
- Cheque os logs do console para "Script not available after"

#### Problema: "Purchase data not found in sessionStorage"
- Pode ter sido limpo antes de chegar à página de sucesso
- O sessionStorage é compartilhado por abas do mesmo domínio
- Verifique se está usando a mesma aba para checkout

#### Problema: Eventos não aparecem no TikTok Ads Manager
- Pode levar até 24 horas para aparecer
- Verifique se o Pixel ID está correto: `D5P3D9BC77U3OQH693UG`
- Verifique se há adblockers bloqueando o script

### 6. Test Events Manually

No console:
\`\`\`javascript
// Se ttq está disponível, teste um evento
if (window.ttq) {
  window.ttq.track('Purchase', {
    value: 100,
    currency: 'GBP',
    contents: [{
      content_id: 'test-product',
      content_type: 'product',
      content_name: 'Test Product'
    }]
  });
  console.log('Test Purchase event sent');
}
\`\`\`

## Fluxo Atual

\`\`\`
/checkout (page mounted)
  ↓
TikTokCheckout carrega script
  ↓
Script disponível? SIM → Dispara InitiateCheckout
                 NÃO → Retry até 2 segundos
  ↓
User clica "Proceed to Checkout"
  ↓
StripeCheckout → trackAddPaymentInfo()
  ↓
TikTok track('AddPaymentInfo')
  ↓
User completa pagamento
  ↓
Redirect para /checkout?success=true
  ↓
TikTokCheckout detecta success=true
  ↓
Recupera dados do sessionStorage
  ↓
Dispara Purchase event
\`\`\`

## Variáveis de Ambiente

- Pixel ID: `D5P3D9BC77U3OQH693UG`
- Token: `a71dfd85a94baa186f299274306addcf7826a7af`

(Token não é usado no Pixel Tracking, apenas para server-side APIs)
