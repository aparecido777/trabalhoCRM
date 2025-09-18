const fs = require('fs');
const path = require('path');

const statusOrdem = ["Inicial", "Proposta", "Negociação", "Fechamento"];

// Busca lead pelo número
function consultaLead(data, res) {
    const { numero } = data;

    if (!numero) return serveHTML(res, "Informe um número!");

    const filePath = path.join(__dirname, '../leads', `${numero}.json`);
    if (!fs.existsSync(filePath)) {
        return serveHTML(res, "Lead não encontrado!");
    }

    const lead = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atualizar Lead</title>
        <link rel="stylesheet" href="styleHtmls.css">
    </head>
    <body>
        <h1>Atualizar Lead</h1>
        <p>Lead encontrado. Altere os dados e avance o status:</p>

        <form action="/atualiza" method="POST">
            <input type="hidden" name="numero" value="${lead.numero}">
            <label for="nome">Nome:</label>
            <input type="text" name="nome" value="${lead.nome}" required><br><br>

            <label for="endereco">Endereço:</label>
            <input type="text" name="endereco" value="${lead.endereco}" required><br><br>

            <label for="status">Status:</label>
            <select name="status" required>
                ${statusOrdem.map(s => {
                    const atualIndex = statusOrdem.indexOf(lead.status);
                    const sIndex = statusOrdem.indexOf(s);
                    if (sIndex >= atualIndex) {
                        return `<option value="${s}" ${s === lead.status ? "selected" : ""}>${s}</option>`;
                    }
                    return "";
                }).join('')}
            </select><br><br>

            <button type="submit">Atualizar</button>
        </form>
    </body>
    </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

// Atualiza o lead
function atualiza(data, res) {
    const { numero, nome, endereco, status } = data;

    if (!numero || !nome || !endereco || !status) {
        return serveHTML(res, "Preencha todos os campos!");
    }

    const filePath = path.join(__dirname, '../leads', `${numero}.json`);
    if (!fs.existsSync(filePath)) {
        return serveHTML(res, "Lead não encontrado!");
    }

    const lead = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const statusAtualIndex = statusOrdem.indexOf(lead.status);
    const statusNovoIndex = statusOrdem.indexOf(status);

    if (statusNovoIndex < statusAtualIndex) {
        return serveHTML(res, "Não é possível regredir o status!");
    }

    lead.nome = nome;
    lead.endereco = endereco;
    lead.status = status;

    fs.writeFileSync(filePath, JSON.stringify(lead, null, 2));

    return serveHTML(res, "Lead atualizado com sucesso!");
}

// Serve HTML com mensagem simples
function serveHTML(res, mensagem) {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Atualizar Lead</title>
        <link rel="stylesheet" href="styleHtmls.css">
    </head>
    <body>
        <h1>Atualizar Lead</h1>
        <p>${mensagem}</p>
        <a href="/atualizar">Voltar</a>
    </body>
    </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

module.exports = { consultaLead, atualiza };
