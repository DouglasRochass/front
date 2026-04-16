/**
  * Serviço de Vendas
  * Gerencia operações de CRUD para vendas via API
 */

import APIService from './APIService.js';
import APIConfig from '../config/APIConfig.js';

class VendasService {
  async listar(params = {}) {
    try {
      const result = await APIService.get(APIConfig.ENDPOINTS.VENDAS.LIST, params);
      return {
        success: true,
        data: result.data || result.content || result || [],
        message: 'Vendas carregadas com sucesso',
      };
    } catch (error) {
      console.error('[VendasService] Erro ao listar vendas:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Erro ao carregar vendas',
        error,
      };
    }
  }

  async obter(id) {
    try {
      const endpoint = APIConfig.ENDPOINTS.VENDAS.GET.replace(':id', id);
      const result = await APIService.get(endpoint);
      return {
        success: true,
        data: result.data || result,
        message: 'Venda carregada com sucesso',
      };
    } catch (error) {
      console.error('[VendasService] Erro ao obter venda:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao carregar venda',
        error,
      };
    }
  }

  async criar(dados) {
    try {
      const result = await APIService.post(APIConfig.ENDPOINTS.VENDAS.CREATE, dados);
      return {
        success: true,
        data: result.data || result,
        message: result.message || 'Venda registrada com sucesso',
      };
    } catch (error) {
      console.error('[VendasService] Erro ao criar venda:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao registrar venda',
        error,
      };
    }
  }

  async relatorio(params = {}) {
    try {
      const result = await APIService.get(APIConfig.ENDPOINTS.VENDAS.RELATORIO, params);
      return {
        success: true,
        data: result.data || result,
        message: 'Relatório gerado com sucesso',
      };
    } catch (error) {
      console.error('[VendasService] Erro ao gerar relatório:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Erro ao gerar relatório',
        error,
      };
    }
  }

  /**
    * Analisa sazonalidade das vendas agrupando por mês e por dia da semana.
    * @returns {{ mensal: {labels, totais, quantidades}, semanal: {labels, totais} }}
   */
  analisarSazonalidade(vendas) {
    const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const DIAS  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

    const mensal    = Array.from({ length: 12 }, () => ({ total: 0, qtd: 0 }));
    const semanal   = Array.from({ length: 7  }, () => ({ total: 0, qtd: 0 }));

    for (const v of vendas) {
      const d = new Date(v.data || v.createdAt || v.dataVenda);
      if (isNaN(d)) continue;
      const valor = parseFloat(v.total || v.valorTotal || 0);

      mensal[d.getMonth()].total += valor;
      mensal[d.getMonth()].qtd  += 1;

      semanal[d.getDay()].total += valor;
      semanal[d.getDay()].qtd  += 1;
    }

    return {
      mensal: {
        labels:      MESES,
        totais:      mensal.map(m => parseFloat(m.total.toFixed(2))),
        quantidades: mensal.map(m => m.qtd),
      },
      semanal: {
        labels: DIAS,
        totais: semanal.map(s => parseFloat(s.total.toFixed(2))),
        quantidades: semanal.map(s => s.qtd),
      },
    };
  }

  /**
    * Calcula previsão de esgotamento de estoque por produto usando
    * média de vendas dos últimos 30 dias como velocidade diária.
    * @param {Array} produtos - lista de produtos com id, nome, quantidade/estoque
    * @param {Array} vendas   - lista de vendas com itens/produto referenciados
    * @returns {Array} produtos com diasRestantes, velocidadeDiaria, status
   */
  calcularPrevisaoEstoque(produtos, vendas) {
    const JANELA_DIAS = 30;
    const agora = new Date();
    const inicio = new Date(agora.getTime() - JANELA_DIAS * 86400000);

    // Acumula unidades vendidas por produtoId nos últimos 30 dias
    const vendasPorProduto = {};
    for (const v of vendas) {
      const d = new Date(v.data || v.createdAt || v.dataVenda);
      if (isNaN(d) || d < inicio) continue;

      const itens = v.itens || v.produtos || [];
      for (const item of itens) {
        const pid = item.produtoId || item.produto?.id;
        if (!pid) continue;
        vendasPorProduto[pid] = (vendasPorProduto[pid] || 0) + (item.quantidade || 1);
      }
    }

    return produtos.map(p => {
      const estoque      = p.quantidade ?? p.estoque ?? p.quantidadeEstoque ?? 0;
      const vendidos30d  = vendasPorProduto[p.id] || 0;
      const velDiaria    = parseFloat((vendidos30d / JANELA_DIAS).toFixed(3));
      const diasRestantes = velDiaria > 0 ? Math.floor(estoque / velDiaria) : Infinity;

      let status = 'ok';
      if (diasRestantes <= 7)         status = 'critico';
      else if (diasRestantes <= 14)   status = 'atencao';
      else if (diasRestantes <= 30)   status = 'aviso';

      const recomendacao = velDiaria > 0
        ? Math.ceil(velDiaria * 30)
        : null;

      return {
        id: p.id,
        nome: p.nome,
        estoque,
        velDiaria,
        vendidos30d,
        diasRestantes: isFinite(diasRestantes) ? diasRestantes : null,
        status,
        recomendacao,
      };
    }).sort((a, b) => {
      const score = (s) => ({ critico: 0, atencao: 1, aviso: 2, ok: 3 }[s] ?? 4);
      return score(a.status) - score(b.status);
    });
  }
}

export default new VendasService();