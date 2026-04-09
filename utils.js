/**
 * Utilitários Gerais
 */

class Utils {
  /**
   * Valida email
   */
  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida CPF
   */
  static validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  /**
   * Formata CPF para exibição
   */
  static formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formata telefone
   */
  static formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  /**
   * Formata CEP
   */
  static formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Formata moeda em Real
   */
  static formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  /**
   * Formata data
   */
  static formatarData(data, formato = 'DD/MM/YYYY') {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    formato = formato.replace('DD', dia);
    formato = formato.replace('MM', mes);
    formato = formato.replace('YYYY', ano);
    formato = formato.replace('HH', horas);
    formato = formato.replace('mm', minutos);

    return formato;
  }

  /**
   * Debounce para funções
   */
  static debounce(funcao, delay = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => funcao.apply(this, args), delay);
    };
  }

  /**
   * Throttle para funções
   */
  static throttle(funcao, limit = 300) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        funcao.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            funcao.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  /**
   * Verifica conectividade com a internet
   */
  static async verificarConectividade() {
    try {
      const resposta = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return resposta.ok || resposta.status === 0;
    } catch (erro) {
      return false;
    }
  }

  /**
   * Copia texto para a área de transferência
   */
  static async copiarParaAreaTransferencia(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (erro) {
      console.error('Erro ao copiar:', erro);
      return false;
    }
  }

  /**
   * Gera UUID v4
   */
  static gerarUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Armazena dados no localStorage
   */
  static armazenarLocal(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      console.error('Erro ao armazenar no localStorage:', erro);
      return false;
    }
  }

  /**
   * Recupera dados do localStorage
   */
  static recuperarLocal(chave) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : null;
    } catch (erro) {
      console.error('Erro ao recuperar do localStorage:', erro);
      return null;
    }
  }

  /**
   * Remove dados do localStorage
   */
  static removerLocal(chave) {
    try {
      localStorage.removeItem(chave);
      return true;
    } catch (erro) {
      console.error('Erro ao remover do localStorage:', erro);
      return false;
    }
  }

  /**
   * Limpa todo o localStorage
   */
  static limparLocal() {
    try {
      localStorage.clear();
      return true;
    } catch (erro) {
      console.error('Erro ao limpar localStorage:', erro);
      return false;
    }
  }
}

export { Utils };

