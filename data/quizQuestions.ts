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
    },
    {
        question: 'Quem foi vendido pelos próprios irmãos como escravo?',
        options: ['Benjamim', 'José', 'Judá', 'Isaque'],
        answerIndex: 1,
        reference: 'Gênesis 37:28'
    },
    {
        question: 'Qual profeta desafiou os profetas de Baal no monte Carmelo?',
        options: ['Eliseu', 'Jeremias', 'Elias', 'Amós'],
        answerIndex: 2,
        reference: '1 Reis 18:20-39'
    },
    {
        question: 'Quem era a sogra de Rute?',
        options: ['Noemi', 'Orfa', 'Ana', 'Débora'],
        answerIndex: 0,
        reference: 'Rute 1:4'
    },
    {
        question: 'Qual apóstolo andou sobre as águas em direção a Jesus?',
        options: ['João', 'Tiago', 'André', 'Pedro'],
        answerIndex: 3,
        reference: 'Mateus 14:29'
    },
    {
        question: 'Quem escreveu a carta aos Romanos?',
        options: ['Pedro', 'Paulo', 'Tiago', 'João'],
        answerIndex: 1,
        reference: 'Romanos 1:1'
    },
    {
        question: 'Quantos evangelhos existem no Novo Testamento?',
        options: ['3', '4', '5', '12'],
        answerIndex: 1,
        reference: 'Mateus, Marcos, Lucas e João'
    },
    {
        question: 'O que os magos ofereceram ao menino Jesus?',
        options: ['Ouro, incenso e mirra', 'Prata, ouro e trigo', 'Pães, vinho e azeite', 'Ovelhas e pombas'],
        answerIndex: 0,
        reference: 'Mateus 2:11'
    },
    {
        question: 'Em qual dia Deus descansou da criação?',
        options: ['Terceiro', 'Sexto', 'Sétimo', 'Primeiro'],
        answerIndex: 2,
        reference: 'Gênesis 2:2'
    },
    {
        question: 'Quem foi o primeiro rei de Israel?',
        options: ['Davi', 'Salomão', 'Samuel', 'Saul'],
        answerIndex: 3,
        reference: '1 Samuel 10:1'
    },
    {
        question: 'Qual mulher escondeu os espias israelitas em Jericó?',
        options: ['Raabe', 'Ester', 'Míriam', 'Séfora'],
        answerIndex: 0,
        reference: 'Josué 2:1-6'
    },
    {
        question: 'Que alimento Deus enviou do céu ao povo no deserto?',
        options: ['Pão de cevada', 'Maná', 'Trigo', 'Mel'],
        answerIndex: 1,
        reference: 'Êxodo 16:14-15'
    },
    {
        question: 'Quem foi curado da lepra ao mergulhar sete vezes no Jordão?',
        options: ['Uzias', 'Geazi', 'Naamã', 'Ezequias'],
        answerIndex: 2,
        reference: '2 Reis 5:14'
    },
    {
        question: 'Qual discípulo é chamado de "o discípulo amado"?',
        options: ['Pedro', 'João', 'Tiago', 'Mateus'],
        answerIndex: 1,
        reference: 'João 13:23'
    },
    {
        question: 'Quem apareceu conversando com Jesus na transfiguração?',
        options: ['Abraão e Davi', 'Moisés e Elias', 'Enoque e Noé', 'Isaías e Jeremias'],
        answerIndex: 1,
        reference: 'Mateus 17:3'
    },
    {
        question: 'Qual era o ofício de José, esposo de Maria?',
        options: ['Pescador', 'Pastor', 'Carpinteiro', 'Ferreiro'],
        answerIndex: 2,
        reference: 'Mateus 13:55'
    },
    {
        question: 'Quantos dias Jesus jejuou no deserto?',
        options: ['7', '21', '30', '40'],
        answerIndex: 3,
        reference: 'Mateus 4:2'
    },
    {
        question: 'O que aconteceu no dia de Pentecostes?',
        options: ['A descida do Espírito Santo', 'A ressurreição de Jesus', 'A conversão de Paulo', 'A queda de Jericó'],
        answerIndex: 0,
        reference: 'Atos 2:1-4'
    },
    {
        question: 'Quem foi a mãe do profeta Samuel?',
        options: ['Ana', 'Raquel', 'Rebeca', 'Isabel'],
        answerIndex: 0,
        reference: '1 Samuel 1:20'
    },
    {
        question: 'Quem olhou para trás e virou uma estátua de sal?',
        options: ['A mulher de Noé', 'A mulher de Ló', 'Míriam', 'A mulher de Jó'],
        answerIndex: 1,
        reference: 'Gênesis 19:26'
    },
    {
        question: 'Quem Jesus ressuscitou depois de quatro dias no túmulo?',
        options: ['A filha de Jairo', 'O filho da viúva de Naim', 'Lázaro', 'Tabita'],
        answerIndex: 2,
        reference: 'João 11:43-44'
    }
];
