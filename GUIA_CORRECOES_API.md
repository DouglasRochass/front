# 🔧 Guia de Correção - Conexão com API

## 🚀 Como Usar o Debug

1. Abra o arquivo [debug-api.html](debug-api.html) no navegador
2. Siga os 7 passos de diagnóstico
3. Identifique o ponto de falha
4. Aplique as correções abaixo

## 📋 Checklist de Diagnóstico

### Passo 1: Verifique se a API está rodando
```bash
# Terminal - verificar se a API está respondendo
curl http://localhost:8080/api
curl http://localhost:8080/health
# Se receber erro de conexão, a API não está rodando
```

**Se falhar:** Inicie o servidor backend

---

## 🔴 Problemas Encontrados e Soluções

### Problema 1: Inconsistência de Endpoints

**Localização:**
- [js/pages/tela_login.html](js/pages/tela_login.html#L72) usa `/login`
- [js/config/APIConfig.js](js/config/APIConfig.js#L13) usa `/auth/login`

**Solução:** Padronizar em `/auth/login`

```javascript
// ANTES (tela_login.html - linha 72)
ENDPOINTS: {
  LOGIN: '/login',
  // ...
}

// DEPOIS
ENDPOINTS: {
  LOGIN: '/auth/login',
  // ...
}
```

### Problema 2: Dois Arquivos de Configuração

**Localização:**
- `js/config/api-config.js` - tenta usar Vite (import.meta.env)
- `js/config/APIConfig.js` - versão corrigida

**Solução:** Remover arquivo duplicado e usar apenas `APIConfig.js`

```bash
# Remova o arquivo obsoleto
rm js/config/api-config.js
```

**Edite js/config/APIConfig.js para aceitar variáveis de ambiente:**

```javascript
class APIConfig {
  static get BASE_URL() {
    // Tentar variable de ambiente, depois hardcoded
    return process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  }

  static HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'pt-BR'
  };

  static ENDPOINTS = {
    // Autenticação
    AUTH: {
      LOGIN: '/auth/login',         // ← Padronizar aqui
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    // ... resto dos endpoints
  };
}

export default APIConfig;
```

### Problema 3: CORS não configurado

Se a API retorna erro de CORS, o backend precisa ser configurado:

**Backend (Node.js + Express):**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // URL do frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Problema 4: Token Inválido ou Não Está Sendo Enviado

**Verificar localStorage:**
- Abra o DevTools (F12)
- Vá para "Application" → "LocalStorage"
- Procure por `access_token` e `refresh_token`

**Se não houver token:** Fazer login primeiro

**Se houver token inválido:** Verificar se o token vai ser rejeitado

```javascript
// Em APIService.js, quando enviando requisições:
const headers = {
  ...customHeaders,
  'Content-Type': 'application/json'
};

// Adicionar token se existir
if (this.token) {
  headers['Authorization'] = `Bearer ${this.token}`;
}
```

---

## ✅ Passos de Correção Recomendados

### 1. Padronizar Endpoints

**Arquivo:** [js/pages/tela_login.html](js/pages/tela_login.html#L72)

Procure por `ENDPOINTS: { LOGIN: '/login'` e altere para `/auth/login`.

### 2. Consolidar Configuração de API

**Arquivo:** [js/config/APIConfig.js](js/config/APIConfig.js)

Verifique se todos os endpoints estão corretos:
- AUTH.LOGIN: `/auth/login` ✓
- AUTH.LOGOUT: `/auth/logout` ✓
- AUTH.REFRESH: `/auth/refresh` ✓

### 3. Verificar Variáveis de Ambiente

**Criar arquivo `.env` na raiz do projeto:**
```
VITE_API_URL=http://localhost:8080/api
# ou
REACT_APP_API_URL=http://localhost:8080/api
```

### 4. Testar Cada Requisição

Use o arquivo [debug-api.html](debug-api.html) para testar:
1. ✅ Teste de Conexão Básica
2. ✅ Teste de Login
3. ✅ Teste com Autenticação

---

## 🔗 Arquivos Relacionados

| Arquivo | Propósito | Status |
|---------|-----------|--------|
| [js/config/APIConfig.js](js/config/APIConfig.js) | Configuração centralizada | ✅ OK |
| [js/config/api-config.js](js/config/api-config.js) | ⚠️ DUPLICADO - Remover |
| [js/pages/tela_login.html](js/pages/tela_login.html) | Página de login | ⚠️ Endpoint errado |
| [js/services/APIService.js](js/services/APIService.js) | Serviço de API | ✅ OK |
| [debug-api.html](debug-api.html) | 🆕 Ferramenta de debug | ✅ Novo |

---

## 💡 Dicas de Troubleshooting

### Se receber erro 401 (Unauthorized)
- Token expirado ou inválido
- Faça login novamente
- Verifique se o token está sendo enviado no header

### Se receber erro 403 (Forbidden)
- Permissões insuficientes
- Verifique o papel do usuário (admin, gerente, etc)
- Confirme na API se o endpoint requer autenticação específica

### Se receber erro 404 (Not Found)
- Endpoint incorreto
- Verifique a URL exata na API
- Use o debug-api.html para testar diferentes endpoints

### Se receber erro CORS
- Configurar CORS no backend
- Verifique a origem permitida (http://localhost:3000, etc)

### Se receber erro de Network
- API não está rodando
- Verifique: `netstat -oan | findstr :8080` (Windows)
- Inicie o servidor: `npm start` ou similar

---

## 📞 Próximos Passos

1. **Executar debug-api.html** para identificar o ponto de falha exato
2. **Aplicar as correções** recomendadas acima
3. **Testar novamente** com o arquivo de debug
4. **Se ainda não funcionar,** compartilhe:
   - Mensagem de erro exata do console
   - Status code da resposta (401, 403, 404, etc)
   - URL da requisição que falha
