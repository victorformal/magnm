# 🚀 GUIA RÁPIDO: Habilitar Pixel Meta 1139772708143683

## Status Atual
- ✅ Pixel inicializado no site (client-side)
- ✅ Meta tag de verificação configurada
- ❌ **CRÍTICO:** Server-side tracking desabilitado (falta Access Token)

---

## 3 Passos para Ativar (5 minutos)

### PASSO 1️⃣ Obter Access Token

1. Vá para https://business.facebook.com/settings
2. Navegue para **Events Manager**
3. Selecione seu Pixel (1139772708143683)
4. Clique em ⚙️ **Settings**
5. Procure **Conversions API** → **Generate Access Token**
6. Copie o token (ex: `EAAx...long_string...xyzzy`)

---

### PASSO 2️⃣ Adicionar Variáveis em v0

Na barra lateral esquerda do v0:
1. Clique em **Vars**
2. Adicione as seguintes variáveis:

| Variável | Valor |
|----------|-------|
| `META_PIXEL_ID` | `1139772708143683` |
| `META_ACCESS_TOKEN` | `cole_seu_token_aqui` |

3. Pressione **Save**

---

### PASSO 3️⃣ Testar

1. **Opção A - DevTools do Navegador:**
   ```javascript
   // Cole no console (F12)
   window.fbq('track', 'TestEvent', {value: 99.99, currency: 'GBP'}, {eventID: 'test-123'})
   ```

2. **Opção B - Faça uma Compra de Teste:**
   - Navegue pelo site
   - Adicione um produto ao carrinho
   - Complete o checkout com dados de teste
   - Verifique os logs: Menu v0 → Logs

3. **Opção C - Verifique em Events Manager:**
   - Vá para https://events.facebook.com
   - Selecione seu Pixel
   - Clique em **Test Events**
   - Espere 15-30 segundos
   - Eventos devem aparecer

---

## ⚠️ Se Receber Erro

### Erro: "Missing access token for pixel 1139772708143683"

**Solução:** A variável `META_ACCESS_TOKEN` está vazia ou incorreta.

1. Verifique em Vars → `META_ACCESS_TOKEN` está preenchida?
2. Verifique se não tem espaços no final do token
3. Regenere o token no Events Manager
4. Tente novamente

---

### Erro: "Pixel ID not found"

**Solução:** O pixel ID está incorreto.

1. Verifique que `META_PIXEL_ID=1139772708143683` (exatamente este)
2. Verifique em Facebook que este é o ID correto do seu pixel
3. Se tiver múltiplos pixels, use o correto

---

## 📊 Como Saber se Está Funcionando

### ✅ Sinais de Sucesso

```javascript
// No console do navegador, você verá:
[Meta CAPI] 📤 Enviando evento Purchase para pixel 1139772708143683 (moeda: GBP)
[Meta CAPI] ✅ Evento Purchase enviado com sucesso (eventID: purchase_123, pixelID: 1139772708143683)
```

### ✅ No Events Manager

1. Vá para https://events.facebook.com
2. Selecione seu Pixel (1139772708143683)
3. Clique em **Test Events**
4. Você verá eventos como:
   - PageView
   - ViewContent
   - AddToCart
   - Purchase

---

## 🔧 Configuração Avançada (Opcional)

### Se Usar 3 Pixels Diferentes (1 por moeda)

Adicione também em Vars:

```
META_PIXEL_ID_GBP=seu_pixel_gbp_id
META_ACCESS_TOKEN_GBP=seu_token_gbp

META_PIXEL_ID_USD=seu_pixel_usd_id
META_ACCESS_TOKEN_USD=seu_token_usd

META_PIXEL_ID_EUR=seu_pixel_eur_id
META_ACCESS_TOKEN_EUR=seu_token_eur

NEXT_PUBLIC_META_PIXEL_ID_GBP=seu_pixel_gbp_id
NEXT_PUBLIC_META_PIXEL_ID_USD=seu_pixel_usd_id
NEXT_PUBLIC_META_PIXEL_ID_EUR=seu_pixel_eur_id
```

Se não configurar as vars por moeda, todos os eventos vão para o pixel principal (1139772708143683).

---

## 📝 Documentação Completa

Para análise detalhada, veja: `docs/ANALISE_PIXEL_1139772708143683.md`

---

**Última Atualização:** 25 de Fevereiro de 2026  
**Versão:** 1.0
