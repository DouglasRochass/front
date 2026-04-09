/**
 * Sistema de Notificações (Toast)
 * Exibe mensagens temporárias de sucesso, erro, aviso, etc
 */

class Toast {
  static container = null;

  static init() {
    if (!Toast.container) {
      Toast.container = document.createElement('div');
      Toast.container.id = 'toast-container';
      Toast.container.className = 'toast-container';
      document.body.appendChild(Toast.container);
    }
  }

  static create(message, type = 'info', duration = 4000) {
    Toast.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${Toast.getIcon(type)}</span>
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" aria-label="Fechar">&times;</button>
    `;

    Toast.container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());

    // Auto remove
    if (duration) {
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  static success(message, duration = 4000) {
    return Toast.create(message, 'success', duration);
  }

  static error(message, duration = 5000) {
    return Toast.create(message, 'error', duration);
  }

  static warning(message, duration = 4000) {
    return Toast.create(message, 'warning', duration);
  }

  static info(message, duration = 4000) {
    return Toast.create(message, 'info', duration);
  }

  static loading(message) {
    return Toast.create(message, 'loading', 0);
  }

  static getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
      loading: '⟳',
    };
    return icons[type] || '';
  }
}

export default Toast;
