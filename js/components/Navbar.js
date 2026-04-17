/**
  * Componente Navbar (Sidebar lateral recolhível)
  * Sidebar fixa à esquerda, expande ao passar o mouse
 */

import AuthService from '../services/AuthService.js';

class Navbar {
  constructor() {
    this.user = AuthService.getCurrentUser();
    console.log('[Navbar] Usuário carregado:', this.user);
    this._injectFontAwesome();
  }

  _injectFontAwesome() {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      document.head.appendChild(link);
      console.log('[Navbar] Font Awesome injetado');
    }
  }

  _getCurrentPage() {
    return window.location.pathname.split('/').pop() || '';
  }

  _navLink(href, icon, label) {
    const current = this._getCurrentPage();
    // Remove .html para comparação
    const hrefClean = href.replace('.html', '').replace('./', '').replace('/', '');
    const currentClean = current.replace('.html', '').replace('/', '');
    const active = currentClean === hrefClean ? 'active' : '';
    // Usar caminho relativo para páginas
    const linkHref = `./pages/${href.replace('.html', '')}.html`.replace('.html.html', '.html');
    console.log(`[Navbar Link] ${label}: href="${linkHref}", current="${current}", active="${active}"`);
    return `
      <a href="${linkHref}" class="sidebar-link ${active}">
        <span class="sidebar-icon"><i class="${icon}"></i></span>
        <span class="sidebar-label">${label}</span>
      </a>
    `;
  }

  render(containerId = 'navbar') {
    const container = document.getElementById(containerId);
    console.log('[Navbar] Container encontrado:', !!container, containerId);
    if (!container) {
      console.error('[Navbar] Container não encontrado:', containerId);
      return;
    }

    const userDisplay = this.user
      ? `<span class="sidebar-user-name">${this.user.nome}</span><span class="sidebar-user-role">${this.user.cargo || ''}</span>`
      : `<span class="sidebar-user-name">Visitante</span>`;

    container.className = 'sidebar';
    container.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="sidebar-brand">SmartStock</span>
      </div>

      <nav class="sidebar-nav">
        ${this._navLink('dashboard', 'fas fa-chart-pie', 'Dashboard')}
        ${this._navLink('produtos', 'fas fa-box', 'Produtos')}
        ${this._navLink('fornecedores', 'fas fa-truck', 'Fornecedores')}
        ${this._navLink('funcionarios', 'fas fa-users', 'Funcionários')}
        ${this._navLink('mercados', 'fas fa-store', 'Mercados')}
        ${this._navLink('vendas', 'fas fa-shopping-cart', 'Vendas')}
        ${this._navLink('analises', 'fas fa-chart-line', 'Análises')}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <span class="sidebar-icon"><i class="fas fa-user-circle"></i></span>
          <div class="sidebar-user-info">${userDisplay}</div>
        </div>
        <button class="sidebar-logout" id="logout-btn">
          <span class="sidebar-icon"><i class="fas fa-sign-out-alt"></i></span>
          <span class="sidebar-label">Sair</span>
        </button>
      </div>
    `;

    console.log('[Navbar] Sidebar renderizada com sucesso');
    document.body.classList.add('has-sidebar');

    this.setupEventListeners(container);

    const hamburger = container.querySelector('.sidebar-hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        container.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
      });
    }
  }

  setupEventListeners(sidebar) {
    const logoutBtn = sidebar.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await AuthService.logout();
        window.location.href = './pages/tela_login.html';
      });
    }
  }
}

export default Navbar;