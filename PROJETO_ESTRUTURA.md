# SmartStock Frontend - Estrutura Completa

## 📁 Estrutura de Diretórios

```
frontend/
├── index.html                    # Página principal/landing
├── login.html                    # Página de autenticação
├── recuperar_login.html          # Recuperação de senha
├── dashboard.html                # Dashboard principal ✅
├── produtos.html                 # Gerenciamento de produtos ✅
├── fornecedores.html             # Gerenciamento de fornecedores ✅
├── funcionarios.html             # Gerenciamento de funcionários ✅
├── mercados.html                 # Gerenciamento de mercados ✅
├── vendas.html                   # Histórico e registro de vendas ✅
│
├── js/
│   ├── config/
│   │   └── APIConfig.js          # Configuração de endpoints da API
│   │
│   ├── services/
│   │   ├── APIService.js         # Cliente HTTP com token refresh
│   │   ├── AuthService.js        # Gerenciamento de autenticação
│   │   ├── ProdutoService.js     # CRUD de produtos
│   │   ├── FornecedorService.js  # CRUD de fornecedores
│   │   ├── FuncionarioService.js # CRUD de funcionários
│   │   └── MercadoService.js     # CRUD de mercados
│   │
│   ├── components/
│   │   ├── Navbar.js             # Barra de navegação
│   │   ├── Modal.js              # Componente de modal
│   │   ├── Toast.js              # Sistema de notificações
│   │   ├── DataTable.js          # Tabela com paginação
│   │   └── FormBuilder.js        # Gerador dinamico de formulários
│   │
│   └── utils/
│       └── Validator.js          # Validação e formatação de dados
│
└── styles/
    └── main.css                  # Estilos globais (design system)
```

## 🎨 Design System (CSS Variables)

### Cores
- **Primary (Azul)**: #3B82F6
- **Secondary (Cinza)**: #6B7280
- **Success (Verde)**: #10B981
- **Warning (Amarelo)**: #F59E0B
- **Error (Vermelho)**: #EF4444
- **Info (Ciano)**: #06B6D4

### Espaçamentos
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Tipografia
- Fonte Principal: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Body: 1rem (16px)
- Títulos H1-H6 com escala proporcional

## 🔐 Autenticação & Autorização

### Fluxo de Autenticação
1. Usuário faz login em `login.html`
2. AuthService valida credenciais
3. Backend retorna tokens (access + refresh)
4. Tokens armazenados em localStorage
5. APIService injeta token em todas as requisições
6. Refresh automático ao receber erro 401

### Níveis de Acesso
- **Master**: Acesso total (configurar mercados, importações)
- **Gestor**: Gerenciar produtos, fornecedores, funcionários
- **Funcionário**: Visualizar e registrar vendas

## 📱 Componentes da Aplicação

### 1. **Navbar.js**
- Renderiza menu de navegação
- Menu de usuario com dropdown
- Logout integration
- Responsive em mobile

### 2. **Modal.js**
- Diálogos customizáveis
- Tamanhos: sm (300px), md (500px), lg (700px), xl (900px)
- Callbacks para botões
- Close automático ao clicar fora

### 3. **Toast.js**
- Notificações tipo: success, error, warning, info, loading
- Auto-dismiss configurável
- Stack múltiplas notificações
- Posicionamento fixed top-right

### 4. **DataTable.js**
- Renderização dinâmica de tabelas
- Paginação com configurable page size
- Busca/filtro em tempo real
- Ações: view, edit, delete
- Formatação de campos

### 5. **FormBuilder.js**
- Geração dinâmica de formulários
- Tipos de campos: text, email, password, number, date, tel, url, textarea, select, checkbox, radio
- Validação integrada
- Gerenciamento de estado: getValues(), setValues(), reset()

### 6. **Validator.js**
Funções:
- `isValidEmail()` - Validação de email
- `isValidCPF()` / `isValidCNPJ()` - Validação de documentos
- `isValidPhone()` - Validação de telefone
- `isValidURL()` - Validação de URL
- `getPasswordStrength()` - Força de senha (0-5)
- `formatCPF()`, `formatCNPJ()`, `formatPhone()` - Formatação
- `isEmpty()`, `isLengthValid()`, `isValidNumber()` - Validações utilitárias

## 🔗 Páginas Implementadas

### ✅ Dashboard (`dashboard.html`)
- Cards de estatísticas (Total de Produtos, Estoque, etc)
- Consumo da API para dados reais
- Atividades recentes
- Link para outras páginas

