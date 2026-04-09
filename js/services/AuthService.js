/**
 * Serviço de Autenticação
 * Gerencia login, logout e status de autenticação
 */

import APIService from './APIService.js';
import APIConfig from '../config/APIConfig.js';

class AuthService {
  constructor() {
    this.user = this.getStoredUser();
  }

  /**
   * Obtém usuário armazenado
   */
  getStoredUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Salva usuário no armazenamento
   */
  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Remove usuário do armazenamento
   */
  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated() {
    return !!this.user && !!APIService.token;
  }

  /**
   * Obtém usuário atual
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Realiza login
   */
  async login(email, senha) {
    try {
      const response = await APIService.post(APIConfig.ENDPOINTS.AUTH.LOGIN, {
        email,
        senha,
      });

      if (response.token) {
        APIService.setTokens(response.token, response.refreshToken);
        this.setUser({
          id: response.usuarioId,
          email: response.email,
          nome: response.nome,
          cargo: response.cargo,
          mercadoId: response.mercadoId,
        });

        return {
          success: true,
          user: this.user,
          message: 'Login realizado com sucesso!',
        };
      } else {
        throw new Error(response.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.message || 'Falha na autenticação',
        error,
      };
    }
  }

  /**
   * Realiza logout
   */
  async logout() {
    try {
      await APIService.post(APIConfig.ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      APIService.clearTokens();
      this.clearUser();
    }
  }

  /**
   * Recupera senha (primeira etapa)
   */
  async recuperarSenha(email) {
    try {
      const response = await APIService.post(APIConfig.ENDPOINTS.USUARIOS.RECUPERAR_SENHA, {
        email,
      });

      return {
        success: true,
        message: response.message || 'Email de recuperação enviado',
      };
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      return {
        success: false,
        message: error.message || 'Erro ao recuperar senha',
        error,
      };
    }
  }

  /**
   * Redefine senha
   */
  async redefinirSenha(token, novaSenha, confirmaSenha) {
    if (novaSenha !== confirmaSenha) {
      return {
        success: false,
        message: 'Senhas não conferem',
      };
    }

    try {
      const endpoint = APIConfig.ENDPOINTS.USUARIOS.REDEFINIR_SENHA.replace(':token', token);
      const response = await APIService.post(endpoint, {
        novaSenha,
        confirmaSenha,
      });

      return {
        success: true,
        message: response.message || 'Senha redefinida com sucesso',
      };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return {
        success: false,
        message: error.message || 'Erro ao redefinir senha',
        error,
      };
    }
  }

  /**
   * Verifica se usuário é gestor
   */
  isGestor() {
    return this.user?.cargo === 'GERENTE' || this.user?.cargo === 'MASTER';
  }

  /**
   * Verifica se usuário é master
   */
  isMaster() {
    return this.user?.cargo === 'MASTER';
  }
}

// Exporta instância única (Singleton)
export default new AuthService();
