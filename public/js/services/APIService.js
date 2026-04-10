/**
 * Serviço principal para consumo de API
 * Gerencia requisições HTTP, tokens e tratamento de erros
 */

import APIConfig from '../config/APIConfig.js';

class APIService {
  constructor() {
    this.token = this.getStoredToken();
    this.refreshToken = this.getStoredRefreshToken();
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  /**
   * Obtém token armazenado
   */
  getStoredToken() {
    return localStorage.getItem('access_token') || null;
  }

  /**
   * Obtém refresh token armazenado
   */
  getStoredRefreshToken() {
    return localStorage.getItem('refresh_token') || null;
  }

  /**
   * Salva tokens no localStorage
   */
  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  /**
   * Remove tokens do armazenamento
   */
  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Prepara headers para requisição
   */
  getHeaders(customHeaders = {}) {
    const headers = { ...APIConfig.HEADERS, ...customHeaders };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Adiciona headers customizados do usuário
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.cargo) {
      headers['gerente-cargo'] = user.cargo;
    }
    if (user.mercadoId) {
      headers['usuario-mercado-id'] = user.mercadoId;
    }
    
    return headers;
  }

  /**
   * Faz requisição HTTP genérica
   */
  async request(method, url, data = null, customHeaders = {}) {
    const options = {
      method,
      headers: this.getHeaders(customHeaders),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      // Trata token expirado
      if (response.status === 401 && this.refreshToken && !this.isRefreshing) {
        return this.handleTokenRefresh(method, url, data, customHeaders);
      }

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw {
          status: response.status,
          message: result.message || result.error || 'Erro na requisição',
          data: result,
        };
      }

      // Log para debug
      console.log(`[API ${method}] ${url}`, { result });

      return result;
    } catch (error) {
      console.error('Erro na requisição:', { url, method, error });
      throw error;
    }
  }

  /**
   * Trata renovação de token
   */
  async handleTokenRefresh(method, url, data, customHeaders) {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshSubscribers.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshUrl = `${APIConfig.BASE_URL}${APIConfig.ENDPOINTS.AUTH.REFRESH}`;
      const refreshResult = await fetch(refreshUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      }).then(r => r.json());

      if (refreshResult.token) {
        this.setTokens(refreshResult.token, refreshResult.refreshToken);
        
        // Retenta requisição original
        const retryResult = await this.request(method, url, data, customHeaders);
        
        // Notifica subscribers
        this.refreshSubscribers.forEach(sub => sub.resolve(retryResult));
        this.refreshSubscribers = [];
        
        return retryResult;
      } else {
        throw new Error('Falha ao renovar token');
      }
    } catch (error) {
      this.clearTokens();
      this.refreshSubscribers.forEach(sub => sub.reject(error));
      this.refreshSubscribers = [];
      window.location.href = '/login.html';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // ========== GET ==========
  get(endpoint, params = {}) {
    let url = `${APIConfig.BASE_URL}${endpoint}`;
    const queryString = new URLSearchParams(params).toString();
    if (queryString) url += `?${queryString}`;
    return this.request('GET', url);
  }

  // ========== POST ==========
  post(endpoint, data) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('POST', url, data);
  }

  // ========== PUT ==========
  put(endpoint, data) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('PUT', url, data);
  }

  // ========== PATCH ==========
  patch(endpoint, data) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('PATCH', url, data);
  }

  // ========== DELETE ==========
  delete(endpoint) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('DELETE', url);
  }

  // ========== UPLOAD (FormData) ==========
  async upload(endpoint, formData) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders() };
    delete headers['Content-Type']; // Remove para deixar o navegador definir

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      return await response.json();
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  }
}

// Exporta instância única (Singleton)
export default new APIService();
