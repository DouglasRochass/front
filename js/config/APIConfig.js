/**
 * Configuração centralizada da API
 */

class APIConfig {
  static get BASE_URL() {
    return 'http://localhost:8080/api';
  }

  static ENDPOINTS = {
    AUTH: {
      LOGIN: '/login',
      LOGOUT: '/logout',
      REFRESH: '/refresh',
    },
    USUARIOS: {
      LIST: '/usuarios',
      CREATE: '/usuarios',
      GET: '/usuarios/:id',
      UPDATE: '/usuarios/:id',
      DELETE: '/usuarios/:id',
      RECUPERAR_SENHA: '/usuarios/recuperar-senha',
      REDEFINIR_SENHA: '/usuarios/redefinir-senha/:token',
    },
    PRODUTOS: {
      LIST: '/produtos',
      CREATE: '/produtos',
      GET: '/produtos/:id',
      UPDATE: '/produtos/:id',
      DELETE: '/produtos/:id',
      BY_CATEGORIA: '/produtos/categoria/:categoria',
      BY_FORNECEDOR: '/produtos/fornecedor/:fornecedorId',
      BY_MERCADO: '/produtos/mercado/:mercadoId',
    },
    FORNECEDORES: {
      LIST: '/fornecedores',
      CREATE: '/fornecedores',
      GET: '/fornecedores/:id',
      UPDATE: '/fornecedores/:id',
      DELETE: '/fornecedores/:id',
      BY_NOME: '/fornecedores/nome/:nome',
      BY_EMAIL: '/fornecedores/email/:email',
    },
    FUNCIONARIOS: {
      LIST: '/funcionarios',
      CREATE: '/funcionarios',
      GET: '/funcionarios/:id',
      UPDATE: '/funcionarios/:id',
      DELETE: '/funcionarios/:id',
      BY_MERCADO: '/funcionarios/mercado/:mercadoId',
    },
    MERCADOS: {
      LIST: '/mercados',
      CREATE: '/mercados',
      GET: '/mercados/:id',
      UPDATE: '/mercados/:id',
      DELETE: '/mercados/:id',
    },
    VENDAS: {
      LIST: '/vendas',
      CREATE: '/vendas',
      GET: '/vendas/:id',
      RELATORIO: '/vendas/relatorio',
    },
    IMPORTACAO: {
      CSV: '/importacao/csv',
      EXCEL: '/importacao/excel',
    },
  };

  static HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  static TIMEOUT = 30000;
}

export default APIConfig;
