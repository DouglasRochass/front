/**
 * Serviço de Produtos
 * Gerencia operações CRUD de produtos
 */

import APIService from './APIService.js';
import APIConfig from '../config/APIConfig.js';

class ProdutoService {
  /**
   * Lista todos os produtos
   */
  async listar(filtros = {}) {
    try {
      const response = await APIService.get(APIConfig.ENDPOINTS.PRODUTOS.LIST, filtros);
      console.log('[ProdutoService.listar] Response:', response);
      
      // Trata diferentes formatos de resposta
      let produtos = Array.isArray(response) ? response : 
                     response.data && Array.isArray(response.data) ? response.data :
                     response.content && Array.isArray(response.content) ? response.content :
                     [];
      
      return {
        success: true,
        data: produtos,
        message: 'Produtos carregados com sucesso',
      };
    } catch (error) {
      console.error('[ProdutoService.listar] Erro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao listar produtos',
        error,
      };
    }
  }

  /**
   * Obtém produto por ID
   */
  async obter(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.PRODUTOS.GET.replace(':id', id);
      const response = await APIService.get(endpoint);
      console.log('[ProdutoService.obter] Response:', response);
      
      const produto = response.data || response;
      return {
        success: true,
        data: produto,
      };
    } catch (error) {
      console.error('[ProdutoService.obter] Erro:', error);
      return {
        success: false,
        message: error.message || 'Produto não encontrado',
        error,
      };
    }
  }

  /**
   * Cria novo produto
   */
  async criar(produtoData) {
    try {
      const response = await APIService.post(APIConfig.ENDPOINTS.PRODUTOS.CREATE, produtoData);
      console.log('[ProdutoService.criar] Response:', response);
      return {
        success: true,
        data: response.data || response,
        message: 'Produto criado com sucesso',
      };
    } catch (error) {
      console.error('[ProdutoService.criar] Erro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao criar produto',
        error,
      };
    }
  }

  /**
   * Atualiza produto
   */
  async atualizar(id, produtoData) {
    try {
      const endpoint = APIConfig.ENDPOINTS.PRODUTOS.UPDATE.replace(':id', id);
      const response = await APIService.put(endpoint, produtoData);
      console.log('[ProdutoService.atualizar] Response:', response);
      return {
        success: true,
        data: response.data || response,
        message: 'Produto atualizado com sucesso',
      };
    } catch (error) {
      console.error('[ProdutoService.atualizar] Erro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao atualizar produto',
        error,
      };
    }
  }

  /**
   * Deleta produto
   */
  async deletar(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.PRODUTOS.DELETE.replace(':id', id);
      const response = await APIService.delete(endpoint);
      console.log('[ProdutoService.deletar] Response:', response);
      return {
        success: true,
        message: 'Produto deletado com sucesso',
      };
    } catch (error) {
      console.error('[ProdutoService.deletar] Erro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao deletar produto',
        error,
      };
    }
  }

  /**
   * Lista produtos por categoria
   */
  async listarPorCategoria(categoria, filtros = {}) {
    try {
      const endpoint = APIConfig.ENDPOINTS.PRODUTOS.BY_CATEGORIA.replace(':categoria', categoria);
      const response = await APIService.get(endpoint, filtros);
      console.log('[ProdutoService.listarPorCategoria] Response:', response);
      
      let produtos = Array.isArray(response) ? response : 
                     response.data && Array.isArray(response.data) ? response.data :
                     response.content && Array.isArray(response.content) ? response.content :
                     [];
      
      return {
        success: true,
        data: produtos,
      };
    } catch (error) {
      console.error('[ProdutoService.listarPorCategoria] Erro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao listar produtos por categoria',
        error,
      };
    }
  }

  /**
   * Lista produtos por mercado
   */
  async listarPorMercado(mercadoId, filtros = {}) {
    try {
      const endpoint = APIConfig.ENDPOINTS.PRODUTOS.BY_MERCADO.replace(':mercadoId', mercadoId);
      const response = await APIService.get(endpoint, filtros);
      console.log('[ProdutoService.listarPorMercado] Response:', response);
      
      let produtos = Array.isArray(response) ? response : 
                     response.data && Array.isArray(response.data) ? response.data :
                     response.content && Array.isArray(response.content) ? response.content :
                     [];
      
      return {
        success: true,
        data: produtos,
      };
    } catch (error) {
      console.error('[ProdutoService.listarPorMercado] Erro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao listar produtos',
        error,
      };
    }
  }

  /**
   * Lista produtos por fornecedor
   */
  async listarPorFornecedor(fornecedorId, filtros = {}) {
    try {
      const endpoint = APIConfig.ENDPOINTS.PRODUTOS.BY_FORNECEDOR.replace(':fornecedorId', fornecedorId);
      const response = await APIService.get(endpoint, filtros);
      console.log('[ProdutoService.listarPorFornecedor] Response:', response);
      
      let produtos = Array.isArray(response) ? response : 
                     response.data && Array.isArray(response.data) ? response.data :
                     response.content && Array.isArray(response.content) ? response.content :
                     [];
      
      return {
        success: true,
        data: produtos,
      };
    } catch (error) {
      console.error('[ProdutoService.listarPorFornecedor] Erro:', error);
      return {
        success: false,
        message: error.message || 'Erro ao listar produtos',
        error,
      };
    }
  }
}

export default new ProdutoService();
