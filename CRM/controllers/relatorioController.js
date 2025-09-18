const fs = require('fs');
const path = require('path');

function relatorio(res) {
    const leadsDir = path.join(__dirname, '../leads');

    if (!fs.existsSync(leadsDir)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("<h2>Nenhum lead cadastrado ainda!</h2>");
    }

    const arquivos = fs.readdirSync(leadsDir);
    let tabela = `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Relatório Funil de Vendas</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-5">
        <h1 class="mb-4">Relatório - Funil de Vendas</h1>
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>IDLead</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Endereço</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    arquivos.forEach(arq => {
        const dados = JSON.parse(fs.readFileSync(path.join(leadsDir, arq), 'utf-8'));
        tabela += `
            <tr>
                <td>${dados.IDLead}</td>
                <td>${dados.nome}</td>
                <td>${dados.numero}</td>
                <td>${dados.endereco}</td>
                <td>${dados.status}</td>
            </tr>
        `;
    });

    tabela += `
            </tbody>
        </table>
        <a href="/" class="btn btn-primary">Voltar</a>
    </body>
    </html>
    `;

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(tabela);
}

module.exports = { relatorio };
