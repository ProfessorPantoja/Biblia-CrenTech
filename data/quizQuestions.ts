export interface QuizQuestion {
    question: string;
    options: string[];
    answerIndex: number;
    reference: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        question: 'Quantos dias e noites choveu no dilúvio?',
        options: ['7', '12', '40', '100'],
        answerIndex: 2,
        reference: 'Gênesis 7:12'
    },
    {
        question: 'Quem foi lançado na cova dos leões?',
        options: ['Daniel', 'José', 'Jeremias', 'Elias'],
        answerIndex: 0,
        reference: 'Daniel 6:16'
    },
    {
        question: 'Qual foi o primeiro milagre de Jesus?',
        options: ['Multiplicar pães', 'Transformar água em vinho', 'Curar um cego', 'Andar sobre o mar'],
        answerIndex: 1,
        reference: 'João 2:1-11'
    },
    {
        question: 'Em qual cidade Jesus nasceu?',
        options: ['Nazaré', 'Jerusalém', 'Belém', 'Cafarnaum'],
        answerIndex: 2,
        reference: 'Mateus 2:1'
    },
    {
        question: 'Qual discípulo traiu Jesus?',
        options: ['Pedro', 'Tomé', 'João', 'Judas Iscariotes'],
        answerIndex: 3,
        reference: 'Mateus 26:14-16'
    },
    {
        question: 'Quantos livros tem o Novo Testamento?',
        options: ['27', '39', '66', '12'],
        answerIndex: 0,
        reference: 'Estrutura da Bíblia'
    },
    {
        question: 'Quem escreveu a maior parte dos Salmos?',
        options: ['Salomão', 'Davi', 'Moisés', 'Asafe'],
        answerIndex: 1,
        reference: 'Salmos'
    },
    {
        question: 'Qual mar se abriu para o povo de Israel passar?',
        options: ['Mar da Galileia', 'Mar Morto', 'Mar Vermelho', 'Mar Mediterrâneo'],
        answerIndex: 2,
        reference: 'Êxodo 14:21-22'
    },
    {
        question: 'Quem foi engolido por um grande peixe?',
        options: ['Pedro', 'Jonas', 'Paulo', 'Noé'],
        answerIndex: 1,
        reference: 'Jonas 1:17'
    },
    {
        question: 'Qual apóstolo negou Jesus três vezes?',
        options: ['Judas', 'Tiago', 'Pedro', 'André'],
        answerIndex: 2,
        reference: 'Lucas 22:54-62'
    },
    {
        question: 'Quem recebeu as tábuas da Lei no monte Sinai?',
        options: ['Arão', 'Josué', 'Abraão', 'Moisés'],
        answerIndex: 3,
        reference: 'Êxodo 31:18'
    },
    {
        question: 'Qual era a profissão de Pedro antes de seguir Jesus?',
        options: ['Pescador', 'Carpinteiro', 'Cobrador de impostos', 'Pastor de ovelhas'],
        answerIndex: 0,
        reference: 'Mateus 4:18'
    },
    {
        question: 'Quem derrotou o gigante Golias?',
        options: ['Saul', 'Davi', 'Sansão', 'Gideão'],
        answerIndex: 1,
        reference: '1 Samuel 17:48-50'
    },
    {
        question: 'Quantos discípulos Jesus escolheu como apóstolos?',
        options: ['7', '10', '12', '70'],
        answerIndex: 2,
        reference: 'Lucas 6:13'
    },
    {
        question: 'O que Deus criou no primeiro dia?',
        options: ['Os animais', 'A luz', 'O homem', 'As estrelas'],
        answerIndex: 1,
        reference: 'Gênesis 1:3'
    },
    {
        question: 'Qual era o nome da esposa de Abraão?',
        options: ['Rebeca', 'Raquel', 'Sara', 'Lia'],
        answerIndex: 2,
        reference: 'Gênesis 17:15'
    },
    {
        question: 'Quem escreveu o livro do Apocalipse?',
        options: ['Paulo', 'Pedro', 'Tiago', 'João'],
        answerIndex: 3,
        reference: 'Apocalipse 1:1'
    },
    {
        question: 'Em qual rio Jesus foi batizado?',
        options: ['Rio Nilo', 'Rio Jordão', 'Rio Eufrates', 'Rio Tigre'],
        answerIndex: 1,
        reference: 'Mateus 3:13'
    },
    {
        question: 'Quem batizou Jesus?',
        options: ['João Batista', 'Pedro', 'Nicodemos', 'José'],
        answerIndex: 0,
        reference: 'Mateus 3:13-17'
    },
    {
        question: 'Qual cidade teve as muralhas derrubadas ao som de trombetas?',
        options: ['Babilônia', 'Nínive', 'Jericó', 'Sodoma'],
        answerIndex: 2,
        reference: 'Josué 6:20'
    },
    {
        question: 'Quem foi o homem mais forte da Bíblia?',
        options: ['Golias', 'Sansão', 'Davi', 'Caleb'],
        answerIndex: 1,
        reference: 'Juízes 16'
    },
    {
        question: 'Qual mulher se tornou rainha e salvou o povo judeu?',
        options: ['Rute', 'Débora', 'Ester', 'Ana'],
        answerIndex: 2,
        reference: 'Ester 4:14'
    },
    {
        question: 'Quantas pragas Deus enviou sobre o Egito?',
        options: ['7', '10', '12', '3'],
        answerIndex: 1,
        reference: 'Êxodo 7-12'
    },
    {
        question: 'Quem sonhou com uma escada que ligava a terra ao céu?',
        options: ['José', 'Daniel', 'Jacó', 'Salomão'],
        answerIndex: 2,
        reference: 'Gênesis 28:12'
    },
    {
        question: 'O que Jesus multiplicou para alimentar cinco mil pessoas?',
        options: ['Pães e peixes', 'Trigo e vinho', 'Frutas e mel', 'Água e sal'],
        answerIndex: 0,
        reference: 'João 6:9-13'
    },
    {
        question: 'Quem era o irmão de Moisés?',
        options: ['Josué', 'Arão', 'Calebe', 'Ur'],
        answerIndex: 1,
        reference: 'Êxodo 4:14'
    },
    {
        question: 'Qual salmo começa com "O Senhor é o meu pastor"?',
        options: ['Salmo 1', 'Salmo 91', 'Salmo 23', 'Salmo 119'],
        answerIndex: 2,
        reference: 'Salmos 23:1'
    },
    {
        question: 'Qual era o nome de Paulo antes da sua conversão?',
        options: ['Silas', 'Barnabé', 'Estêvão', 'Saulo'],
        answerIndex: 3,
        reference: 'Atos 13:9'
    },
    {
        question: 'Quantos anos o povo de Israel vagou pelo deserto?',
        options: ['7', '20', '40', '70'],
        answerIndex: 2,
        reference: 'Números 14:33-34'
    },
    {
        question: 'Quem foi levado ao céu numa carruagem de fogo?',
        options: ['Eliseu', 'Elias', 'Enoque', 'Isaías'],
        answerIndex: 1,
        reference: '2 Reis 2:11'
    },
    {
        question: 'Qual discípulo só creu na ressurreição depois de ver Jesus?',
        options: ['Tomé', 'Filipe', 'Bartolomeu', 'Mateus'],
        answerIndex: 0,
        reference: 'João 20:24-29'
    },
    {
        question: 'O que significa o nome "Emanuel"?',
        options: ['Deus é fiel', 'Deus conosco', 'Deus proverá', 'Deus é amor'],
        answerIndex: 1,
        reference: 'Mateus 1:23'
    },
    {
        question: 'Qual é o último livro da Bíblia?',
        options: ['Judas', 'Malaquias', 'Apocalipse', 'Hebreus'],
        answerIndex: 2,
        reference: 'Estrutura da Bíblia'
    },
    {
        question: 'Qual é o primeiro livro da Bíblia?',
        options: ['Êxodo', 'Gênesis', 'Salmos', 'Mateus'],
        answerIndex: 1,
        reference: 'Estrutura da Bíblia'
    },
    {
        question: 'Quem construiu a arca antes do dilúvio?',
        options: ['Moisés', 'Abraão', 'Noé', 'Matusalém'],
        answerIndex: 2,
        reference: 'Gênesis 6:13-22'
    },
    {
        question: 'Qual profeta ungiu Davi como rei de Israel?',
        options: ['Natã', 'Samuel', 'Elias', 'Isaías'],
        answerIndex: 1,
        reference: '1 Samuel 16:13'
    },
    {
        question: 'Onde Adão e Eva viviam antes da queda?',
        options: ['Monte Sinai', 'Canaã', 'Jardim do Éden', 'Mesopotâmia'],
        answerIndex: 2,
        reference: 'Gênesis 2:8'
    },
    {
        question: 'Qual apóstolo era cobrador de impostos?',
        options: ['Mateus', 'Marcos', 'Lucas', 'João'],
        answerIndex: 0,
        reference: 'Mateus 9:9'
    },
    {
        question: 'Quem interpretou os sonhos do faraó no Egito?',
        options: ['Daniel', 'Moisés', 'José', 'Jacó'],
        answerIndex: 2,
        reference: 'Gênesis 41:15-16'
    },
    {
        question: 'Qual rei ficou conhecido pela sua grande sabedoria?',
        options: ['Davi', 'Salomão', 'Saul', 'Ezequias'],
        answerIndex: 1,
        reference: '1 Reis 3:12'
    }
];
