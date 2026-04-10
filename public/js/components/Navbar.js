/**
 * Componente Navbar (Barra de Navegação)
 * Barra superior compartilhada em todas as páginas
 */

import AuthService from '../services/AuthService.js';

class Navbar {
  constructor() {
    this.user = AuthService.getCurrentUser();
  }

  render(containerId = 'navbar') {
    const container = document.getElementById(containerId) || document.body;
    const userDisplay = this.user ? `${this.user.nome} (${this.user.cargo})` : 'Visitante';

    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
      <div class="navbar-container">
        <div class="navbar-brand">
          <img src="/logo.png" alt="SmartStock" class="navbar-logo">
          <span class="navbar-title">SmartStock</span>
        </div>

        <div class="navbar-menu">
          <a href="/dashboard.html" class="nav-link">Dashboard</a>
          <a href="/produtos.html" class="nav-link">Produtos</a>
          <a href="/fornecedores.html" class="nav-link">Fornecedores</a>
          <a href="/funcionarios.html" class="nav-link">Funcionários</a>
          <a href="/mercados.html" class="nav-link">Mercados</a>
          <a href="/vendas.html" class="nav-link">Vendas</a>
          <a href="/relatorios.html" class="nav-link">Relatórios</a>
        </div>

        <div class="navbar-end">
          <div class="user-menu">
            <span class="user-name">${userDisplay}</span>
            <div class="dropdown">
              <button class="dropdown-toggle">⋮</button>
              <ul class="dropdown-menu">
                <li><a href="/perfil.html">Meu Perfil</a></li>
                <li><a href="/configuracoes.html">Configurações</a></li>
                <li class="divider"></li>
                <li><button id="logout-btn" class="logout-btn">Sair</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    if (containerId === 'navbar') {
      container.insertBefore(navbar, container.firstChild);
    } else {
      container.appendChild(navbar);
    }

    this.setupEventListeners(navbar);
  }

  setupEventListeners(navbar) {
    // Dropdown menu
    const dropdownToggle = navbar.querySelector('.dropdown-toggle');
    const dropdownMenu = navbar.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
      });
    }

    // Logout
    const logoutBtn = navbar.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await AuthService.logout();
        window.location.href = '/login.html';
      });
    }
  }
}

export default Navbar;
