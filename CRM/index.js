//modulos externos
const chalk = require('chalk')
const inquirer = require('inquirer')

//modulo interno
const fs = require('fs')
const { type } = require('os')

console.log('Módulos inicializados com sucesso')




menu()

function menu(){
    inquirer.prompt([{
        type : 'list',
        name: 'op',
        message: 'Opções',
        choices: [
            'Pipeline de Vendas', //mostrar funil de vendas
            'Cadastrar lead', //dados do lead
            'Registrar atividade', //tarefas, ligações...
            'Atualizar Lead', //atualizar lead depois da atividade
            'Consultar Lead',
            'Remover Lead',
            'Relatório Funil de Vendas',
            'Sair'
        ]
    }]).then((resp) => {
        const op = resp['op']
        console.log(op)
        console.log('Entrou----')
        if(op === 'Pipeline de Vendas'){
            exibirPipeline()
        }else if(op === 'Cadastrar lead'){
            console.log('entrou cadastro')
            cadastrarLead()
        }else if(op === 'Registrar atividade'){
            RegistrarAtividade()
        }else if(op === 'Atualizar Lead'){
            AtualizarLead();
        }else if(op === 'Consultar Lead'){
            consultarLead()
        }else if(op === 'Remover Lead'){
            removerLead()
        }
        
        else if(op === 'Relatório Funil de Vendas'){
            RelatorioLeads()
            
        }else if(op === 'Sair'){
            console.log(chalk.bgBlue.black('Sair do Programa'))
            //encerrar a execução do sistema
            process.exit()
        }
            
        
    })
    .catch(err => console.log(err))
}


function  exibirPipeline()
{
    console.log(chalk.gray('Contato Inicial'))
    console.log(chalk.gray('Proposta Apresentada'))
    console.log(chalk.gray('Negociação'))
    console.log(chalk.gray('Fechamento'))
    menu()
}
function consultarLead()
{
    inquirer.prompt([{
        name:'nomeLead',
        message:'Digte o Lead que deseja consultar:'
    }]).then((resp) => {
        const nomeLead = resp.nomeLead

        //se não existe o lead retornop ara a mesma func

        if(!verificaLead(nomeLead))
        {
            return consultarLead()
        }
        const leadObj = getLead(nomeLead)
        console.log(chalk.bgBlue.black(`O historico do Lead ${nomeLead} é: ${leadObj.historico}`))
        menu()
    }).catch(err=> console.log(err))

}

function AtualizarLead() {
    inquirer.prompt([
        {
            name: 'teleLeadBusca',
            message: 'Digite o telefone do lead para atualizar'
        }
    ]).then((resp) => {
        const { teleLeadBusca } = resp;

        // verifica se existe algum arquivo com esse telefone
        const arquivos = fs.readdirSync('leads');
        const arquivoEncontrado = arquivos.find(arquivo => {
            const conteudo = JSON.parse(fs.readFileSync(`leads/${arquivo}`));
            return conteudo.TelefoneLead === teleLeadBusca;
        });

        if (!arquivoEncontrado) {
            console.log(chalk.red('Lead não encontrado!'));
            return menu();
        }

        // carregar os dados atuais
        const filePath = `leads/${arquivoEncontrado}`;
        const leadAtual = JSON.parse(fs.readFileSync(filePath));

        // ordem do funil
        const ordemFunil = ["inicial", "Proposta", "negociação", "fechamento"];
        const indiceAtual = ordemFunil.indexOf(leadAtual.StatusLead);

        // pedir novos dados
        inquirer.prompt([
            {
                name: 'NomeLead',
                message:`Nome antigo do lead (${leadAtual.NomeLead}):`,
                default: leadAtual.NomeLead
            },
            {
                name: 'teleLead',
                message: `Telefone do Lead (${leadAtual.TelefoneLead}):`,
                default: leadAtual.TelefoneLead
            },
            {
                name: 'enderecoLead',
                message: `Endereço do Lead (${leadAtual.EnderecoLead}):`,
                default: leadAtual.EnderecoLead
            },
            {
                type :'list',
                name: 'StatusLead',
                message: `Status do Lead (atual: ${leadAtual.StatusLead}):`,
                choices: ordemFunil.slice(indiceAtual) // só deixa do status atual pra frente
            }
        ]).then((resp) => {
            const { NomeLead, teleLead, enderecoLead, StatusLead } = resp;

            // garante que não retrocede
            const novoIndice = ordemFunil.indexOf(StatusLead);
            if (novoIndice < indiceAtual) {
                console.log(chalk.red(`Não é permitido voltar o status! (${leadAtual.StatusLead} -> ${StatusLead})`));
                return menu();
            }

            // atualizar dados no mesmo objeto
            leadAtual.NomeLead = NomeLead;
            leadAtual.TelefoneLead = teleLead;
            leadAtual.EnderecoLead = enderecoLead;
            leadAtual.StatusLead = StatusLead;

            // sobrescrever o JSON
            fs.writeFileSync(filePath, JSON.stringify(leadAtual, null, 2));

            console.log(chalk.green('Lead atualizado com sucesso!'));
            menu();
        }).catch(err => console.log(err));
    });
}





