/**
  * Serviço de Fornecedores
 */

import APIService from './APIService.js';
import APIConfig from '../config/APIConfig.js';

class FornecedorService {
  async listar(filtros = {}) {
    try {
      const response = await APIService.get(APIConfig.ENDPOINTS.FORNECEDORES.LIST, filtros);
      console.log('[FornecedorService.listar] Response completo:', response);
      console.log('[FornecedorService.listar] Tipo:', typeof response);
      console.log('[FornecedorService.listar] É Array?', Array.isArray(response));

      let fornecedores = Array.isArray(response) ? response :
                        response.data && Array.isArray(response.data) ? response.data :
                        response.content && Array.isArray(response.content) ? response.content :
                        [];

      return { success: true, data: fornecedores };
    } catch (error) {
      console.error('[FornecedorService.listar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao listar fornecedores', error };
    }
  }

  async obter(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FORNECEDORES.GET.replace(':id', id);
      const response = await APIService.get(endpoint);
      console.log('[FornecedorService.obter] Response:', response);
      const fornecedor = response.data || response;
      return { success: true, data: fornecedor };
    } catch (error) {
      console.error('[FornecedorService.obter] Erro:', error);
      return { success: false, message: error.message || 'Fornecedor não encontrado', error };
    }
  }

  async criar(data) {
    try {
      const response = await APIService.post(APIConfig.ENDPOINTS.FORNECEDORES.CREATE, data);
      console.log('[FornecedorService.criar] Response:', response);
      return { success: true, data: response.data || response, message: 'Fornecedor criado com sucesso' };
    } catch (error) {
      console.error('[FornecedorService.criar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao criar fornecedor', error };
    }
  }

  async atualizar(id, data) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FORNECEDORES.UPDATE.replace(':id', id);
      const response = await APIService.put(endpoint, data);
      console.log('[FornecedorService.atualizar] Response:', response);
      return { success: true, data: response.data || response, message: 'Fornecedor atualizado com sucesso' };
    } catch (error) {
      console.error('[FornecedorService.atualizar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao atualizar fornecedor', error };
    }
  }

  async deletar(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FORNECEDORES.DELETE.replace(':id', id);
      const response = await APIService.delete(endpoint);
      console.log('[FornecedorService.deletar] Response:', response);
      return { success: true, message: 'Fornecedor deletado com sucesso' };
    } catch (error) {
      console.error('[FornecedorService.deletar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao deletar fornecedor', error };
    }
  }

  async buscarPorNome(nome, filtros = {}) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FORNECEDORES.BY_NOME.replace(':nome', nome);
      const response = await APIService.get(endpoint, filtros);
      let fornecedores = Array.isArray(response) ? response :
                        response.data && Array.isArray(response.data) ? response.data :
                        response.content && Array.isArray(response.content) ? response.content : [];
      return { success: true, data: fornecedores };
    } catch (error) {
      console.error('[FornecedorService.buscarPorNome] Erro:', error);
      return { success: false, message: error.message || 'Erro ao buscar fornecedor', error };
    }
  }

  async buscarPorEmail(email, filtros = {}) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FORNECEDORES.BY_EMAIL.replace(':email', email);
      const response = await APIService.get(endpoint, filtros);
      let fornecedores = Array.isArray(response) ? response :
                        response.data && Array.isArray(response.data) ? response.data :
                        response.content && Array.isArray(response.content) ? response.content : [];
      return { success: true, data: fornecedores };
    } catch (error) {
      console.error('[FornecedorService.buscarPorEmail] Erro:', error);
      return { success: false, message: error.message || 'Erro ao buscar fornecedor', error };
    }
  }
}

export default new FornecedorService();