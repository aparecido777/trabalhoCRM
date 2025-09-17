//botoes
const PipelineVendas = document.getElementById("PipelineVendas")
const CadastrarLead = document.getElementById("cadastroLead")
const RATV = document.getElementById("registrarAtv")
const AttLead = document.getElementById("attLead")
const consultLead = document.getElementById("consultLead")
const RmvLead = document.getElementById("RmvLead")
const relatorioFV = document.getElementById("relatorioFV")

//div's paginas
const divPipeline = document.getElementById("divPipeline")
const divCadastroLead = document.getElementById("divCadastroLead")
const divRegistrarAtv = document.getElementById("divRegistrarAtv")
const divAttLead = document.getElementById("divAttLead")
const divConsultaLead = document.getElementById("divConsultaLead")
const divRmvLead = document.getElementById("divRmvLead")
const divRelatorioFV= document.getElementById("divRelatorioFV")


PipelineVendas.addEventListener('click', function() {
    alert(
        "Pipeline:\n" +
        "Contato Inicial\n" +
        "Proposta Apresentada\n" +
        "Negociação\n" +
        "Fechamento"
    );
});
CadastrarLead.addEventListener('click',function()
{
    window.location.assign("./HTMLS/cadastrarlead.html");






});