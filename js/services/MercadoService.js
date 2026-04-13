/**
 * Serviço de Mercados
 */

import APIService from './APIService.js';
import APIConfig from '../config/APIConfig.js';

class MercadoService {
  async listar(filtros = {}) {
    try {
      const response = await APIService.get(APIConfig.ENDPOINTS.MERCADOS.LIST, filtros);
      console.log('[MercadoService.listar] Response completo:', response);
      console.log('[MercadoService.listar] Tipo:', typeof response);
      console.log('[MercadoService.listar] É Array?', Array.isArray(response));
      
      let mercados = Array.isArray(response) ? response : 
                    response.data && Array.isArray(response.data) ? response.data :
                    response.content && Array.isArray(response.content) ? response.content :
                    [];
      
      return { success: true, data: mercados };
    } catch (error) {
      console.error('[MercadoService.listar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao listar mercados', error };
    }
  }

  async obter(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.MERCADOS.GET.replace(':id', id);
      const response = await APIService.get(endpoint);
      console.log('[MercadoService.obter] Response:', response);
      
      const mercado = response.data || response;
      return { success: true, data: mercado };
    } catch (error) {
      console.error('[MercadoService.obter] Erro:', error);
      return { success: false, message: error.message || 'Mercado não encontrado', error };
    }
  }

  async criar(data) {
    try {
      const response = await APIService.post(APIConfig.ENDPOINTS.MERCADOS.CREATE, data);
      console.log('[MercadoService.criar] Response:', response);
      return { success: true, data: response.data || response, message: 'Mercado criado com sucesso' };
    } catch (error) {
      console.error('[MercadoService.criar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao criar mercado', error };
    }
  }

  async atualizar(id, data) {
    try {
      const endpoint = APIConfig.ENDPOINTS.MERCADOS.UPDATE.replace(':id', id);
      const response = await APIService.put(endpoint, data);
      console.log('[MercadoService.atualizar] Response:', response);
      return { success: true, data: response.data || response, message: 'Mercado atualizado com sucesso' };
    } catch (error) {
      console.error('[MercadoService.atualizar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao atualizar', error };
    }
  }

  async deletar(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.MERCADOS.DELETE.replace(':id', id);
      const response = await APIService.delete(endpoint);
      console.log('[MercadoService.deletar] Response:', response);
      return { success: true, message: 'Mercado deletado com sucesso' };
    } catch (error) {
      console.error('[MercadoService.deletar] Erro:', error);
      return { success: false, message: error.message || 'Erro ao deletar', error };
    }
  }
}

export default new MercadoService();
