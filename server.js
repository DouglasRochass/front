/**
 * Servidor Local Simples para Desenvolvimento
 * 
 * Uso: node server.js
 * Acesse: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Remover query string da URL
  const urlPath = req.url.split('?')[0];
  
  // Resolver caminho
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

  // Proteger acesso fora do diretório
  const realPath = path.resolve(filePath);
  const rootPath = path.resolve(__dirname);
  if (!realPath.startsWith(rootPath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Acesso Negado');
    return;
  }

  // Verificar se arquivo existe
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Se for diretório, tentar index.html
      if (err.code === 'ENOENT') {
        const indexPath = path.join(filePath, 'index.html');
        fs.stat(indexPath, (err2) => {
          if (!err2) {
            serveFile(indexPath, res);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Arquivo não encontrado');
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro do servidor');
      }
      return;
    }

    // Se for diretório, tentar index.html
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    serveFile(filePath, res);
  });

  function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao ler arquivo');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      // Headers para permitir CORS
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      res.end(data);
    });
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`📂 Diretório: ${__dirname}`);
  console.log(`\n🔗 Abra http://localhost:${PORT}/index.html no navegador\n`);
});
