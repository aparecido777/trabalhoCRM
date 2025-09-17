const path = require('path');
const fs = require('fs');
const leadController = require('./controllers/leadController');
const atividadeController = require('./controllers/atividadeController');

// Serve arquivos HTML
function serveHTML(res, fileName) {
    const filePath = path.join(__dirname, 'HTMLS', fileName);
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Erro ao carregar o arquivo.');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Arquivo não encontrado.');
    }
}

// Lê dados de um POST
function parsePostData(req, callback) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        const parsed = Object.fromEntries(new URLSearchParams(body));
        callback(parsed);
    });
}

// Roteamento
function handleRoute(parsedUrl, req, res) {
    const { pathname, query } = parsedUrl;

    // --- páginas HTML ---
    if (pathname === '/') serveHTML(res, 'index.html');
    else if (pathname === '/cadastrar') serveHTML(res, 'cadastrarlead.html');
    else if (pathname === '/atualizar') serveHTML(res, 'atualizarlead.html');
    else if (pathname === '/consultar') serveHTML(res, 'consultarlead.html');
    else if (pathname === '/remover') serveHTML(res, 'removerlead.html');
    else if (pathname === '/relatorio') serveHTML(res, 'relatorio.html');
    else if (pathname === '/registrar') serveHTML(res, 'registraratv.html');

    // --- rotas que chamam controller ---
    else if (pathname === '/cadastra') {
        if (req.method === 'POST') {
            parsePostData(req, data => leadController.cadastra(data, res));
        } else {
            serveHTML(res, 'cadastrarlead.html');
        }
    }
    else if (pathname === '/atualiza') {
        if (req.method === 'POST') {
            parsePostData(req, data => leadController.atualiza(data, res));
        } else {
            serveHTML(res, 'atualizarlead.html');
        }
    }
    else if (pathname === '/consulta') {
        if (req.method === 'POST') {
            parsePostData(req, data => leadController.consulta(data, res));
        } else {
            serveHTML(res, 'consultarlead.html');
        }
    }
    else if (pathname === '/remove') {
        if (req.method === 'POST') {
            parsePostData(req, data => leadController.remove(data, res));
        } else {
            serveHTML(res, 'removerlead.html');
        }
    }
    else if (pathname === '/relatorioDados') {
        if (req.method === 'POST') {
            parsePostData(req, data => leadController.relatorio(data, res));
        } else {
            serveHTML(res, 'relatorio.html');
        }
    }
    else if (pathname === '/registraAtividade') {
        if (req.method === 'POST') {
            parsePostData(req, data => atividadeController.registra(data, res));
        } else {
            serveHTML(res, 'registraratv.html');
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página não encontrada.');
    }
}

module.exports = { handleRoute };
