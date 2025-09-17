const fs = require('fs');
const path = require('path');

function registra(query, res) {
    const { nome, atividade, status } = query;
    if (!nome || !atividade || !status) {
        return serveHTML(res, path.join(__dirname, '../HTMLS/registratv.html'));
    }

    const filePath = path.join('leads', `${nome}.json`);
    if (!fs.existsSync(filePath)) return res.end("Lead não encontrado!");

    let lead = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!lead.histLead) lead.histLead = [];
    lead.histLead.push(atividade);
    lead.status = status;

    fs.writeFileSync(filePath, JSON.stringify(lead, null, 2));

    if (!fs.existsSync('Atividades')) fs.mkdirSync('Atividades');
    const logName = `log_${Date.now()}.json`;
    const logPath = path.join('Atividades', logName);
    fs.writeFileSync(logPath, JSON.stringify({ nome, atividade, status, data: new Date() }, null, 2));

    res.end("Atividade registrada!");
}

// helper local
function serveHTML(res, filePath) {
    if (fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(filePath));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Página não encontrada.");
    }
}

module.exports = { registra };