### ✅ Produtos (`produtos.html`)
- Listagem com DataTable
- Busca e paginação
- CRUD completo (criar, editar, deletar, visualizar)
- Validação de formulário
- Integração com ProdutoService

### ✅ Fornecedores (`fornecedores.html`)
- Gerenciamento de fornecedores
- Campos: Nome, CNPJ, Email, Telefone, Endereço, Cidade, CEP
- CRUD completo
- Validação com Validator.js

### ✅ Funcionários (`funcionarios.html`)
- Acesso restrito a gerentes/master
- Campos: Nome, Email, Cargo, Mercado
- CRUD com verificação de permissões
- Integração com FuncionarioService

### ✅ Mercados (`mercados.html`)
- Acesso restrito a master (admin)
- Campos: Nome, Email, Telefone, Endereço
- Gerenciamento de lojas
- CRUD completo

### ✅ Vendas (`vendas.html`)
- Histórico de vendas
- Cards de resumo (Total, Faturamento, Ticket Médio)
- Listagem de transações
- Opção de nova venda (modal)

## 🚀 Como Usar

### Iniciando a Aplicação
```bash
# 1. Certifique-se que o backend está rodando
# http://localhost:8080/api

# 2. Abra em um servidor local
# (recomendado: Live Server do VS Code)

# 3. Acesse
# http://localhost:5500 (ou porta do seu server)
```

### Fluxo de Desenvolvimento
1. Criar nova página HTML (ex: `relatorios.html`)
2. Importar componentes necessários (Navbar, DataTable, etc)
3. Importar service apropriado (ProdutoService, etc)
4. Carregar dados: `const result = await ProdutoService.listar()`
5. Renderizar componentes no DOM
6. Adicionar event listeners

### Exemplo de Integração
```javascript
import Navbar from '/js/components/Navbar.js';
import ProdutoService from '/js/services/ProdutoService.js';
import DataTable from '/js/components/DataTable.js';
import AuthService from '/js/services/AuthService.js';

// Verificar auth
if (!AuthService.isAuthenticated()) {
  window.location.href = '/login.html';
}

// Renderizar navbar
const navbar = new Navbar();
navbar.render();

// Carregar dados
const resultado = await ProdutoService.listar();

// Renderizar tabela
const table = new DataTable({
  containerId: 'tabela-id',
  columns: [...],
  data: resultado.data,
  onEdit: editFunction,
  onDelete: deleteFunction,
});

table.render();
table.addActionListeners();
```

## 📊 API Endpoints Disponíveis

```
POST   /api/auth/login                    - Autenticar usuário
POST   /api/auth/refresh                  - Renovar token
POST   /api/auth/logout                   - Logout
GET    /api/usuarios/{id}                 - Obter usuário
GET    /api/produtos                      - Listar produtos
POST   /api/produtos                      - Criar produto
PUT    /api/produtos/{id}                 - Atualizar produto
DELETE /api/produtos/{id}                 - Deletar produto
GET    /api/fornecedores                  - Listar fornecedores
POST   /api/fornecedores                  - Criar fornecedor
PUT    /api/fornecedores/{id}             - Atualizar fornecedor
DELETE /api/fornecedores/{id}             - Deletar fornecedor
GET    /api/funcionarios                  - Listar funcionários
POST   /api/funcionarios                  - Criar funcionário
GET    /api/mercados                      - Listar mercados
POST   /api/mercados                      - Criar mercado
GET    /api/vendas                        - Listar vendas
POST   /api/vendas                        - Registrar venda
```

## 🔍 Troubleshooting

### Erro: "Acesso negado" na página
- Verificar `AuthService.isAuthenticated()`
- Confirmar token em localStorage
- Testar login em `login.html`

### Dados não carregam
- Verificar se backend está rodando (8080)
- Ver console para erros de CORS
- Validar endpoints em `APIConfig.js`

### Estilo quebrado
- Confirmar `<link rel="stylesheet" href="/styles/main.css">`
- Caminho relativo correto
- Limpar cache do navegador (Ctrl+Shift+R)

## 📝 Próximas Melhorias

- [ ] Página de Relatórios com gráficos
- [ ] Página de Configurações de usuário
- [ ] Importação de produtos em CSV/Excel
- [ ] Exportação de relatórios em PDF
- [ ] Sistema de notificações em tempo real
- [ ] Dark mode toggle
- [ ] Responsividade mobile completa
- [ ] Testes unitários (Jest/Vitest)
- [ ] Sistema de cache local
- [ ] Suporte offline com Service Workers

---

**Versão**: 1.0.0  
**Última atualização**: Abril 2024  
**Mantido por**: SmartStock Dev Team
