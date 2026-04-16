/**
  * Serviço de Funcionários
 */

import APIService from './APIService.js';
import APIConfig from '../config/APIConfig.js';

class FuncionarioService {
  async listar(filtros = {}) {
    try {
      const response = await APIService.get(APIConfig.ENDPOINTS.FUNCIONARIOS.LIST, filtros);
      console.log('[FuncionarioService.listar] Response:', response);

      let funcionarios = Array.isArray(response) ? response :
                        response.data && Array.isArray(response.data) ? response.data :
                        response.content && Array.isArray(response.content) ? response.content :
                        [];

      return { success: true, data: funcionarios };
    } catch (error) {
      console.error('[FuncionarioService.listar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao listar funcionários', error };
    }
  }

  async obter(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FUNCIONARIOS.GET.replace(':id', id);
      const response = await APIService.get(endpoint);
      console.log('[FuncionarioService.obter] Response:', response);
      const funcionario = response.data || response;
      return { success: true, data: funcionario };
    } catch (error) {
      console.error('[FuncionarioService.obter] Erro:', error);
      return { success: false, message: error.message || 'Funcionário não encontrado', error };
    }
  }

  async criar(data) {
    try {
      const response = await APIService.post(APIConfig.ENDPOINTS.FUNCIONARIOS.CREATE, data);
      console.log('[FuncionarioService.criar] Response:', response);
      return { success: true, data: response.data || response, message: 'Funcionário criado com sucesso' };
    } catch (error) {
      console.error('[FuncionarioService.criar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao criar funcionário', error };
    }
  }

  async atualizar(id, data) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FUNCIONARIOS.UPDATE.replace(':id', id);
      const response = await APIService.put(endpoint, data);
      console.log('[FuncionarioService.atualizar] Response:', response);
      return { success: true, data: response.data || response, message: 'Funcionário atualizado com sucesso' };
    } catch (error) {
      console.error('[FuncionarioService.atualizar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao atualizar', error };
    }
  }

  async deletar(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FUNCIONARIOS.DELETE.replace(':id', id);
      const response = await APIService.delete(endpoint);
      console.log('[FuncionarioService.deletar] Response:', response);
      return { success: true, message: 'Funcionário deletado com sucesso' };
    } catch (error) {
      console.error('[FuncionarioService.deletar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao deletar', error };
    }
  }

  async listarPorMercado(mercadoId, filtros = {}) {
    try {
      const endpoint = APIConfig.ENDPOINTS.FUNCIONARIOS.BY_MERCADO.replace(':mercadoId', mercadoId);
      const response = await APIService.get(endpoint, filtros);
      let funcionarios = Array.isArray(response) ? response :
                        response.data && Array.isArray(response.data) ? response.data :
                        response.content && Array.isArray(response.content) ? response.content : [];
      return { success: true, data: funcionarios };
    } catch (error) {
      console.error('[FuncionarioService.listarPorMercado] Erro:', error);
      return { success: false, message: error.message || 'Erro ao listar', error };
    }
  }
}

export default new FuncionarioService();