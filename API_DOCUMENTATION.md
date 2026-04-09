# SmartStock - Integração com API

## Visão Geral

Este projeto frontend foi integrado com a API do Sistema de Estoque, permitindo:
- Autenticação de usuários
- Recuperação de senha
- Gerenciamento de produtos
- Controle de estoque
- Relatórios

## Estrutura de Arquivos

### Arquivos de Configuração e Serviços

- **`api-config.js`** - Configurações centralizadas da API
  - URLs dos endpoints
  - Headers padrão
  - Configurações de timeout e retry

- **`api-service.js`** - Serviço principal de consumo da API
  - Gerenciamento de autenticação
  - Requisições HTTP genéricas
  - Tratamento de erros
  - Métodos específicos para cada recurso

- **`auth-handler.js`** - Manipulador de autenticação
  - Configuração de listeners de formulários
  - Tratamento de login
  - Tratamento de recuperação de senha
  - Exibição de mensagens de feedback

- **`utils.js`** - Utilidades gerais
  - Validações (email, CPF, etc)
  - Formatadores (moeda, data, telefone, etc)
  - Funções auxiliares (debounce, throttle, etc)

### Páginas HTML

- **`tela_login.html`** - Página de login
  - Integrada com `auth-handler.js`
  - Consome endpoint `/auth/login`

- **`recuperar_login.html`** - Página de recuperação de senha
  - Integrada com `auth-handler.js`
  - Consome endpoint `/auth/forgot-password`

- **`redefinir_senha.html`** - Página de redefinição de senha
- **`senha_atualizada.html`** - Página de confirmação de senha atualizada
- **`verificar_email.html`** - Página de verificação de email

## Uso da API

### 1. Configurar a URL Base

Edite o arquivo `api-config.js` e ajuste a URL base:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://seu-servidor.com/api', // Ajuste conforme necessário
  // ...
};
```

### 2. Login

```javascript
import { apiService } from './api-service.js';

const resposta = await apiService.login('usuario', 'senha');

if (!resposta.sucesso === false && resposta.token) {
  console.log('Login realizado com sucesso!');
  // O token é armazenado automaticamente
} else {
  console.error('Erro:', resposta.mensagem);
}
```

### 3. Recuperar Senha

```javascript
const resposta = await apiService.recuperarSenha('usuario@email.com');

if (!resposta.sucesso === false) {
  console.log('Email de recuperação enviado!');
} else {
  console.error('Erro:', resposta.mensagem);
}
```

### 4. Obter Produtos

```javascript
const resposta = await apiService.obterProdutos(1, 20, {
  categoria: 'eletrônicos',
  busca: 'notebook'
});

if (!resposta.sucesso === false) {
  console.log('Produtos:', resposta.dados);
} else {
  console.error('Erro:', resposta.mensagem);
}
```

### 5. Obter Estoque

```javascript
const resposta = await apiService.obterEstoque({
  minimo: 10,
  maximo: 1000
});

if (!resposta.sucesso === false) {
  console.log('Estoque:', resposta.dados);
}
```

### 6. Logout

```javascript
await apiService.logout();
```

## Endpoints Disponíveis

### Autenticação

- `POST /auth/login` - Login do usuário
- `POST /auth/logout` - Logout do usuário
- `POST /auth/forgot-password` - Solicitar recuperação de senha
- `POST /auth/reset-password` - Redefinir senha
- `POST /auth/verify-email` - Verificar email

### Usuários

- `GET /usuarios/perfil` - Obter perfil do usuário logado
- `PUT /usuarios/atualizar` - Atualizar dados do usuário
- `GET /usuarios` - Listar usuários (admin)

### Produtos

- `GET /produtos` - Listar produtos (com paginação)
- `GET /produtos/:id` - Obter produto específico
- `POST /produtos` - Criar novo produto
- `PUT /produtos/:id` - Atualizar produto
- `DELETE /produtos/:id` - Deletar produto

### Estoque

- `GET /estoque` - Listar itens do estoque
- `PUT /estoque/:id` - Atualizar quantidade do estoque

### Categorias

- `GET /categorias` - Listar categorias de produtos

### Relatórios

- `GET /relatorios?tipo=...` - Obter relatórios

## Tratamento de Erros

A API retorna erros no seguinte formato:

```javascript
{
  sucesso: false,
  mensagem: "Descrição do erro",
  status: 400,
  dados: null
}
```

### Códigos de Status Comuns

- `200` - Sucesso
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Segurança

### Token de Autenticação

O token é armazenado no `localStorage` e incluído automaticamente em todas as requisições autenticadas:

```javascript
Authorization: Bearer {token}
```

### Expiração de Sessão

Se o token expirar (resposta 401), o usuário é automaticamente redirecionado para a página de login.

## Exemplo Completo de Integração

Para adicionar um novo formulário que consome a API:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Criar Produto</title>
</head>
<body>
  <form id="form-produto">
    <input type="text" id="nome" placeholder="Nome do produto" required>
    <input type="number" id="preco" placeholder="Preço" required>
    <button type="submit">Criar</button>
  </form>

  <script type="module">
    import { apiService } from './api-service.js';

    document.getElementById('form-produto').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const resposta = await apiService.criarProduto({
        nome: document.getElementById('nome').value,
        preco: document.getElementById('preco').value
      });

      if (!resposta.sucesso === false) {
        console.log('Produto criado!');
      } else {
        console.error('Erro:', resposta.mensagem);
      }
    });
  </script>
</body>
</html>
```

## Variáveis de Ambiente (Futuro)

Para melhor segurança, você pode usar um arquivo `.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

## Troubleshooting

### Erro CORS

Se receber erro de CORS, certifique-se de que o servidor API está configurado para aceitar requisições do seu domínio:

```
Access-Control-Allow-Origin: *
```

### Token Inválido

Se receber erro de token inválido:
1. Verifique se o token está sendo armazenado corretamente
2. Verifique a expiração do token no servidor
3. Faça login novamente

### Conectividade

Use a função de utilidade para verificar conectividade:

```javascript
import { Utils } from './utils.js';

const temConexao = await Utils.verificarConectividade();
```

## Próximos Passos

1. Conectar a página `redefinir_senha.html` ao endpoint de redefinição
2. Conectar a página `verificar_email.html` ao endpoint de verificação
3. Criar páginas de dashboard com listagem de produtos
4. Implementar filtros e busca
5. Adicionar funcionalidades de relatório

## Suporte

Para mais informações sobre a API, consulte a documentação do servidor em:
`C:\Users\DOUGLASROCHASANTOS\Downloads\sistema-estoque`