function cadastrarLead(){
    console.log(chalk.bgGreen.black('Bem vindo ao CRM'))
    console.log(chalk.green('opções'))
    criarLead()
}
function criarLead() {
    inquirer.prompt([
        {
            name: 'nomeLead',
            message: 'Digite o nome do Lead'
        },
        {
            name: 'teleLead',
            message: 'Digite o telefone do Lead'
        },
        {
            name: 'enderecoLead',
            message: 'Digite o endereco do Lead'
        }
    ]).then((resp) => {
        const { nomeLead, teleLead, enderecoLead } = resp

        // criar diretório Leads caso não exista
        if (!fs.existsSync('leads')) {
            fs.mkdirSync('leads')
        }

        // agora o nome do arquivo é o número do telefone
        const filePath = `leads/${teleLead}.json`

        // validar se o arquivo json do lead existe (pelo telefone)
        if (fs.existsSync(filePath)) {
            console.log(chalk.bgRed.black('Este telefone já está cadastrado como Lead'))
            return criarLead()
        }

        const idLead = crypto.randomUUID();

        // criar um objeto para o lead
        const leadData = {
            idLead: idLead,
            NomeLead: nomeLead,
            TelefoneLead: teleLead,
            EnderecoLead: enderecoLead,
            StatusLead: "Inicial",
            historico: "" // melhor já criar a chave historico
        }

        // salvar o objeto como JSON
        fs.writeFileSync(filePath, JSON.stringify(leadData, null, 2))

        console.log(chalk.green('Lead criado com sucesso'))
        menu()
    }).catch(err => console.log(err))
}


function RegistrarAtividade() {
    inquirer.prompt([{
        name: 'teleLead',
        message: 'Digite o telefone do lead que deseja atualizar:'
    }]).then((resp) => {
        const teleLead = resp.teleLead;

        // verifica se o lead existe
        if (!verificaTeleLead(teleLead)) {
            return RegistrarAtividade();
        }

        criarAtividade(teleLead);
    });
}

function verificaLead(nomeLead)
{
    //info o usuario que o arquivo nao existe
    if(!fs.existsSync(`leads/${nomeLead}.json`))
    {
        console.log(chalk.bgRed.black('Este lead nao existe!'))
        return false
    }
    return true
}
function verificaTeleLead(teleLead)
{
    //info o usuario que o arquivo nao existe
    if(!fs.existsSync(`leads/${teleLead}.json`))
    {
        console.log(chalk.bgRed.black('Este lead nao existe!'))
        return false
    }
    return true
}


