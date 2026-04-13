# 🚀 Como Executar o Frontend com Servidor Local

## ⚠️ O Problema
Você está tentando abrir o arquivo HTML direto com `file://` protocol, o que **não funciona** com módulos ES6 (imports).

## ✅ Soluções

### Opção 1: Live Server (Recomendado - Mais Fácil)

#### 1. Instalar a extensão no VS Code
- Abra VS Code
- Vá para **Extensions** (Ctrl+Shift+X)
- Procure por **"Live Server"**
- Clique em **Install**

#### 2. Usar a extensão
- Clique com botão direito em qualquer arquivo `.html`
- Selecione **"Open with Live Server"**
- Automaticamente abre em `http://localhost:5500`

---

### Opção 2: Python (Se tiver Python instalado)

Abra Terminal na pasta do projeto e execute:

```bash
# Python 3.x
python -m http.server 3000

# Python 2.x (se não funcionar acima)
python -m SimpleHTTPServer 3000
```

Depois acesse: **http://localhost:3000**

---

### Opção 3: Node.js HTTP Server (Simples)

```bash
# Instalar globally (só precisa uma vez)
npm install -g http-server

# Na pasta do projeto, executar:
http-server -p 3000
```

Depois acesse: **http://localhost:3000**

---

### Opção 4: Node.js com o Servidor Customizado

Já criei um arquivo `server.js` para você:

```bash
# Na pasta do projeto
node server.js
```

Depois acesse: **http://localhost:3000**

---

## 📋 Passo a Passo Completo

### 1️⃣ Abra Terminal

**Windows:**
- Clique em **File → Open in Terminal** (ou Ctrl+J no VS Code)

**Mac/Linux:**
- Terminal → Nova aba na pasta

### 2️⃣ Escolha um Método

**Método 1 - Live Server (mais fácil):**
```
Apenas clique com botão direito no HTML e "Open with Live Server"
```

**Método 2 - Python:**
```bash
cd c:\Users\DOUGLASROCHASANTOS\Desktop\front
python -m http.server 3000
```

**Método 3 - Node.js:**
```bash
cd c:\Users\DOUGLASROCHASANTOS\Desktop\front
node server.js
```

### 3️⃣ Abra no Navegador

Acesse uma dessas URLs no seu navegador:
- **Live Server:** `http://localhost:5500` (vai abrir automaticamente)
- **Python:** `http://localhost:3000`
- **Node.js:** `http://localhost:3000`

---

## ✅ Como Saber se Funcionou

1. O arquivo HTML carregou sem erros CORS
2. No Console (F12) você vê logs de sucesso
3. O dashboard mostra os dados da API

---

## 🔗 Estrutura de Arquivos (para referência)

```
c:\Users\DOUGLASROCHASANTOS\Desktop\front\
├── index.html
├── js/
│   ├── pages/
│   │   └── dashboard.html ← Você está aqui
│   ├── services/
│   │   ├── APIService.js
│   │   ├── AuthService.js
│   │   └── ...
│   └── components/
│       ├── Navbar.js
│       └── ...
├── server.js ← Novo arquivo para rodar como servidor
└── package.json
```

---

## 🆘 Dúvidas

**P: Qual opção recomendo?**
R: **Live Server** é a mais fácil. Instale e pronto.

**P: E se não tiver Node.js?**
R: Use **Python** (vem no Windows 10+) ou **Live Server** no VS Code.

**P: Posso usar um servidor remoto?**
R: Sim! Configure um servidor web (Apache, Nginx, etc) apontando para esta pasta.

---

**Data:** 13 de abril de 2026
