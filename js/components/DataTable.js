/**
  * Componente de Tabela
  * Tabela dinâmica com paginação, filtros e ações
 */

class DataTable {
    constructor(options = {}) {
      this.containerId = options.containerId;
      this.columns = options.columns || [];
      this.data = options.data || [];
      this.onEdit = options.onEdit || null;
      this.onDelete = options.onDelete || null;
      this.onView = options.onView || null;
      this.pageSize = options.pageSize || 10;
      this.currentPage = 1;
      this.searchTerm = '';
      this.idField = options.idField || 'id';
    }
  
    render() {
      const container = document.getElementById(this.containerId);
      if (!container) return;
  
      const filteredData = this.filterData();
      const paginatedData = this.paginateData(filteredData);
  
      let html = `
        <div class="data-table-wrapper">
          <div class="table-controls">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar..."
              id="search-${this.containerId}">
          </div>
  
          <table class="data-table">
            <thead>
              <tr>
                ${this.columns.map(col => `<th>${col.label}</th>`).join('')}
                ${this.onEdit || this.onDelete || this.onView ? '<th>Ações</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${paginatedData.map(row => this.renderRow(row)).join('')}
            </tbody>
          </table>
  
          ${this.renderPagination(filteredData.length)}
        </div>
      `;
  
      container.innerHTML = html;
  
      const searchInput = container.querySelector(`#search-${this.containerId}`);
      if (searchInput) {
        searchInput.value = this.searchTerm;
        searchInput.addEventListener('input', (e) => {
          this.searchTerm = e.target.value.toLowerCase();
          this.currentPage = 1;
          this.render();
        });
      }
  
      this.addActionListeners();
    }
  
    renderRow(row) {
      let html = '';
      const rowId = this.getNestedValue(row, this.idField);
  
      for (const col of this.columns) {
        const value = this.getNestedValue(row, col.field);
        html += `<td>${col.format ? col.format(value, row) : value}</td>`;
      }
  
      if (this.onEdit || this.onDelete || this.onView) {
        html += '<td class="actions">';
        if (this.onView) html += `<button class="btn-icon btn-view" title="Visualizar" data-id="${rowId}">👁</button>`;
        if (this.onEdit) html += `<button class="btn-icon btn-edit" title="Editar" data-id="${rowId}">✎</button>`;
        if (this.onDelete) html += `<button class="btn-icon btn-delete" title="Deletar" data-id="${rowId}">🗑</button>`;
        html += '</td>';
      }
  
      return `<tr data-id="${rowId}">${html}</tr>`;
    }
  
    renderPagination(totalItems) {
      const totalPages = Math.ceil(totalItems / this.pageSize);
      if (totalPages <= 1) return '';
  
      let html = '<div class="pagination">';
  
      if (this.currentPage > 1) {
        html += `<button class="pagination-btn" data-page="${this.currentPage - 1}">← Anterior</button>`;
      }
  
      for (let i = 1; i <= totalPages; i++) {
        const active = i === this.currentPage ? 'active' : '';
        html += `<button class="page-btn ${active}" data-page="${i}">${i}</button>`;
      }
  
      if (this.currentPage < totalPages) {
        html += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Próximo →</button>`;
      }
  
      html += '</div>';
      return html;
    }
  
    filterData() {
      if (!this.searchTerm) return this.data;
      return this.data.filter(row => JSON.stringify(row).toLowerCase().includes(this.searchTerm));
    }
  
    paginateData(data) {
      const start = (this.currentPage - 1) * this.pageSize;
      return data.slice(start, start + this.pageSize);
    }
  
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, prop) => current?.[prop], obj) || '';
    }
  
    setData(data) {
      this.data = data;
      this.currentPage = 1;
      this.render();
    }
  
    addActionListeners() {
      const container = document.getElementById(this.containerId);
  
      container.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          if (this.onView) this.onView(id);
        });
      });
  
      container.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          if (this.onEdit) this.onEdit(id);
        });
      });
  
      container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          if (this.onDelete) this.onDelete(id);
        });
      });
  
      container.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.currentPage = parseInt(e.target.dataset.page);
          this.render();
        });
      });
    }
  }
  
  export default DataTable;