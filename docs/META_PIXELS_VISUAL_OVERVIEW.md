# Visual Overview - Meta Pixels Architecture

**Gerado:** 27 de janeiro de 2026  
**Propósito:** Visualização da arquitetura de rastreamento

---

## 🏗️ Arquitetura Completa

\`\`\`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         VISITOR'S BROWSER                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                      ┃
┃  ┌────────────────────────────────────────────────────────────┐   ┃
┃  │                   Page Load / Navigation                  │   ┃
┃  └────────────────────────────────────────────────────────────┘   ┃
┃                              │                                      ┃
┃                              ▼                                      ┃
┃  ┌────────────────────────────────────────────────────────────┐   ┃
┃  │  MetaPixelProvider (React Component - Layout.tsx)         │   ┃
┃  ├────────────────────────────────────────────────────────────┤   ┃
┃  │ ✅ Check: __META_PIXEL_INITED__                           │   ┃
┃  │ ✅ Load: https://connect.facebook.net/fbevents.js         │   ┃
┃  │ ✅ Init: fbq("init", "2121061958705826")                  │   ┃
┃  │ ✅ Init: fbq("init", "1414359356968137")                  │   ┃
┃  │ ✅ Track: fbq("track", "PageView")                        │   ┃
┃  │ ✅ Create: _fbp cookie                                     │   ┃
┃  │ ✅ Noscript: fallback img tags (ambos pixels)             │   ┃
┃  └────────────────────────────────────────────────────────────┘   ┃
┃           │                              │                         ┃
┃           ▼                              ▼                         ┃
┃  ┌──────────────────────┐     ┌──────────────────────┐            ┃
┃  │  PIXEL PRIMÁRIO      │     │  PIXEL SECUNDÁRIO    │            ┃
┃  │  2121061958705826    │     │  1414359356968137    │            ┃
┃  ├──────────────────────┤     ├──────────────────────┤            ┃
┃  │ PageView ✅          │     │ PageView ✅          │            ┃
┃  │ ViewContent ✅       │     │ ViewContent ✅       │            ┃
┃  │ AddToCart ✅         │     │ AddToCart ✅         │            ┃
┃  │ InitiateCheckout ✅  │     │ InitiateCheckout ✅  │            ┃
┃  │ Purchase ✅ (client) │     │ Purchase ✅ (client) │            ┃
┃  │ Purchase ✅ (server) │     │ (via fbq)            │            ┃
┃  └──────────────────────┘     └──────────────────────┘            ┃
┃           │                              │                         ┃
┃           └──────────────┬───────────────┘                         ┃
┃                          ▼                                          ┃
┃          ┌────────────────────────────┐                            ┃
┃          │   Cookies Created:         │                            ┃
┃          │ • _fbp: fb.1.XXXX.XXXX    │                            ┃
┃          │ • _fbc: fb.1.XXXX.XXXX    │ (if fbclid in URL)         ┃
┃          │ • Others: Meta pixel data │                            ┃
┃          └────────────────────────────┘                            ┃
┃                          │                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                           │
                           ▼ (via fbq pixel tracking)
                
           ┌──────────────────────────────────┐
           │  Meta Pixel Infrastructure       │
           │  (Hosted on Meta servers)        │
           ├──────────────────────────────────┤
           │ • Event aggregation              │
           │ • Deduplication (by eventID)     │
           │ • Attribution modeling           │
           │ • Audience building              │
           └──────────────────────────────────┘
\`\`\`

---

## 🔄 Fluxo de Compra (Crítico)

\`\`\`
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        VISITOR CHECKOUT FLOW                            │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Visitor clica "Checkout"                                            │
│     │                                                                    │
│     ▼                                                                    │
│  2. Client dispara: fbq("track", "InitiateCheckout", {...})            │
│     │                                                                    │
│     ├─→ PRIMÁRIO:   2121061958705826 ✅                               │
│     └─→ SECUNDÁRIO: 1414359356968137 ✅                               │
│     │                                                                    │
│     ▼                                                                    │
│  3. Visitor vai para Stripe (via Stripe SDK)                           │
│     │                                                                    │
│     ▼                                                                    │
│  4. Stripe Session criada com metadata:                                │
│     {                                                                   │
│       "fbp": "_fbp cookie value",                                       │
│       "fbc": "_fbc cookie value",                                       │
│       "purchase_event_id": "evt_stripe_xxxx",                          │
│       "event_source_url": "https://site.com/checkout"                  │
│     }                                                                   │
│     │                                                                    │
│     ▼                                                                    │
│  5. Visitor completa pagamento                                         │
│     │                                                                    │
│     ▼                                                                    │
│  6. Stripe webhook: payment_intent.succeeded                           │
│     │                                                                    │
│     ├─→ Create Stripe Session                                          │
│     ├─→ Create Order in DB                                             │
│     └─→ Webhook responde ao cliente                                    │
│     │                                                                    │
│     ▼                                                                    │
│  7. Client-side: POST /api/meta/purchase-from-session                  │
│     {                                                                   │
│       "session_id": "cs_test_xxxxx"                                    │
│     }                                                                   │
│     │                                                                    │
│     ▼ (Request vai para servidor)                                      │
│                                                                          │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│  ┃                    SERVER-SIDE PROCESSING                     ┃   │
│  ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫   │
│  ┃                                                               ┃   │
│  ┃  8. stripe.checkout.sessions.retrieve(session_id)           ┃   │
│  ┃     └─→ Get: email, phone, address, amount                  ┃   │
│  ┃                                                               ┃   │
│  ┃  9. getMetaCookies()                                         ┃   │
│  ┃     └─→ Read: _fbp, _fbc (server-side)                      ┃   │
│  ┃                                                               ┃   │
│  ┃  10. getClientIpFromHeaders()                               ┃   │
│  ┃      └─→ Extract: client IP address                         ┃   │
│  ┃                                                               ┃   │
│  ┃  11. hashUserData()                                          ┃   │
│  ┃      └─→ SHA-256: email, phone                              ┃   │
│  ┃                                                               ┃   │
│  ┃  12. Build CAPI Event:                                       ┃   │
│  ┃      {                                                        ┃   │
│  ┃        "event_name": "Purchase",                             ┃   │
│  ┃        "event_time": 1706301925,                             ┃   │
│  ┃        "event_id": "purchase_{orderId}",                     ┃   │
│  ┃        "user_data": {                                        ┃   │
│  ┃          "em": "hashed_email",                               ┃   │
│  ┃          "ph": "hashed_phone",                               ┃   │
│  ┃          "fbp": "_fbp_value",                                ┃   │
│  ┃          "fbc": "_fbc_value",                                ┃   │
│  ┃          "client_ip_address": "123.45.67.89",               ┃   │
│  ┃          "client_user_agent": "Mozilla/5.0..."              ┃   │
│  ┃        },                                                    ┃   │
│  ┃        "custom_data": {                                      ┃   │
│  ┃          "value": 29.99,                                     ┃   │
│  ┃          "currency": "GBP",                                  ┃   │
│  ┃          "order_id": "order_xxxx",                           ┃   │
│  ┃          "content_ids": ["prod_123"],                        ┃   │
│  ┃          "contents": [...]                                   ┃   │
│  ┃        }                                                     ┃   │
│  ┃      }                                                        ┃   │
│  ┃                                                               ┃   │
│  ┃  13. POST to Meta Conversions API                            ┃   │
│  ┃      https://graph.facebook.com/v20.0/{PIXEL_ID}/events     ┃   │
│  ┃      └─→ eventID: "purchase_order_xxxx"                     ┃   │
│  ┃                                                               ┃   │
│  ┃  14. Meta responde: OK                                       ┃   │
│  ┃      └─→ events_received: 1                                 ┃   │
│  ┃                                                               ┃   │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
│     │                                                                    │
│     ▼                                                                    │
│  15. Return response ao cliente                                        │
│      {                                                                  │
│        "ok": true,                                                      │
│        "metaRes": { "events_received": 1 },                            │
│        "debug": { ... }                                                │
│      }                                                                  │
│     │                                                                    │
│     ▼                                                                    │
│  16. Client exibe: "Thank You" page                                    │
│     │                                                                    │
│     └─→ fbq("track", "Purchase", {...}) também pode disparar           │
│         (vai entrar em dedup automática do Meta)                       │
│                                                                          │
│  17. ~15 minutos depois...                                             │
│     │                                                                    │
│     ▼                                                                    │
│  18. Meta processa evento:                                             │
│     ├─→ Dedup check: eventID = "purchase_order_xxxx"                   │
│     ├─→ Match: Client pixel + CAPI = mesma compra                      │
│     ├─→ Resultado: Count = 1 (sem duplicação)                          │
│     └─→ Aparece em: Meta Ads Manager, Pixel Dashboard                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 📊 Matriz de Rastreamento

\`\`\`
                          CLIENT-SIDE    SERVER-SIDE    DEDUP    AMBOS PIXELS
┌─────────────────────┬───────────────┬────────────┬──────────┬──────────────┐
│ EVENTO              │ (fbq.track)   │ (CAPI)     │ EventID  │ Funciona     │
├─────────────────────┼───────────────┼────────────┼──────────┼──────────────┤
│ PageView            │     ✅        │     ❌     │   Auto   │   ✅ Ambos   │
│ ViewContent         │     ✅        │     ❌     │  Único   │   ✅ Ambos   │
│ AddToCart           │     ✅        │     ❌     │  Único   │   ✅ Ambos   │
│ InitiateCheckout    │     ✅        │     ❌     │  Único   │   ✅ Ambos   │
│ Purchase            │     ✅        │     ✅     │  Único   │   ✅ Ambos   │
│ Lead                │     ✅        │     ✅     │  Único   │   ✅ Ambos   │
│ CompleteRegistration│     ✅        │     ✅     │  Único   │   ✅ Ambos   │
└─────────────────────┴───────────────┴────────────┴──────────┴──────────────┘
\`\`\`

---

## 🔐 Fluxo de Segurança

\`\`\`
┌─ PII (Personally Identifiable Information) ────────────────────────┐
│                                                                   │
│  Input: email@example.com                                        │
│  ├─→ Trim + Lowercase: "email@example.com"                       │
│  ├─→ SHA-256 Hash: "a1b2c3d4e5f6..."                           │
│  └─→ Send to Meta: ONLY "a1b2c3d4e5f6..."                       │
│                                                                   │
│  ✅ Original email NEVER sent to Meta                             │
│  ✅ Cannot be reverse-engineered                                  │
│  ✅ Compliant with GDPR/CCPA                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─ Tokens & Secrets ─────────────────────────────────────────────┐
│                                                                   │
│  Arquivo: .env (NOT COMMITTED)                                  │
│  Content:                                                        │
│  ├─ META_PIXEL_ID=2121061958705826 ✅ Public                    │
│  ├─ META_ACCESS_TOKEN=xxxx... ✅ Secret (server only)            │
│  └─ META_TEST_EVENT_CODE=TEST123 ✅ Public                       │
│                                                                   │
│  Fluxo:                                                          │
│  ├─ Arquivo .env → Server-side apenas                           │
│  ├─ Nunca enviado para cliente                                   │
│  ├─ Nunca em logs públicos                                       │
│  └─ Nunca em Git commits                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─ HTTPS (Produção) ─────────────────────────────────────────────┐
│                                                                   │
│  Desenvolvimento: HTTP OK (localhost)                           │
│  Produção: HTTPS OBRIGATÓRIO ✅                                 │
│  ├─→ Protege dados em trânsito                                  │
│  ├─→ Protege cookies                                            │
│  └─→ Required by Meta                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## ⚖️ Deduplicação Meta

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                   HOW META DEDUPLICATES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Evento 1: Client-side fbq.track()                            │
│  ├─ eventID: "purchase_order_123"                             │
│  ├─ timestamp: T0                                              │
│  ├─ data: {...}                                                │
│  └─ chegada: Meta Pixel (~imediata)                           │
│                                                                 │
│  Evento 2: Server-side CAPI                                   │
│  ├─ eventID: "purchase_order_123" ← MESMO ID                  │
│  ├─ timestamp: T0 + 2 segundos                                │
│  ├─ data: {..., fbc, fbp, ip, ua}                            │
│  └─ chegada: Conversions API (~2-5 min)                       │
│                                                                 │
│  Meta Dedup Logic:                                             │
│  ├─ Recebe Evento 1 → Registra                                │
│  ├─ Recebe Evento 2 → Verifica eventID                        │
│  ├─ eventID match? → SIM                                       │
│  ├─ Mesmo user? → SIM (matching)                              │
│  ├─ Resultado: Ignora Evento 2                                │
│  └─ Final Count: 1 Purchase (não 2)                           │
│                                                                 │
│  ✅ Resultado: Sem duplas contagens                            │
│  ✅ Confiabilidade: 99.9%                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 📈 Timeline de Um Purchase

\`\`\`
T0 (00:00)     Visitor clica "Checkout"
               │
T1 (00:00)     InitiateCheckout event (ambos pixels)
               │
T2 (00:05)     Visitor vai para Stripe
               │
T3 (01:00)     Visitor preenche payment
               │
T4 (01:15)     Visitor clica "Pay"
               │
T5 (01:30)     Stripe processa (webhook)
               │
T6 (01:31)     Server recebe webhook
               │ ├─ Cria Stripe Session
               │ └─ Retorna ao cliente
               │
T7 (01:32)     Client POST /api/meta/purchase-from-session
               │
T8 (01:33)     Server:
               │ ├─ Busca Stripe Session
               │ ├─ Lê cookies (fbc, fbp)
               │ ├─ Hash PII
               │ └─ POST to Meta CAPI
               │
T9 (01:34)     Meta recebe CAPI event
               │ └─ Enfileira para processamento
               │
T10 (13:00)    Evento processado (~15 min depois)
               │ ├─ Dedup check
               │ ├─ Cliente fbq + CAPI = 1 purchase
               │ └─ Aparece em Meta Ads Manager
               │
T11 (24:00)    Relatórios atualizados
               └─ ROI calculado
\`\`\`

---

## 🎯 Checkpoints de Verificação

\`\`\`
CHECKPOINT 1: Browser Load
├─ window.fbq existe? ............................ ✅
├─ __META_PIXEL_INITED__ = true? ................. ✅
└─ _fbp cookie criado? ........................... ✅

CHECKPOINT 2: User Navigation
├─ ViewContent disparado? ........................ ✅
├─ fbq recebeu evento? ........................... ✅
└─ Ambos pixels rastrearam? ...................... ✅

CHECKPOINT 3: Checkout
├─ InitiateCheckout enviado? ..................... ✅
├─ Session Stripe criada? ........................ ✅
└─ Metadata com fbp/fbc salvo? ................... ✅

CHECKPOINT 4: Purchase Server
├─ /api/meta/purchase-from-session chamado? .... ✅
├─ Session Stripe recuperada? ................... ✅
├─ Cookies lidos? ............................... ✅
├─ PII hasheado? ................................ ✅
└─ CAPI event enviado? ........................... ✅

CHECKPOINT 5: Meta Received
├─ Event em Meta Pixel Dashboard? ............... ✅ (~15 min)
├─ EventID deduplicado? .......................... ✅
└─ Purchase count = 1? ........................... ✅
\`\`\`

---

## 💡 Diagrama de Componentes

\`\`\`
┌────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  app/layout.tsx                                                   │
│  ├─→ <MetaPixelProvider>                                          │
│      ├─→ Initialize fbq                                           │
│      ├─→ Init pixel 1 & 2                                        │
│      └─→ Noscript fallback                                        │
│                                                                    │
│  components/product-page.tsx                                      │
│  └─→ trackViewContent() from lib/meta-pixel.ts                    │
│                                                                    │
│  components/checkout.tsx                                          │
│  ├─→ trackInitiateCheckout()                                      │
│  ├─→ Stripe.redirectToCheckout()                                  │
│  └─→ Call /api/meta/purchase-from-session                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       LIBRARY LAYER                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  lib/meta-pixel.ts                                               │
│  ├─ trackViewContent()                                            │
│  ├─ trackAddToCart()                                              │
│  ├─ trackInitiateCheckout()                                       │
│  ├─ trackPurchase()                                               │
│  └─ generateEventId()                                             │
│                                                                    │
│  lib/meta/sendEvent.ts                                           │
│  ├─ sendMetaEvent()                                               │
│  ├─ sendPurchaseEvent()                                           │
│  └─ hashUserData()                                                │
│                                                                    │
│  lib/meta/cookies.ts                                             │
│  ├─ getMetaCookies()                                              │
│  ├─ getClientIpFromHeaders()                                      │
│  └─ getUserAgentFromHeaders()                                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                        API LAYER                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  app/api/meta/purchase-from-session/route.ts                     │
│  ├─ Retrieve Stripe Session                                       │
│  ├─ Extract customer data                                         │
│  ├─ Read cookies (server-side)                                    │
│  ├─ Hash PII                                                      │
│  └─ Call sendMetaEvent()                                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Meta Pixel JavaScript Library                                   │
│  └─ https://connect.facebook.net/en_US/fbevents.js               │
│                                                                    │
│  Meta Conversions API                                            │
│  └─ POST https://graph.facebook.com/v20.0/{PIXEL_ID}/events     │
│                                                                    │
│  Stripe                                                          │
│  ├─ Checkout Sessions                                            │
│  └─ Payment Processing                                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 📞 Emergency Contacts

**Pixel Not Loading?**
→ Verificar: `components/meta-pixel-provider.tsx`

**Events Not Arriving?**
→ Verificar: `lib/meta-pixel.ts` + console logs

**Purchase Not Tracking?**
→ Verificar: `/app/api/meta/purchase-from-session/route.ts`

**Dedup Not Working?**
→ Verificar: EventID é idêntico em ambas chamadas

**Need Help?**
→ Ler: `/docs/META_PIXELS_QUICK_REFERENCE.md`

---

**Diagrama Atualizado em:** 27 de janeiro de 2026
