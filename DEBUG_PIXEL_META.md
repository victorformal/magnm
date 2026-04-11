# 🔍 Guia de Debug: Pixel Meta 1139772708143683

## Teste 1: Verificar se Pixel está Carregado

Abra o console do navegador (F12) e execute:

```javascript
// Verificar se fbq foi criado
typeof window.fbq === 'function'
// Resultado esperado: true

// Verificar se fbq está pronto
window.fbq && window.fbq('track', 'PageView')
// Sem erro = sucesso

// Ver lista de pixels inicializados
window._fbq._i
// Resultado esperado: { "1139772708143683": { ... } }

// Ver fbp cookie
document.cookie.split('; ').find(c => c.startsWith('_fbp'))
// Resultado esperado: _fbp=fb.1.xxxxxxxxxx.yyyyyyyyyy
```

---

## Teste 2: Disparar Eventos Manualmente

### Disparar ViewContent
```javascript
window.fbq('track', 'ViewContent', {
  content_ids: ['product-123'],
  content_name: 'Premium Wood Panel',
  content_type: 'product',
  value: 299.99,
  currency: 'GBP'
}, {
  eventID: 'vc_' + Date.now()
})
```

### Disparar AddToCart
```javascript
window.fbq('track', 'AddToCart', {
  content_ids: ['product-123'],
  content_name: 'Premium Wood Panel',
  content_type: 'product',
  value: 299.99,
  currency: 'GBP',
  num_items: 1
}, {
  eventID: 'atc_' + Date.now()
})
```

### Disparar Purchase
```javascript
window.fbq('track', 'Purchase', {
  content_ids: ['product-123'],
  content_type: 'product',
  value: 299.99,
  currency: 'GBP',
  num_items: 1
}, {
  eventID: 'purchase_' + Math.random().toString(36).substring(7)
})
```

---

## Teste 3: Monitorar Network Requests

1. Abra DevTools (F12)
2. Vá para **Network Tab**
3. Filtre por `facebook.com`
4. Navegue pelo site ou execute um evento
5. Procure por requisições para:
   - `https://www.facebook.com/tr?id=1139772708143683...` (client-side pixel)
   - `https://graph.facebook.com/v20.0/1139772708143683/events` (server-side CAPI)

**O que esperar:**
- ✅ Client-side: Requisições GET para `facebook.com/tr`
- ✅ Server-side: Requisições POST para `graph.facebook.com/v20.0/.../events`

---

## Teste 4: Ver Logs do Servidor

Abra os logs em tempo real:

```bash
# No terminal
vercel logs --tail
```

**O que procurar:**
```
[Meta CAPI] 📤 Enviando evento Purchase para pixel 1139772708143683 (moeda: GBP)
[Meta CAPI] ✅ Evento Purchase enviado com sucesso (eventID: purchase_xyz, pixelID: 1139772708143683)
```

**Se receber erro:**
```
[Meta CAPI] ❌ ERRO CRÍTICO: Access Token vazio para pixel 1139772708143683. Configure META_ACCESS_TOKEN em Vercel → Project → Environment Variables
```

---

## Teste 5: Usar Meta Pixel Helper (Extensão Chrome)

1. Instale: https://chrome.google.com/webstore/detail/meta-pixel-helper/
2. Clique no ícone da extensão
3. Você verá uma lista de eventos em tempo real
4. Cada evento mostra:
   - Nome do evento
   - Pixel ID
   - Timestamp
   - Parâmetros

**Esperar:**
- ✅ PageView ao carregar a página
- ✅ ViewContent ao visualizar produto
- ✅ AddToCart ao adicionar ao carrinho
- ✅ InitiateCheckout ao ir para checkout
- ✅ Purchase ao finalizar compra

---

## Teste 6: Verificar em Facebook Events Manager

1. Vá para https://events.facebook.com
2. Selecione seu Pixel (1139772708143683)
3. Clique em **Test Events**
4. Você verá uma dashboard com os últimos eventos

**Eventos esperados:**
- PageView
- ViewContent
- AddToCart
- Purchase

**Nota:** Eventos podem levar 15-30 minutos para aparecer em produção.

