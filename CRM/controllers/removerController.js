const fs = require('fs');
const path = require('path');

// Função para servir HTML
function serveHTML(res, message) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Remover Lead</title>
            <link rel="stylesheet" href="../style.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <div class="alert alert-info">${message}</div>
                <a href="/" class="btn btn-secondary mt-3">Voltar</a>
            </div>
        </body>
        </html>
    `);
    res.end();
}

function removerLead(query, res) {
    const { numero, motivo, observacoes } = query;

    if (!numero) {
        return serveHTML(res, "Informe o número do lead para remover.");
    }

    const filePath = path.join(__dirname, '../leads', `${numero}.json`);

    if (!fs.existsSync(filePath)) {
        return serveHTML(res, `Lead com número <strong>${numero}</strong> não encontrado.`);
    }

    try {
        fs.unlinkSync(filePath);

        // opcional: salvar log da remoção em uma pasta separada
        const logDir = path.join(__dirname, '../remocoes');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        const logPath = path.join(logDir, `${numero}.json`);
        const logData = {
            numero,
            motivo,
            observacoes,
            removidoEm: new Date().toISOString()
        };

        fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));

        return serveHTML(res, `Lead <strong>${numero}</strong> removido com sucesso!`);
    } catch (err) {
        console.error("Erro ao remover lead:", err);
        return serveHTML(res, "Erro ao remover lead. Tente novamente.");
    }
}

module.exports = { removerLead };
