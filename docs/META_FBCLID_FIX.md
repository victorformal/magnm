# Meta Conversions API - fbclid Fix

## Implementação Corrigida

Todos os 3 arquivos abaixo foram criados/atualizados para garantir que o `fbclid` é capturado corretamente da URL e enviado sem modificações para a Meta Conversions API.

### 1. `proxy.ts` (raiz do projeto)
- Detecta `fbclid` na URL (query parameter)
- Cria timestamp em segundos: `Math.floor(Date.now() / 1000)`
- Monta `fbc = "fb.1." + timestamp + "." + fbclid_original` **sem modificações**
- Seta cookie `_fbc` com HttpOnly, Secure, SameSite=Lax, Max-Age=90 dias
- Garante cookie `_fbp` (gera se não existir)

### 2. `lib/meta/cookies.ts`
- Helper `getMetaCookies()`: lê cookies `_fbc` e `_fbp` do servidor
- Helper `getClientIpFromHeaders()`: extrai IP do cliente dos headers
- Helper `getUserAgentFromHeaders()`: extrai User-Agent dos headers
- Compatível com SSR (usa `cookies()` do Next.js)

### 3. `app/api/meta/event/route.ts`
- Endpoint `POST /api/meta/event`
- Recebe: `{ event_name, event_time, event_id, custom_data, user_data, event_source_url }`
- Lê `fbc` e `fbp` dos cookies via `getMetaCookies()`
- Extrai `client_ip_address` e `client_user_agent` dos headers
- **Envia `fbc` exatamente como está no cookie (sem modificações)**
- Envia para: `https://graph.facebook.com/v20.0/<PIXEL_ID>/events?access_token=<TOKEN>`

### 4. `lib/meta/client-events.ts` (NEW)
- Helper `sendMetaEvent()` para usar no client-side
- Chama `/api/meta/event` automaticamente
- Inclui `fbc` e `fbp` via cookies (servidor lê automaticamente)

### 5. `lib/meta-tracking.ts` (ATUALIZADO)
- Mantém compatibilidade com código antigo
- Agora chama `/api/meta/event` (novo endpoint)
- Mais seguro pois `fbc` é tratado no servidor

---

## Ambiente Necessário

Adicione estas variáveis ao Vercel Project Settings > Environment Variables:

\`\`\`
META_PIXEL_ID=seu_pixel_id_aqui
META_ACCESS_TOKEN=seu_access_token_aqui
\`\`\`

---

## Fluxo Completo

1. **URL com fbclid**
   \`\`\`
   https://seu-site.com/produto?fbclid=ABC123XYZ789
   \`\`\`

2. **proxy.ts detecta e cria:**
   - Cookie `_fbc = "fb.1.1705938400.ABC123XYZ789"` ✅ **sem modificações**
   - Cookie `_fbp = "fb.1.1705938400000.1234567890"` (se não existir)

3. **Client-side rastreia evento:**
   \`\`\`javascript
   import { sendMetaEvent } from '@/lib/meta/client-events'
   
   await sendMetaEvent({
     event_name: 'Purchase',
     custom_data: {
       value: 99.99,
       currency: 'GBP',
     },
   })
   \`\`\`

4. **POST /api/meta/event:**
   - Lê `_fbc` e `_fbp` dos cookies
   - Monta payload Conversions API com `fbc` intacto
   - Envia para Meta: `https://graph.facebook.com/v20.0/{PIXEL_ID}/events`

5. **Meta Conversions API recebe:**
   \`\`\`json
   {
     "data": [{
       "event_name": "Purchase",
       "event_time": 1705938400,
       "event_id": "evt_1234567890",
       "action_source": "website",
       "event_source_url": "https://seu-site.com/produto?fbclid=ABC123XYZ789",
       "user_data": {
         "client_ip_address": "203.0.113.45",
         "client_user_agent": "Mozilla/5.0...",
         "fbc": "fb.1.1705938400.ABC123XYZ789",
         "fbp": "fb.1.1705938400000.1234567890"
       },
       "custom_data": {
         "value": 99.99,
         "currency": "GBP"
       }
     }]
   }
   \`\`\`

---

## Validação / Testes

### ✅ 1. Verificar Cookie _fbc no Browser
1. Acesse URL com `?fbclid=TESTE123ABC...`
2. Abra DevTools > Application > Cookies
3. Verifique `_fbc`:
   \`\`\`
   _fbc = "fb.1.<timestamp>.TESTE123ABC..."
   \`\`\`
   - **Deve ser exatamente igual** ao fbclid passado
   - Sem `.toLowerCase()`, sem truncamento, sem regex modificação

### ✅ 2. Não criar _fbc quando não existir fbclid
1. Acesse URL **sem** fbclid
2. Verifique que **não há cookie `_fbc`**
3. Apenas `_fbp` deve existir

### ✅ 3. Verificar Evento no Meta Events Manager
1. Em seu pixel/Events Manager, vá para **Configuração** > **Dados**
2. Procure pelo seu evento (`Purchase`, `AddToCart`, etc.)
3. Verifique que **não há alerta vermelho** sobre fbclid modificado
4. Confirme que `fbc` e `fbp` aparecem no payload do evento

### ✅ 4. Testar em Produção (Vercel)
1. Deploy para Vercel
2. Acesse seu domínio com `?fbclid=TEST_VALUE`
3. Acompanhe logs: `vercel logs`
4. Confirme que cookies funcionam com `Secure=true`

---

## Integração com Código Existente

Se você tem código que já usa `trackMetaEvent()` ou `trackAddToCart()`, ele continua funcionando pois agora chama o novo endpoint `/api/meta/event` que trata `fbc` corretamente.

Novos eventos devem usar `sendMetaEvent()` para melhor controle.

---

## Troubleshooting

**Problema:** Meta Events Manager ainda mostra alerta de fbclid modificado
**Solução:** 
- Limpe cookies do browser: DevTools > Application > Cookies > Delete _fbc e _fbp
- Acesse URL novamente com fbclid
- Aguarde 5min para o pixel processar novo evento

**Problema:** Cookie _fbc não aparece
**Solução:**
- Verifique que `fbclid` está na URL: `?fbclid=ABC123...`
- Verifique proxy.ts está no root do projeto
- Reinicie o servidor (ou redeploy)

**Problema:** Erro "Missing META_PIXEL_ID or META_ACCESS_TOKEN"
**Solução:**
- Adicione variáveis ao Vercel Project Settings
- Redeploy após adicionar vars de ambiente

---

## Referências

- [Meta Conversions API v20.0](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Cookie Matching (fbclid/fbc)](https://developers.facebook.com/docs/facebook-pixel/advanced/cookie-matching)
- [Next.js Middleware/Proxy](https://nextjs.org/docs/app/building-your-application/routing/middleware)
