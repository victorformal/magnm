# Meta Pixel & Conversions API - Configuração Necessária

## Variáveis de Ambiente Obrigatórias

Para que o rastreamento Meta funcione corretamente, você precisa adicionar as seguintes variáveis de ambiente no painel do Vercel:

### 1. Meta Pixel ID
\`\`\`
META_PIXEL_ID=seu_pixel_id_aqui
\`\`\`
- **Onde encontrar**: Facebook Ads Manager → Eventos → Seu Pixel ID (formato: números)
- **Exemplo**: `987654321`

### 2. Meta Access Token
\`\`\`
META_ACCESS_TOKEN=seu_token_aqui
\`\`\`
- **Onde encontrar**: 
  1. Vá para https://developers.facebook.com/apps
  2. Selecione sua aplicação
  3. Vá para Settings → Basic
  4. Copie o "App ID" e "App Secret"
  5. Gere um token em Tools → Token Tool

- **Formato esperado**: `EAAxxxxxxxxxxxx...` (token de longa duração)

## Como o Rastreamento Funciona

### 1. **Pixel SDK (Frontend)**
- Script do Meta Pixel automaticamente injeta cookies `_fbp` e `_fbc`
- Rastreia eventos: PageView, ViewContent, AddToCart, Checkout, Purchase

### 2. **Conversions API (Backend)**
- Envia eventos via API com dados de usuário hasheados (SHA256)
- Inclui: email, telefone, IP, User Agent, ID externo
- Endpoin: `/api/meta-event`

### 3. **Fluxo de Purchase**
1. Usuário completa compra no checkout
2. Página de sucesso (`/thank-you`) é carregada com `session_id`
3. Backend recupera dados da sessão Stripe
4. Envia Purchase event para Meta com:
   - Email do cliente (hasheado)
   - Telefone do cliente (hasheado)
   - Session ID como external_id
   - Valor total e moeda

## Eventos Rastreados

- `PageView` - Visitou uma página
- `ViewContent` - Visualizou produto
- `AddToCart` - Adicionou produto ao carrinho
- `InitiateCheckout` - Iniciou checkout
- `Purchase` - Completou compra

## Testar o Rastreamento

1. Abra https://developers.facebook.com/tools/events-manager/
2. Selecione seu Pixel
3. Clique em "Test Events"
4. Complete uma compra na sua aplicação
5. Você verá o evento `Purchase` aparecer em tempo real

## Dados Enviados (Hashed para privacidade)

\`\`\`json
{
  "event_name": "Purchase",
  "event_time": 1705765800,
  "action_source": "website",
  "user_data": {
    "em": "SHA256(email@example.com)",
    "ph": "SHA256(5511999999999)",
    "external_id": "SHA256(session_id)",
    "client_ip_address": "200.123.45.67",
    "client_user_agent": "Mozilla/5.0..."
  },
  "custom_data": {
    "value": 29.90,
    "currency": "GBP"
  }
}
\`\`\`

## Variáveis de Ambiente Adicionais (Já Configuradas)

- `NEXT_PUBLIC_SITE_URL` - URL da sua aplicação
- `STRIPE_SECRET_KEY` - Chave secreta Stripe
- `STRIPE_PUBLISHABLE_KEY` - Chave pública Stripe

## Support

- Meta Conversions API: https://developers.facebook.com/docs/marketing-api/conversions-api
- Facebook Pixel: https://developers.facebook.com/docs/facebook-pixel
