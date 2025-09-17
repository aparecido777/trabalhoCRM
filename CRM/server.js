const http = require('http');
const url = require('url');
const { handleRoute } = require('./routes');

const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    handleRoute(parsedUrl, req, res);
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}...`);
});