---

## Troubleshooting: Eventos Não Aparecem

### Checklist

- [ ] `META_ACCESS_TOKEN` está configurada em Vars?
- [ ] `META_PIXEL_ID` está configurada como `1139772708143683`?
- [ ] A meta tag de verificação está no `<head>`? (`facebook-domain-verification`)
- [ ] O site foi redeploy após configurar as vars?
- [ ] Você está testando em um navegador sem adblocker? (Brave, Safari ITP bloqueiam)
- [ ] O console do navegador mostra erros?
- [ ] Os logs do servidor (`vercel logs`) mostram erros?

### Teste Nuclear (Reset Completo)

```bash
# 1. Verifique que as vars estão corretas
# v0 Sidebar → Vars → Verificar META_ACCESS_TOKEN e META_PIXEL_ID

# 2. Redeploy o site
# v0 Sidebar → Settings → Redeploy

# 3. Limpe o cache do navegador
# Ctrl+Shift+Del → Limpar cookies/cache

# 4. Teste novamente
# Abra o site em modo incógnito e teste
```

---

## Teste 7: Verificar Deduplicação de Eventos

Se você disparar o mesmo evento 2 vezes com o **mesmo eventID**, o Facebook automaticamente deduplicará e contará como 1 evento.

```javascript
// Dispara Purchase evento
const eventId = 'purchase_' + Math.random().toString(36).substring(7)

// Dispara no client-side
window.fbq('track', 'Purchase', { value: 100, currency: 'GBP' }, { eventID: eventId })

// Se disparar no server-side com o mesmo eventID, Facebook deduplicará
fetch('/api/meta/purchase-from-session', {
  method: 'POST',
  body: JSON.stringify({ event_id: eventId, ... })
})

// Resultado: Conta como 1 evento, não 2
```

---

## Teste 8: Validar com cURL (Avançado)

Se quiser testar a Conversions API diretamente:

```bash
# Certifique-se de ter seu Access Token
TOKEN="seu_token_aqui"
PIXEL_ID="1139772708143683"

# Teste um evento Purchase
curl -X POST \
  https://graph.facebook.com/v20.0/${PIXEL_ID}/events \
  -d "access_token=${TOKEN}" \
  -d "data=[{
    'event_name': 'Purchase',
    'event_time': $(date +%s),
    'action_source': 'website',
    'event_id': 'test_' + $(date +%s),
    'custom_data': {
      'value': 99.99,
      'currency': 'GBP'
    }
  }]" \
  -H "Content-Type: application/json"

# Resposta esperada:
# {"events_received": 1}
```

---

## Referência Rápida de Eventos

| Evento | Quando Disparar | Parâmetros Chave |
|--------|-----------------|------------------|
| **PageView** | Carregamento da página | Nenhum requerido |
| **ViewContent** | Usuário visualiza produto | `content_id`, `content_name`, `value`, `currency` |
| **AddToCart** | Usuário adiciona ao carrinho | `content_id`, `content_name`, `value`, `currency`, `num_items` |
| **InitiateCheckout** | Usuário inicia checkout | `content_ids`, `value`, `currency`, `num_items` |
| **Purchase** | Usuário completa compra | `content_ids`, `value`, `currency`, `num_items` |
| **Lead** | Usuário deixa informações | `email`, `phone`, `value` |

---

## Logs Esperados (Sucesso)

Quando tudo está funcionando, você verá no console:

```
[Meta CAPI] 📤 Enviando evento Purchase para pixel 1139772708143683 (moeda: GBP)
[Meta CAPI] ✅ Evento Purchase enviado com sucesso (eventID: purchase_abc123, pixelID: 1139772708143683)
```

E no Events Manager do Facebook, você verá o evento listado.

---

## Contato com Facebook

Se os eventos ainda não aparecerem após configurar tudo:

1. Verifique se o Pixel está ativo: https://events.facebook.com
2. Verifique se há algum aviso no Events Manager
3. Se o Pixel estiver "Unverified", você pode ter que verificar o domínio novamente
4. Contate Facebook Business Support

---

**Última Atualização:** 25 de Fevereiro de 2026
