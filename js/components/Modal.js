/**
  * Componente Modal
  * Modal flexível e reutilizável
 */

class Modal {
    constructor(options = {}) {
      this.id = options.id || `modal-${Date.now()}`;
      this.title = options.title || 'Modal';
      this.content = options.content || '';
      this.buttons = options.buttons || [
        { text: 'Fechar', class: 'btn-secondary', onClick: () => this.close() },
      ];
      this.size = options.size || 'md';
      this.onClose = options.onClose || null;
      this.modal = null;
    }
  
    render() {
      const sizeClass = { sm: 'modal-sm', md: 'modal-md', lg: 'modal-lg', xl: 'modal-xl' }[this.size] || 'modal-md';
  
      this.modal = document.createElement('div');
      this.modal.id = this.id;
      this.modal.className = `modal modal-backdrop`;
      this.modal.innerHTML = `
        <div class="modal-content ${sizeClass}">
          <div class="modal-header">
            <h2>${this.title}</h2>
            <button class="modal-close" aria-label="Fechar">&times;</button>
          </div>
          <div class="modal-body">
            ${this.content}
          </div>
          <div class="modal-footer">
            ${this.buttons.map(btn => `
              <button class="btn ${btn.class || 'btn-primary'}" data-action="${btn.text}">
                ${btn.text}
              </button>
            `).join('')}
          </div>
        </div>
      `;
  
      return this.modal;
    }
  
    open() {
      if (!this.modal) {
        document.body.appendChild(this.render());
      }
  
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
  
      this.modal.querySelector('.modal-close').addEventListener('click', () => this.close());
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
  
      this.buttons.forEach((btn) => {
        const btnElement = this.modal.querySelector(`[data-action="${btn.text}"]`);
        if (btnElement && btn.onClick) {
          btnElement.addEventListener('click', (e) => {
            e.preventDefault();
            btn.onClick();
          });
        }
      });
    }
  
    close() {
      if (this.modal) {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
          this.modal.remove();
          this.modal = null;
          if (this.onClose) this.onClose();
        }, 300);
      }
    }
  
    setContent(content) {
      this.content = content;
      if (this.modal) {
        this.modal.querySelector('.modal-body').innerHTML = content;
      }
    }
  
    setTitle(title) {
      this.title = title;
      if (this.modal) {
        this.modal.querySelector('.modal-header h2').textContent = title;
      }
    }
  
    destroy() {
      if (this.modal) {
        this.modal.remove();
        this.modal = null;
      }
    }
  }
  
  export default Modal;