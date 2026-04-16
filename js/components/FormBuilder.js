/**
  * Componente FormBuilder
  * Constrói formulários dinâmicos a partir de configuração
 */

class FormBuilder {
    constructor(options = {}) {
      this.formId = options.formId || `form-${Date.now()}`;
      this.fields = options.fields || [];
      this.title = options.title || '';
      this.onSubmit = options.onSubmit || null;
      this.submitText = options.submitText || 'Enviar';
      this.loading = false;
    }
  
    render(container) {
      const containerElement = typeof container === 'string'
        ? document.getElementById(container)
        : container;
  
      let html = `<form id="${this.formId}" class="form-builder">`;
  
      if (this.title) {
        html += `<h2 class="form-title">${this.title}</h2>`;
      }
  
      for (const field of this.fields) {
        html += this.renderField(field);
      }
  
      html += `
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="submit-btn">
            ${this.submitText}
          </button>
          <button type="reset" class="btn btn-secondary">Limpar</button>
        </div>
      </form>`;
  
      containerElement.innerHTML = html;
      this.setupEventListeners(containerElement);
    }
  
    renderField(field) {
      let html = '';
  
      if (field.type === 'hidden') {
        return `<input type="hidden" name="${field.name}" value="${field.value || ''}">`;
      }
  
      html += `
        <div class="form-group">
          ${field.label ? `<label for="${field.name}">${field.label}${field.required ? '*' : ''}</label>` : ''}
      `;
  
      const attributes = this.buildAttributes(field);
  
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'date':
        case 'tel':
        case 'url':
          html += `<input type="${field.type}" name="${field.name}" ${attributes} />`;
          break;
  
        case 'textarea': {
          const textareaAttrs = this.buildAttributes({ ...field, value: undefined });
          html += `<textarea name="${field.name}" ${textareaAttrs}>${field.value || ''}</textarea>`;
          break;
        }
  
        case 'select':
          html += `
            <select name="${field.name}" ${attributes}>
              <option value="">Selecione uma opção</option>
              ${(field.options || []).map(opt => `
                <option value="${opt.value}" ${field.value === opt.value ? 'selected' : ''}>${opt.label}</option>
              `).join('')}
            </select>
          `;
          break;
  
        case 'checkbox':
          html += `
            <div class="checkbox-group">
              ${(field.options || []).map(opt => `
                <label class="checkbox-label">
                  <input type="checkbox" name="${field.name}" value="${opt.value}" />
                  ${opt.label}
                </label>
              `).join('')}
            </div>
          `;
          break;
  
        case 'radio':
          html += `
            <div class="radio-group">
              ${(field.options || []).map(opt => `
                <label class="radio-label">
                  <input type="radio" name="${field.name}" value="${opt.value}" />
                  ${opt.label}
                </label>
              `).join('')}
            </div>
          `;
          break;
      }
  
      if (field.error) {
        html += `<span class="error-message">${field.error}</span>`;
      }
  
      if (field.help) {
        html += `<small class="help-text">${field.help}</small>`;
      }
  
      html += '</div>';
      return html;
    }
  
    buildAttributes(field) {
      const attrs = [];
  
      if (field.id) attrs.push(`id="${field.id}"`);
      if (field.placeholder) attrs.push(`placeholder="${field.placeholder}"`);
      if (field.required) attrs.push('required');
      if (field.readonly) attrs.push('readonly');
      if (field.disabled) attrs.push('disabled');
      if (field.min !== undefined) attrs.push(`min="${field.min}"`);
      if (field.max !== undefined) attrs.push(`max="${field.max}"`);
      if (field.pattern) attrs.push(`pattern="${field.pattern}"`);
      if (field.value && field.type !== 'select') attrs.push(`value="${field.value}"`);
      if (field.class) attrs.push(`class="${field.class}"`);
  
      return attrs.join(' ');
    }
  
    setupEventListeners(container) {
      const form = container.querySelector(`#${this.formId}`);
  
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        if (this.loading) return;
        this.loading = true;
  
        const submitBtn = form.querySelector('#submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
  
        try {
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
  
          if (this.onSubmit) {
            await this.onSubmit(data);
          }
        } catch (error) {
          console.error('Erro ao enviar formulário:', error);
        } finally {
          this.loading = false;
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
    }
  
    getValues() {
      const form = document.getElementById(this.formId);
      if (!form) return {};
      const formData = new FormData(form);
      return Object.fromEntries(formData);
    }
  
    setValues(data) {
      const form = document.getElementById(this.formId);
      if (!form) return;
      for (const [key, value] of Object.entries(data)) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = value;
      }
    }
  
    validate() {
      const form = document.getElementById(this.formId);
      if (!form) return false;
      return form.checkValidity();
    }
  
    reset() {
      const form = document.getElementById(this.formId);
      if (form) form.reset();
    }
  }
  
  export default FormBuilder;