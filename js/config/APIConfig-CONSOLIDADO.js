/**
 * Configuração Consolidada da API - SmartStock
 * 
 * Este arquivo é a FONTE ÚNICA DE VERDADE para configurações de API
 * Todos os outros arquivos devem importar deste
 * 
 * MUDANÇAS RECENTES:
 * ✅ Endpoint de login corrigido: /login → /auth/login
 * ✅ Headers padronizados
 * ✅ Suporte a variáveis de ambiente
 * ✅ Configuração de retry e timeout
 */

class APIConfig {
  /**
   * URL Base da API
   * 
   * Ordem de prioridade:
   * 1. Variável de ambiente VITE_API_URL (para Vite)
   * 2. Variável de ambiente REACT_APP_API_URL (para Create React App)
   * 3. Valor hardcoded (fallback)
   */
  static get BASE_URL() {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'http://localhost:8080/api';
  }

  /**
   * Headers padrão para todas as requisições
   * Serão sobrescritos conforme necessário
   */
  static HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'pt-BR,pt;q=0.9'
  };

  /**
   * Endpoints da API
   * 
   * Para usar: APIConfig.ENDPOINTS.AUTH.LOGIN → '/auth/login'
   * URL completa será: BASE_URL + endpoint
   */
  static ENDPOINTS = {
    // ===== AUTENTICAÇÃO =====
    AUTH: {
      LOGIN: '/auth/login',           // ← CORRIGIDO: era /login
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      VERIFY_EMAIL: '/auth/verify-email',
    },

    // ===== USUÁRIOS =====
    USUARIOS: {
      LIST: '/usuarios',
      CREATE: '/usuarios',
      GET: '/usuarios/:id',
      UPDATE: '/usuarios/:id',
      DELETE: '/usuarios/:id',
      RECUPERAR_SENHA: '/usuarios/recuperar-senha',
      REDEFINIR_SENHA: '/usuarios/redefinir-senha/:token',
      PERFIL: '/usuarios/perfil',
    },

    // ===== PRODUTOS =====
    PRODUTOS: {
      LIST: '/produtos',
      CREATE: '/produtos',
      GET: '/produtos/:id',
      UPDATE: '/produtos/:id',
      DELETE: '/produtos/:id',
      BY_MERCADO: '/produtos/mercado/:mercadoId',
      BY_FORNECEDOR: '/produtos/fornecedor/:fornecedorId',
      BY_CATEGORIA: '/produtos/categoria/:categoria',
      SEARCH: '/produtos/search',
    },

    // ===== FORNECEDORES =====
    FORNECEDORES: {
      LIST: '/fornecedores',
      CREATE: '/fornecedores',
      GET: '/fornecedores/:id',
      UPDATE: '/fornecedores/:id',
      DELETE: '/fornecedores/:id',
      BY_NOME: '/fornecedores/nome/:nome',
      BY_EMAIL: '/fornecedores/email/:email',
    },

    // ===== FUNCIONÁRIOS =====
    FUNCIONARIOS: {
      LIST: '/funcionarios',
      CREATE: '/funcionarios',
      GET: '/funcionarios/:id',
      UPDATE: '/funcionarios/:id',
      DELETE: '/funcionarios/:id',
      BY_MERCADO: '/funcionarios/mercado/:mercadoId',
    },

    // ===== MERCADOS =====
    MERCADOS: {
      LIST: '/mercados',
      CREATE: '/mercados',
      GET: '/mercados/:id',
      UPDATE: '/mercados/:id',
      DELETE: '/mercados/:id',
    },

    // ===== VENDAS =====
    VENDAS: {
      LIST: '/vendas',
      CREATE: '/vendas',
      GET: '/vendas/:id',
      UPDATE: '/vendas/:id',
      DELETE: '/vendas/:id',
      BY_MERCADO: '/vendas/mercado/:mercadoId',
      RELATORIO: '/vendas/relatorio',
    },

    // ===== SAÚDE DA API =====
    HEALTH: '/health',
    STATUS: '/status',
  };

  /**
   * Configurações de timeout e retry
   */
  static REQUEST_TIMEOUT = 30000; // 30 segundos
  static MAX_RETRIES = 3;
  static RETRY_DELAY = 1000; // 1 segundo

  /**
   * Códigos HTTP de erro com mensagens amigáveis
   */
  static ERROR_MESSAGES = {
    400: 'Requisição inválida',
    401: 'Autenticação necessária. Faça login novamente.',
    403: 'Você não tem permissão para acessar este recurso.',
    404: 'Recurso não encontrado.',
    409: 'Conflito. O recurso já existe ou foi modificado.',
    422: 'Dados inválidos. Verifique os campos preenchidos.',
    429: 'Muitas requisições. Aguarde e tente novamente.',
    500: 'Erro interno do servidor. Tente novamente mais tarde.',
    503: 'Serviço indisponível. O servidor está em manutenção.',
    0: 'Erro de conexão. Verifique sua internet e se a API está rodando.',
  };

  /**
   * Verifica se a API está configurada corretamente
   */
  static validate() {
    const baseUrl = this.BASE_URL;
    
    if (!baseUrl) {
      console.error('❌ BASE_URL não está configurada');
      return false;
    }

    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      console.error('❌ BASE_URL deve começar com http:// ou https://');
      return false;
    }

    console.log(`✅ APIConfig validado - URL: ${baseUrl}`);
    return true;
  }
}

// Validar ao carregar o módulo
try {
  APIConfig.validate();
} catch (e) {
  console.warn('Aviso ao validar APIConfig:', e.message);
}

// Exportar para uso em módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIConfig;
}
