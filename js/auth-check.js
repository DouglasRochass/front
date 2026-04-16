/**
 * Script de verificação de autenticação
 * Deve ser colocado no <head> ou no início do <body> para evitar flash de conteúdo
 */

(function() {
  const currentPath = window.location.pathname;

  // Páginas que NÃO precisam de autenticação
  const publicPages = [
    'tela_login',
    'recuperar',
    'redefinir',
    'verificar',
    'senha_atualizada'
  ];

  const isPublicPage = publicPages.some(page => currentPath.includes(page));

  const token = localStorage.getItem('access_token');
  const hasToken = !!token && token.trim() !== '';

  console.log('[Auth Check]', {
    currentPath,
    isPublicPage,
    hasToken,
    tokenValue: token ? token.substring(0, 20) + '...' : 'none'
  });

  // Se está em página pública e já tem token, redirecionar para dashboard
  if (isPublicPage && hasToken) {
    console.log('[Auth Check] Usuário autenticado em página pública, redirecionando para dashboard...');
    setTimeout(() => { window.location.href = '/'; }, 100);
    return;
  }

  // Se está em página protegida e não tem token, redirecionar para login
  if (!isPublicPage && !hasToken) {
    console.log('[Auth Check] Usuário não autenticado, redirecionando para login...');
    setTimeout(() => { window.location.href = '/login'; }, 100);
    return;
  }

  console.log('[Auth Check] ✓ Verificação passou');
})();
