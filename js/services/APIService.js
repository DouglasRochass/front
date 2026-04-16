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

  getStoredToken() {
    return localStorage.getItem('access_token') || null;
  }

  getStoredRefreshToken() {
    return localStorage.getItem('refresh_token') || null;
  }

  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  getHeaders(customHeaders = {}) {
    const headers = { ...APIConfig.HEADERS, ...customHeaders };

    const currentToken = localStorage.getItem('access_token');
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
      console.log(`[APIService] Token adicionado ao header: ${currentToken.substring(0, 20)}...`);
    } else {
      console.warn('[APIService] ⚠️ Nenhum token encontrado no localStorage');
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.cargo) {
      headers['gerente-cargo'] = user.cargo;
    }
    if (user.mercadoId) {
      headers['usuario-mercado-id'] = user.mercadoId;
    }

    return headers;
  }

  async request(method, url, data = null, customHeaders = {}) {
    const options = {
      method,
      headers: this.getHeaders(customHeaders),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      console.log(`[APIService] ${method} ${url}`);
      const response = await fetch(url, options);

      console.log(`[APIService] Response Status: ${response.status} ${response.statusText}`);

      if (response.status === 401 && this.refreshToken && !this.isRefreshing) {
        console.warn('[APIService] Token expirado, tentando renovar...');
        return this.handleTokenRefresh(method, url, data, customHeaders);
      }

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error(`[APIService] Erro na requisição:`, { status: response.status, result });
        throw {
          status: response.status,
          message: result.message || result.error || 'Erro na requisição',
          data: result,
        };
      }

      console.log(`[API ${method}] ${url}`, { sucesso: true, dados: result.data?.length || 'N/A' });

      return result;
    } catch (error) {
      console.error('Erro na requisição:', { url, method, error });
      throw error;
    }
  }

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

        const retryResult = await this.request(method, url, data, customHeaders);

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
      window.location.href = './tela_login.html';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  get(endpoint, params = {}) {
    let url = `${APIConfig.BASE_URL}${endpoint}`;
    const queryString = new URLSearchParams(params).toString();
    if (queryString) url += `?${queryString}`;
    return this.request('GET', url);
  }

  post(endpoint, data) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('POST', url, data);
  }

  put(endpoint, data) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('PUT', url, data);
  }

  patch(endpoint, data) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('PATCH', url, data);
  }

  delete(endpoint) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    return this.request('DELETE', url);
  }

  async upload(endpoint, formData) {
    const url = `${APIConfig.BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders() };
    delete headers['Content-Type'];

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

export default new APIService();