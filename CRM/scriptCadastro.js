/* <label for="numero">Digite um número de telefone:</label>
        <input type="text" id="numero" placeholder="Somente números" pattern="^\d{10,11}$" title="Apenas números são permitidos" required>
        <label for="CadLNome">Digite o Nome:</label>
        <input type="text" id="CadLNome" placeholder="Digite o Nome do lead" pattern="^[a-zA-ZÀ-ÿ\s]+$">
        <label for="CadLEndereco">Digite o endereço</label>
        <input type="text" id="CadLEndereco" placeholder="Digite um  Endereço valido">

        <button type="submit">Enviar</button> */

const cadastro = document.getElementById("submit")
const numero = document.getElementById("numero")
const CadLNome = decodeURIComponent

cadastro.addEventListener('click',function()
{
    if (!fs.existsSync('leads')) {
            fs.mkdirSync('leads')
    }

    const filePath = `leads/${cadastro.}.json`



















   
});