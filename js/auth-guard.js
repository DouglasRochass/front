/**
 * Guard de Autenticação usando AuthService
 * Importar este módulo nas páginas protegidas
 */

import AuthService from './services/AuthService.js';

class AuthGuard {
  static checkAuthentication() {
    if (!AuthService.isAuthenticated()) {
      console.warn('[AuthGuard] Usuário não autenticado, redirecionando para login...');
      window.location.href = '/login';
      return false;
    }
    console.log('[AuthGuard] ✓ Usuário autenticado');
    return true;
  }

  static checkAuthenticationFromLogin() {
    if (AuthService.isAuthenticated()) {
      console.log('[AuthGuard] Usuário já autenticado, redirecionando para dashboard...');
      window.location.href = '/';
      return false;
    }
    console.log('[AuthGuard] ✓ Usuário não autenticado (esperado na página de login)');
    return true;
  }
}

export default AuthGuard;
