// ==========================================
// 1. BANCO DE DADOS INICIAL (LocalStorage)
// ==========================================
const dadosIniciais = {
    planos: [
        { id: 'diaria', nome: 'Diária', preco: 20 },
        { id: 'mensal', nome: 'Mensal', preco: 90 },
        { id: 'anual', nome: 'Anual', preco: 800 }
    ],
    atividades: [
        { id: 'karate', nome: 'Karatê', preco: 50 },
        { id: 'muay-thai', nome: 'Muay Thai', preco: 60 }
    ],
    alunos: [
        { id: 1, nome: 'Carlos Silva', apelido: 'carlos', plano: 'mensal', atividade: 'karate', status: 'pago', senha: '123' },
        { id: 2, nome: 'Ana Costa', apelido: 'ana', plano: 'anual', atividade: 'nenhuma', status: 'atrasado', senha: '123' }
    ]
};

// Garante que o banco de dados exista no navegador do usuário
if (!localStorage.getItem('academia_db')) {
    localStorage.setItem('academia_db', JSON.stringify(dadosIniciais));
}

// Funções para ler e salvar as informações
function obterDados() {
    return JSON.parse(localStorage.getItem('academia_db'));
}

function salvarDados(dados) {
    localStorage.setItem('academia_db', JSON.stringify(dados));
}

// ==========================================
// 2. FUNÇÕES DA TELA DE CADASTRO
// ==========================================
function cadastrarAluno(nome, apelido, plano, atividade, senha) {
    const db = obterDados();
    
    // Evita apelidos repetidos ou iguais ao do administrador
    const apelidoExiste = db.alunos.some(aluno => aluno.apelido.toLowerCase() === apelido.toLowerCase());
    if (apelidoExiste || apelido.toLowerCase() === 'admin') {
        alert('Este apelido já está em uso. Escolha outro!');
        return false;
    }

    const novoAluno = {
        id: db.alunos.length > 0 ? Math.max(...db.alunos.map(a => a.id)) + 1 : 1,
        nome: nome,
        apelido: apelido,
        plano: plano,
        atividade: atividade,
        senha: senha,
        status: 'pago' // Todo aluno inicia regularizado
    };

    db.alunos.push(novoAluno);
    salvarDados(db);
    return true;
}

// ==========================================
// 3. FUNÇÕES DO PAINEL ADMINISTRATIVO
// ==========================================

// Calcula todas as métricas financeiras dinamicamente
function calcularMetricasAdmin() {
    const db = obterDados();
    let valorTotalPago = 0;
    let valorAtrasado = 0;
    let valorPotencial = 0;

    db.alunos.forEach(aluno => {
        const dadosPlano = db.planos.find(p => p.id === aluno.plano);
        const precoPlano = dadosPlano ? dadosPlano.preco : 0;

        const dadosAtv = db.atividades.find(a => a.id === aluno.atividade);
        const precoAtv = dadosAtv ? dadosAtv.preco : 0;

        const totalAluno = precoPlano + precoAtv;

        valorPotencial += totalAluno;
        if (aluno.status === 'pago') {
            valorTotalPago += totalAluno;
        } else if (aluno.status === 'atrasado') {
            valorAtrasado += totalAluno;
        }
    });

    return {
        totalAlunos: db.alunos.length,
        valorTotalPago,
        valorAtrasado,
        valorPotencial
    };
}

// Adiciona uma nova modalidade/atividade extra
function adicionarAtividade(nome, preco) {
    const db = obterDados();
    const id = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    db.atividades.push({ id, nome, preco: parseFloat(preco) });
    salvarDados(db);
}

// Altera o preço de um plano (Diária, Mensal, Anual)
function atualizarPrecoPlano(idPlano, novoPreco) {
    const db = obterDados();
    const plano = db.planos.find(p => p.id === idPlano);
    if (plano) {
        plano.preco = parseFloat(novoPreco);
        salvarDados(db);
    }
}

// Altera o preço de uma atividade extra
function atualizarPrecoAtv(idAtv, novoPreco) {
    const db = obterDados();
    const atv = db.atividades.find(a => a.id === idAtv);
    if (atv) {
        atv.preco = parseFloat(novoPreco);
        salvarDados(db);
    }
}

// Exclui um aluno permanentemente do sistema
function removerAluno(idAluno) {
    const db = obterDados();
    db.alunos = db.alunos.filter(aluno => aluno.id !== idAluno);
    salvarDados(db);
}

// ==========================================
// 4. FUNÇÕES DA ÁREA DO ALUNO
// ==========================================
function atualizarPerfilAluno(idAluno, novoPlano, novaAtividade) {
    const db = obterDados();
    const aluno = db.alunos.find(a => a.id === idAluno);
    if (aluno) {
        aluno.plano = novoPlano;
        aluno.atividade = novaAtividade;
        salvarDados(db);
        return true;
    }
    return false;
}
