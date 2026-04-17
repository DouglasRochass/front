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

  getStoredUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getCurrentUser() {
    return this.user;
  }

  async login(email, senha) {
    try {
      const response = await APIService.post(APIConfig.ENDPOINTS.AUTH.LOGIN, {
        email,
        senha,
      });

      if (response.token) {
        APIService.setTokens(response.token, response.refreshToken);
        this.setUser({
          usuarioId: response.usuarioId,
          email: response.email,
          nomeColaborador: response.nome,
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

  isGestor() {
    return this.user?.cargo === 'GERENTE' || this.user?.cargo === 'MASTER';
  }

  isMaster() {
    return this.user?.cargo === 'MASTER';
  }
}

export default new AuthService();