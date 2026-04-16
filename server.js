const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

// Páginas protegidas que precisam de autenticação (verificada no cliente via dashboard.html)
const protectedPages = [
  'dashboard',
  'produtos',
  'fornecedores',
  'funcionarios',
  'mercados',
  'vendas',
  'analises',
  'cadastro-produtos'
];

// Páginas públicas (login, recuperação, etc)
const publicPages = [
  'login',
  'tela_login',
  'recuperar-senha',
  'recuperar_login',
  'redefinir-senha',
  'redefinir_senha',
  'verificar-email',
  'verificar_email',
  'senha_atualizada'
];

// Função auxiliar para servir arquivo HTML
function serveHtmlFile(req, res, filename) {
  const filepath = path.join(__dirname, 'pages', `${filename}.html`);
  res.sendFile(filepath, (err) => {
    if (err) {
      console.error(`Erro ao servir ${filename}:`, err);
      res.status(404).sendFile(path.join(__dirname, 'pages', 'tela_login.html'));
    }
  });
}

// Rota para servir arquivos HTML
app.get('/', (req, res) => {
  // Sempre servir dashboard - autenticação é feita no cliente
  serveHtmlFile(req, res, 'dashboard');
});

app.get('/login', (req, res) => {
  serveHtmlFile(req, res, 'tela_login');
});

app.get('/recuperar-senha', (req, res) => {
  serveHtmlFile(req, res, 'recuperar_login');
});

app.get('/redefinir-senha', (req, res) => {
  serveHtmlFile(req, res, 'redefinir_senha');
});

app.get('/verificar-email', (req, res) => {
  serveHtmlFile(req, res, 'verificar_email');
});

app.get('/produtos', (req, res) => {
  serveHtmlFile(req, res, 'produtos');
});

app.get('/cadastro-produtos', (req, res) => {
  serveHtmlFile(req, res, 'cadastro_produtos');
});

app.get('/fornecedores', (req, res) => {
  serveHtmlFile(req, res, 'fornecedores');
});

app.get('/funcionarios', (req, res) => {
  serveHtmlFile(req, res, 'funcionarios');
});

app.get('/mercados', (req, res) => {
  serveHtmlFile(req, res, 'mercados');
});

app.get('/vendas', (req, res) => {
  serveHtmlFile(req, res, 'vendas');
});

app.get('/analises', (req, res) => {
  serveHtmlFile(req, res, 'analises');
});

// Tratamento para rotas não encontradas
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'pages', 'tela_login.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Diretório: ${__dirname}`);
});