function criarAtividade(teleLead) {
    inquirer.prompt([
        {
            name: 'nomeVendedor',
            message: 'Digite o nome do vendedor:'
        },
        {
            type: 'list',
            name: 'statusFunil',
            message: 'Qual status do funil de vendas do lead?',
            choices: ['Inicial', 'Proposta', 'Negociação', 'Fechamento']
        },
        {
            name: 'historico',
            message: 'Digite o histórico da atividade realizada:'
        }
    ]).then((resp) => {
        const { nomeVendedor, statusFunil, historico } = resp;

        const data = new Date().toLocaleString();

        // garantir pasta Atividades
        if (!fs.existsSync('Atividades')) {
            fs.mkdirSync('Atividades');
        }

        const logAtividade = `log_${Date.now()}.json`;

        const jsonAtividade = {
            nomeVendedor,
            teleLead,
            statusFunil,
            historico,
            data
        };

        fs.writeFileSync(`Atividades/${logAtividade}`, JSON.stringify(jsonAtividade, null, 2));

        // atualizar o histórico no lead
        atualizarHistorico(teleLead, `${data} - ${nomeVendedor}: ${historico}`);
    }).catch(err => console.log(err));
}

function atualizarHistorico(teleLead, historico) {
    const leadObj = getLead(teleLead);

    if (!historico) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente'));
        return menu();
    }

    // acumula histórico (em string, com quebra de linha)
    leadObj.historico = (leadObj.historico || '') + '\n' + historico;

    fs.writeFileSync(`leads/${teleLead}.json`,
        JSON.stringify(leadObj, null, 2)
    );

    console.log(chalk.green('Histórico do lead atualizado com sucesso'));
    menu();
}


function getLead(nomeLead)
{
    const leadJson = fs.readFileSync(`leads/${nomeLead}.json`,{
        //utf-8 para pegar carac.especiais
        encoding: 'utf-8',
        //flag para sinalizar que eu só quero ler o arquivo
        flag:'r'
    }) 

    //tranformar o json em texto(quebra ele em chave e valor)
    return JSON.parse(leadJson)
}

function removerLead()
{
    inquirer.prompt([{
        name:'nomeLead',
        message:'Digte o Lead que deseja remover:'
    }]).then((resp) => {
        const nomeLead = resp.nomeLead

        //se não existe o lead retornop ara a mesma func

        if(!verificaLead(nomeLead))
        {
            return consultarLead()
        }
        const leadObj = getLead(nomeLead)
        if(!leadObj){
            console.log(chalk.bgBlue.black(`ocorreu um erro`))
            return withdraw()
        }
        //remover o arquivo
        inquirer.prompt([{
            type: `confirm`,
            name: `confirmar`,
            message:`deseja remover lead?`

        }]).then((resp)=>{
            if(resp.confirmar == true){
                fs.unlinkSync(`lead/${nomeLead}.json`, function(err){
                    console.log(err)
                })
                console.log(chalk.green(`Lead ${nomeLead} excluido com sucesso`))
            }
        })
        menu()
    }).catch(err=> console.log(err))

}


function nomeSemExtensao(arquivo) {
  return arquivo.split('.').slice(0, -1).join('.');
}

function RelatorioLeads() {
    const caminho = './leads';

    if (!fs.existsSync(caminho)) {
        console.log(chalk.red('Nenhum lead cadastrado ainda.'));
        return menu();
    }

    fs.readdir(caminho, (err, arquivos) => {
        if (err) {
            console.error('Erro ao ler a pasta:', err);
            return menu();
        }

        console.log(chalk.blue('\n=== RELATÓRIO FUNIL DE VENDAS ===\n'));
        arquivos.forEach((arquivo) => {
            const nomeExtenso = nomeSemExtensao(arquivo);
            const leadR = getLead(nomeExtenso);

            console.log(
                chalk.green(
                    `ID: ${leadR.idLead} | Nome: ${leadR.NomeLead} | Tel: ${leadR.TelefoneLead} | Status: ${leadR.StatusLead}`
                )
            );
        });
        console.log(chalk.blue('\n===============================\n'));
        menu();
    });
}