const path = require('path');
const fs = require('fs');
const leadController = require('./controllers/leadController');
const atualizarLeadController = require('./controllers/atualizarLeadController');
const atividadeController = require('./controllers/atividadeController');
const consultarController = require('./controllers/consultarController');
const { relatorio } = require('./controllers/relatorioController');
const removerController = require('./controllers/removerController');

// Serve arquivos HTML
function serveHTML(res, fileName) {
    // Caminho absoluto correto
    const filePath = path.join(__dirname, 'HTMLS', fileName);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Arquivo não encontrado: ' + filePath);
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}


function parsePostData(req, callback) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        const parsed = Object.fromEntries(new URLSearchParams(body));
        callback(parsed);
    });
}

function handleRoute(parsedUrl, req, res) {
    const { pathname } = parsedUrl;
    console.log('Rota acessada:', pathname, 'Método:', req.method);


    if (pathname === '/' || pathname === '/index') serveHTML(res, 'index.html');
    else if (pathname === '/cadastrar' || pathname === '/cadastrar/') serveHTML(res, 'cadastrarlead.html');
    else if (pathname === '/atualizar') serveHTML(res, 'atualizarlead.html');
    else if (pathname === '/consultar') serveHTML(res, 'consultarlead.html');
    else if (pathname === '/remover') serveHTML(res, 'removerlead.html');
    else if (pathname === '/relatorioVendas') serveHTML(res, 'relatorio.html');
    else if (pathname === '/registrar') serveHTML(res, 'registraratv.html');


    else if (pathname === '/cadastra' && req.method === 'POST') parsePostData(req, data => leadController.cadastra(data, res));
    else if (pathname === '/consultaLead' && req.method === 'POST') parsePostData(req, data => atualizarLeadController.consultaLead(data, res));
    else if (pathname === '/atualiza' && req.method === 'POST') parsePostData(req, data => atualizarLeadController.atualiza(data, res));
    else if (pathname === '/consultarLead' && req.method === 'POST') parsePostData(req, data => consultarController.consultarLead(data, res));
    else if (pathname === '/remove' && req.method === 'POST') parsePostData(req, data => removerController.removerLead(data, res));
    else if (pathname === '/registraAtividade' && req.method === 'POST') parsePostData(req, data => atividadeController.registra(data, res));
    else if (pathname === '/relatorio') return relatorio(res);

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página não encontrada.');
    }
}

module.exports = { handleRoute };
