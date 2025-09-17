const fs = require('fs');
const path = require('path');

function cadastra(data, res) {
    const { numero, nome, endereco } = data;

    // validação básica
    if (!numero || !nome || !endereco) {
        return serveHTML(res, path.join(__dirname, '../HTMLS/cadastrarlead.html'), "Preencha todos os campos!");
    }

    // cria pasta leads se não existir
    const leadsFolder = path.join(__dirname, '../leads');
    if (!fs.existsSync(leadsFolder)) fs.mkdirSync(leadsFolder);

    const filePath = path.join(leadsFolder, `${numero}.json`);

    if (fs.existsSync(filePath)) {
        return serveHTML(res, path.join(__dirname, '../HTMLS/cadastrarlead.html'), "Lead já cadastrado!");
    }

    const lead = {
        numero,
        nome,
        endereco,
        status: "Contato inicial",
        histLead: []
    };

    fs.writeFileSync(filePath, JSON.stringify(lead, null, 2));

    serveHTML(res, path.join(__dirname, '../HTMLS/cadastrarlead.html'), "Lead cadastrado com sucesso!");
}

// função helper para servir HTML e exibir mensagem
function serveHTML(res, filePath, mensagem = "") {
    if (fs.existsSync(filePath)) {
        let html = fs.readFileSync(filePath, 'utf8');
        // insere a mensagem no HTML
        html = html.replace("Cadastre seu lead", mensagem);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Página não encontrada.");
    }
}

module.exports = { cadastra };
