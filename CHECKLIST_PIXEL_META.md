# ✅ CHECKLIST: Pixel Meta 1139772708143683

## 📋 PRÉ-REQUISITOS

- [ ] Você tem acesso a Facebook Business Manager
- [ ] Você é admin do Pixel 1139772708143683
- [ ] Você tem acesso ao Vercel Project (v0-lp-uk)

---

## 🚀 SETUP INICIAL (5 minutos)

### Passo 1: Gerar Access Token
- [ ] Acesse https://business.facebook.com/settings
- [ ] Navegue para **Events Manager**
- [ ] Selecione Pixel **1139772708143683**
- [ ] Clique em ⚙️ **Settings**
- [ ] Procure **Conversions API**
- [ ] Clique em **Generate Access Token**
- [ ] Copie o token para um lugar seguro

### Passo 2: Configurar em Vercel
- [ ] Abra v0 (editor de código)
- [ ] Clique em **Vars** (barra lateral esquerda)
- [ ] Adicione: `META_PIXEL_ID=1139772708143683`
- [ ] Adicione: `META_ACCESS_TOKEN=<seu_token>`
- [ ] Clique **Save**

### Passo 3: Redeploy
- [ ] Verifique se mudanças foram feitas (Git status)
- [ ] Commit automático de mudanças
- [ ] Aguarde redeploy (2-3 minutos)
- [ ] Abra o site em nova aba (Ctrl+Shift+R para limpar cache)

---

## ✅ VALIDAÇÃO INICIAL

### Teste 1: Pixel Carregado no Browser
- [ ] Abra DevTools (F12)
- [ ] Cole no console: `typeof window.fbq === 'function'`
- [ ] Resultado deve ser: `true`
- [ ] Se falso, pixel não foi carregado

### Teste 2: Meta Tag Presente
- [ ] DevTools → **Elements** → **Head**
- [ ] Procure por: `facebook-domain-verification`
- [ ] Deve estar presente: `content="doluxynzdjfzg90rzthp0243s680oy"`

### Teste 3: Events Sendo Disparados
- [ ] Instale [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/)
- [ ] Navegue pelo site
- [ ] Clique no ícone da extensão
- [ ] Você deve ver eventos como:
  - [ ] PageView (ao carregar página)
  - [ ] ViewContent (ao ver produto)
  - [ ] AddToCart (ao adicionar ao carrinho)

### Teste 4: Logs do Servidor
- [ ] Abra terminal e execute: `vercel logs --tail`
- [ ] Navegue pelo site
- [ ] Procure por logs contendo `[Meta CAPI]`
- [ ] Se vir `❌ ERRO CRÍTICO`, Access Token não foi configurada

---

## 🧪 TESTE COMPLETO (15 minutos)

### Preparação
- [ ] Limpe cookies: Ctrl+Shift+Del → Selecione tudo → Limpar
- [ ] Abra site em modo incógnito (Ctrl+Shift+N)
- [ ] Verifique que DevTools mostra novo FBP cookie

### Durante a Compra
- [ ] Navegue até um produto
- [ ] Meta Pixel Helper mostra **ViewContent** ✓
- [ ] Adicione ao carrinho
- [ ] Meta Pixel Helper mostra **AddToCart** ✓
- [ ] Vá para checkout
- [ ] Meta Pixel Helper mostra **InitiateCheckout** ✓
- [ ] Complete a compra (teste)
- [ ] Meta Pixel Helper mostra **Purchase** ✓

### Após a Compra
- [ ] Você é redirecionado para página de obrigado
- [ ] DevTools → Console → Procure por:
  ```
  [Meta CAPI] 📤 Enviando evento Purchase...
  [Meta CAPI] ✅ Evento Purchase enviado com sucesso...
  ```
- [ ] Se vir erros, anote qual é

---

## 📊 VERIFICAÇÃO NO EVENTS MANAGER

### Setup Events Manager
- [ ] Acesse https://events.facebook.com
- [ ] Selecione seu Pixel (1139772708143683)
- [ ] Clique em **Test Events**
- [ ] Mantenha esta aba aberta

### Executar Testes
- [ ] Volta à aba do site
- [ ] Faça uma ação (ex: adicione produto ao carrinho)
- [ ] Volta ao Events Manager
- [ ] Aguarde 15-30 segundos
- [ ] Evento deve aparecer na lista

