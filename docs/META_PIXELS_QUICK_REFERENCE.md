# Quick Reference - Meta Pixels Configuration

**Verificação Rápida:** ✅ Ambos os pixels funcionando sem conflitos

---

## 🔧 Configuração Atual

### Pixels Ativos

\`\`\`
Primário:   2121061958705826
Secundário: 1414359356968137
\`\`\`

### Arquivos Principais

\`\`\`
├── components/meta-pixel-provider.tsx      ← Inicialização (client)
├── lib/meta-pixel.ts                       ← Tracking functions (client)
├── lib/meta/sendEvent.ts                   ← Server-side CAPI
├── lib/meta-capi.ts                        ← Alternativo (deprecated)
├── app/api/meta-event/route.ts             ← Endpoint deprecado
├── app/api/meta/purchase-from-session/route.ts  ← Novo endpoint
└── lib/meta/cookies.ts                     ← Cookie utilities
\`\`\`

---

## ✅ Checklist de Verificação

### Inicialização
- [x] MetaPixelProvider no layout.tsx
- [x] Guard `__META_PIXEL_INITED__` ativo
- [x] Ambos os pixels inicializados
- [x] Noscript fallback presente

### Rastreamento Client
- [x] fbq ("track") funciona
- [x] PageView automático
- [x] ViewContent, ATC, IC disponíveis
- [x] EventID único por evento
- [x] Deduplicação automática

### Rastreamento Server
- [x] CAPI configurado
- [x] PII hasheado
- [x] FBC/FBP capturados
- [x] IP e UA inclusos
- [x] Purchase event enviado

### Segurança
- [x] Tokens em .env
- [x] Sem dados sensíveis em código
- [x] HTTPS em produção
- [x] SHA-256 hashing

---

## 🎯 Eventos Suportados

| Evento | Client | Server | Primário | Secundário |
|--------|--------|--------|----------|-----------|
| PageView | ✅ | ❌ | ✅ | ✅ |
| ViewContent | ✅ | ❌ | ✅ | ✅ |
| AddToCart | ✅ | ❌ | ✅ | ✅ |
| InitiateCheckout | ✅ | ❌ | ✅ | ✅ |
| Purchase | ✅ | ✅ | ✅ | ✅ |

---

## 📡 Endpoints de API

### Novo (Recomendado)
\`\`\`
POST /api/meta/purchase-from-session
Body: { session_id: "stripe_session_id" }
Response: { ok: true, metaRes: {...}, debug: {...} }
\`\`\`

### Antigo (Deprecado)
\`\`\`
POST /api/meta-event
Body: { event_name, email, phone, value, currency, ... }
\`\`\`

---

## 🔍 Como Verificar

### No Navegador (Console)
\`\`\`javascript
// 1. FBQ disponível?
console.log(typeof window.fbq === 'function')  // true

// 2. Pixels inicializados?
console.log(window.__META_PIXEL_INITED__)  // true

// 3. Cookies presentes?
console.log(document.cookie.includes('_fbp'))
console.log(document.cookie.includes('_fbc'))

// 4. Traçar evento manualmente
window.fbq("track", "ViewContent", {
  content_ids: ["prod_123"],
  content_name: "Product Name",
  value: 29.99,
  currency: "GBP"
})
\`\`\`

### Em Meta Ads Manager
1. Ir para Events Manager
2. Selecionar pixel (2121061958705826)
3. Verificar eventos chegando
4. Procurar por eventID (dedup)

### Com Meta Pixel Helper (Chrome)
1. Instalar extensão
2. Visitar site
3. Ver lista de eventos em tempo real
4. Confirmar ambos os IDs aparecem

---

## 🛠️ Troubleshooting Rápido

| Problema | Verificação | Solução |
|----------|------------|--------|
| FBQ não carregou | Console: `typeof window.fbq` | Verificar script de loader |
| Cookies vazios | DevTools: Cookies | Pode estar bloqueado |
| Purchase não chega | Meta Events Manager | Aguardar 15min ou verificar token |
| Dedup não funciona | EventID duplicado? | Confirmar mesmo ID em ambas chamadas |

---

## 🔐 Variáveis de Ambiente Obrigatórias

\`\`\`bash
# Essencial para CAPI (Purchase server-side)
META_PIXEL_ID=2121061958705826
META_ACCESS_TOKEN=your_long_token_here

# Opcional (para testes)
META_TEST_EVENT_CODE=TEST12345
\`\`\`

---

## 📊 Fluxo de Purchase (Diagrama Simplificado)

\`\`\`
Checkout Completado
        ↓
Stripe Session Criada
        ↓
Cliente POST /api/meta/purchase-from-session
        ↓
Server:
├─ Busca Stripe Session
├─ Extrai: email, phone, address, amount
├─ Lê: cookies (fbc, fbp), IP, UA
├─ Hash: email, phone
└─ Envia via CAPI
        ↓
Meta Conversions API
        ↓
Deduplica por eventID
        ↓
Purchase count +1 (ambos pixels)
\`\`\`

---

## 🚨 Alertas Automáticos (Implementar)

\`\`\`
❌ FBP cookie não capturado
❌ FBC cookie não capturado
❌ Purchase event não chegou em 30 min
❌ Taxa de erro Meta >1%
⚠️  IP não capturado
⚠️  Email/Phone não fornecido
\`\`\`

---

## 📋 Manutenção Regular

### Diária
- [ ] Verificar erro rate Meta <0.5%
- [ ] Confirmar Purchase events chegando

### Semanal
- [ ] Revisar logs de erro
- [ ] Verificar taxa de capture FBC/FBP
- [ ] Testar compra de teste

### Mensal
- [ ] Audit de deduplicação
- [ ] Revisar ROI de conversões
- [ ] Verificar mudanças em Meta API

---

## 📞 Quick Support Contacts

**Meta Support:** https://www.facebook.com/business/help/  
**Meta Documentation:** https://developers.facebook.com/docs/facebook-pixel/  
**Conversions API Docs:** https://developers.facebook.com/docs/marketing-api/conversions-api/  

---

## ✨ Dicas Pro

1. **Usar EventID único para dedup:**
   \`\`\`javascript
   const eventId = `purchase_${orderId}_${timestamp}`
   \`\`\`

2. **Sempre incluir FBC/FBP:**
   - Melhora attribution
   - Aumenta match rate
   - Mais dados para AI da Meta

3. **Hash PII corretamente:**
   - email: trim + lowercase + SHA256
   - phone: digits only + SHA256

4. **Teste em produção:**
   - Use META_TEST_EVENT_CODE
   - Não polui dados reais
   - Permite QA completo

5. **Monitore latência:**
   - Client track: <1sec
   - Server CAPI: <5sec
   - Meta eventos: ~15min

---

## 🎓 Recursos Adicionais

**Documentação Oficial:**
- [Meta Pixel Setup](https://developers.facebook.com/docs/facebook-pixel/implementation/)
- [Conversions API Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/)
- [Event Deduplication](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplication/)

**Ferramentas:**
- Meta Pixel Helper: Chrome extension
- Meta Events Manager: dashboard
- Meta Conversions API Debugger: online tool

**Comunidade:**
- Meta Developers Community
- Stack Overflow (tag: facebook-pixel)
- Meta Partner Forum

---

## 📝 Notas

- ✅ Ambos pixels funcionam simultâneamente
- ✅ Sem conflitos ou sobreposições
- ✅ Deduplicação funcionando
- ✅ Segurança implementada
- ⚠️ Requer monitoramento regular
- 💡 Melhorias disponíveis (logging, dashboard, alertas)

**Status Final:** ✅ **PRONTO PARA PRODUÇÃO**
