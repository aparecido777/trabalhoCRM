const fs = require('fs');
const path = require('path');

const statusOrdem = ["Inicial", "Proposta", "Negociação", "Fechamento"];

function consultarLead(data, res) {
    const { numero } = data;

    if (!numero) return serveHTML(res, "Informe um número!");

    const filePath = path.join(__dirname, '../leads', `${numero}.json`);
    if (!fs.existsSync(filePath)) {
        return serveHTML(res, "Lead não encontrado!");
    }

    const lead = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultar Lead</title>
        <link rel="stylesheet" href="styleHtmls.css">
    </head>
    <body>
        <h1>Consultar Lead</h1>
        <p><strong>Número:</strong> ${lead.numero}</p>
        <p><strong>Nome:</strong> ${lead.nome}</p>
        <p><strong>Endereço:</strong> ${lead.endereco}</p>
        <p><strong>Status:</strong> ${lead.status}</p>
        <br>
        <a href="/consultar">Voltar</a>
    </body>
    </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

function serveHTML(res, mensagem) {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultar Lead</title>
        <link rel="stylesheet" href="styleHtmls.css">
    </head>
    <body>
        <h1>Consultar Lead</h1>
        <p>${mensagem}</p>
        <a href="/consultar">Voltar</a>
    </body>
    </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

module.exports = { consultarLead };