### Verificar cada Evento
- [ ] [ ] PageView aparece em Test Events
- [ ] [ ] ViewContent aparece com detalhes do produto
- [ ] [ ] AddToCart aparece com valor
- [ ] [ ] Purchase aparece com valor e moeda
- [ ] [ ] Cada evento tem um eventID único

---

## 🔧 TROUBLESHOOTING

### Se Receber Erro: "Missing access token"
- [ ] Verifique Vars → `META_ACCESS_TOKEN` está preenchida?
- [ ] Verifique se não tem espaços antes/depois do token
- [ ] Copie o token novamente (caso tenha errado)
- [ ] Regenere um novo token no Events Manager
- [ ] Tente novamente

### Se Pixel Não Dispara
- [ ] Verifique DevTools → Console → Erros?
- [ ] Verifique que `window.fbq` existe (tipie no console)
- [ ] Tente em outro navegador (Chrome, Firefox, etc)
- [ ] Teste em modo incógnito
- [ ] Limpe cookies e tente novamente

### Se Events Manager Está Vazio
- [ ] Aguarde 15-30 minutos (delay normal)
- [ ] Tente fazer outra ação no site
- [ ] Verifique que está olhando para o **Test Events** correto
- [ ] Verifique que o Pixel ID no site é `1139772708143683`
- [ ] Verifique no console: `window._fbq._i`

---

## 📱 TESTES AVANÇADOS

### Multi-Device
- [ ] [ ] Teste no iPhone/iPad
- [ ] [ ] Teste no Android
- [ ] [ ] Teste em Firefox
- [ ] [ ] Teste em Safari

### Multi-Currency (Se Aplicável)
- [ ] [ ] Mude para GBP → Complete compra
- [ ] [ ] Mude para USD → Complete compra
- [ ] [ ] Mude para EUR → Complete compra
- [ ] [ ] Verifique que currency correta aparece em Events Manager

### Edge Cases
- [ ] [ ] Teste com JavaScript desabilitado (noscript tag)
- [ ] [ ] Teste com adblocker ativado
- [ ] [ ] Teste sem cookies habilitados
- [ ] [ ] Teste com VPN/Proxy

---

## 🎯 CRITÉRIOS DE SUCESSO

### ✅ Sucesso se:
- [x] `typeof window.fbq === 'function'` retorna `true`
- [x] Meta Pixel Helper mostra eventos em tempo real
- [x] Events Manager → Test Events mostra seus eventos
- [x] Logs do servidor mostram `✅ Evento Purchase enviado com sucesso`
- [x] Nenhum erro relacionado a Access Token

### ❌ Falha se:
- [ ] `window.fbq` é `undefined`
- [ ] Nenhum evento aparece em Test Events após 30 minutos
- [ ] Console mostra erro: `Missing access token`
- [ ] Logs mostram: `❌ ERRO CRÍTICO: Access Token vazio`

---

## 📝 NOTAS/OBSERVAÇÕES

```
Data do Setup: _____________________
Access Token primeiras 10 chars: _____________________
Pixel IDs (se multi-pixel): 
  - GBP: _____________________
  - USD: _____________________
  - EUR: _____________________

Problemas encontrados:
_________________________________________________________________
_________________________________________________________________

Resolvido? [ ] Sim [ ] Não [ ] Parcialmente
```

---

## 🎓 PRÓXIMAS ETAPAS (Após Sucesso)

- [ ] Criar Conversão Padrão no Ads Manager
- [ ] Ligar Catálogo de Produtos
- [ ] Testar Audience Matching
- [ ] Implementar pixel para Leads (se aplicável)
- [ ] Monitorar eventos por 1 semana

---

## 📞 CONTATO PARA PROBLEMAS

Se não conseguir resolver:

1. **Leia** → `ANALISE_PIXEL_1139772708143683.md`
2. **Execute Testes** → `DEBUG_PIXEL_META.md`
3. **Verifique Logs** → `vercel logs --tail`
4. **Contate** → v0 Support ou Facebook Business Support

---

## ✨ DICAS FINAIS

- 💡 Sempre teste em modo incógnito (sem cache)
- 💡 Meta Pixel Helper é seu melhor amigo para debug
- 💡 Logs do servidor (`vercel logs`) mostram tudo
- 💡 Events Manager mostra dados com delay de 15-30 minutos
- 💡 Se funcionar uma vez, vai funcionar sempre (cache resolvido)

---

**Checklist Versão:** 1.0  
**Última Atualização:** 25 de Fevereiro de 2026  
**Status:** Pronto para Implementação
