# 🔒 FEATURES APROVADAS E INTOCÁVEIS

> **ATENÇÃO:** Este arquivo controla o que está PRONTO, FUNCIONANDO e APROVADO.  
> **NÃO ALTERE** nenhuma feature marcada com ✅ sem autorização explícita do usuário.

---

## 📋 Como Usar Este Arquivo

- [ ] = Feature **NÃO aprovada** (pode ser alterada livremente)
- [x] = Feature **APROVADA** e **INTOCÁVEL** (não modificar sem permissão)

**Marque as caixinhas** clicando nelas no VS Code para aprovar features.

---

## 🎯 CORE - Funcionalidades Principais

### Integração com IA
- [ ] **Google Gemini 2.5 Flash** - Busca semântica de versículos
- [ ] **Processamento de Áudio** - Transcrição de voz para texto
- [ ] **Busca por Tema** - Busca inteligente por palavras-chave
- [ ] **Contexto Estendido** - Exibição de versículos anteriores/posteriores
- [ ] **Hermenêutica** - Análise profunda do texto bíblico

### Entrada de Dados
- [ ] **Gravação de Voz** - Botão de microfone com feedback visual
- [ ] **Busca por Texto** - Campo de busca com autocomplete
- [ ] **Autocomplete de Livros** - Sugestões de livros bíblicos ao digitar
- [ ] **Temas Frequentes** - Botões rápidos (Amor, Fé, Paz, etc.)

### Versões Bíblicas
- [ ] **ACF** - Almeida Corrigida Fiel
- [ ] **NVI** - Nova Versão Internacional
- [ ] **ARC** - Almeida Revista e Corrigida
- [ ] **NBV** - Nova Bíblia Viva
- [ ] **BAM** - Bíblia Ave Maria
- [ ] **TNM** - Tradução do Novo Mundo
- [ ] **NTLH** - Nova Tradução na Linguagem de Hoje

---

## 🎨 INTERFACE & UX

### Layout e Componentes
- [ ] **Header** - Logo, seletor de versão, botões de ação
- [ ] **Footer** - Créditos, botão de feedback, controle de som
- [ ] **Splash Screen** - Tela de introdução (7 segundos)
- [ ] **History Slider** - Barra lateral com histórico de buscas
- [ ] **Donation Ticker** - Banner flutuante de doação

### Modais
- [ ] **Modal Sobre** - Informações do projeto e instruções
- [ ] **Modal Doação** - QR Code PIX com valores sugeridos
- [ ] **Modal Temas** - Seletor de temas visuais

### Temas Visuais
- [ ] **Hi-Tech** - Tema tecnológico (padrão)
- [ ] **Jesus** - Tema cristão tradicional
- [ ] **Kids** - Tema infantil
- [ ] **Católico** - Tema católico
- [ ] **Pentecostal** - Tema pentecostal

### Responsividade
- [ ] **Mobile First** - Design otimizado para celular
- [ ] **Tablet** - Adaptação para tablets
- [ ] **Desktop** - Layout para telas grandes

---

## 🔧 FUNCIONALIDADES TÉCNICAS

### Áudio e Som
- [ ] **Sound Engine** - Sistema de efeitos sonoros
- [ ] **Controle de Mute** - Botão para silenciar sons
- [ ] **Feedback Sonoro** - Sons para ações (click, success, error)

### Armazenamento
- [ ] **LocalStorage** - Salvar histórico, tema e versão
- [ ] **Histórico (50 itens)** - Últimas 50 buscas salvas
- [ ] **Persistência de Tema** - Tema selecionado é mantido

### PWA e SEO
- [ ] **Manifest.json** - Configuração PWA básica
- [ ] **Meta Tags SEO** - Title, description, keywords
- [ ] **Open Graph** - Tags para compartilhamento social
- [ ] **Favicon** - Logo como ícone do site
- [ ] **Theme Color** - Cor do tema (#450a0a - Vinho Escuro)

### Analytics
- [ ] **Google Analytics** - Rastreamento de uso

---

## 💰 DOAÇÃO E MONETIZAÇÃO

### Sistema PIX
- [ ] **QR Code Real** - Gerado com react-qr-code
- [ ] **Código PIX Fixo** - Código universal válido
- [ ] **Botões de Valor** - R$ 5, 10, 20, 50, 100, Outro
- [ ] **Copiar Código** - Botão com feedback "Copiado!"
- [ ] **Chave PIX** - +55279926819595

---

## 📧 CONTATO E SUPORTE

### Informações de Contato
- [ ] **Email de Feedback** - artpantoja@gmail.com
- [ ] **Desenvolvedor** - Fabio Pantoja
- [ ] **Canal** - Canal CrenTech

---

## 📁 ARQUITETURA DO CÓDIGO

### Estrutura de Componentes
- [ ] **App.tsx** - Componente principal (refatorado)
- [ ] **RecorderButton.tsx** - Botão de gravação de voz
- [ ] **VerseDisplay.tsx** - Exibição de versículos
- [ ] **Features.tsx** - Botões de ação (Contexto, Hermenêutica, Copiar)

### Layout Components
- [ ] **Header.tsx** - Cabeçalho modular
- [ ] **Footer.tsx** - Rodapé modular
- [ ] **HistorySlider.tsx** - Histórico lateral
- [ ] **DonationTicker.tsx** - Banner de doação

### Modal Components
- [ ] **AboutModal.tsx** - Modal "Sobre"
- [ ] **DonateModal.tsx** - Modal de doação
- [ ] **ThemeModal.tsx** - Modal de temas

### Configuração
- [ ] **constants.tsx** - Temas e temas frequentes
- [ ] **types.ts** - Tipos TypeScript
- [ ] **soundEngine.ts** - Motor de som

### Serviços
- [ ] **geminiService.ts** - Integração com Gemini API
- [ ] **bibleData.ts** - Dados dos livros bíblicos

---

## 🚀 BUILD E DEPLOY

### Configuração
- [ ] **Vite** - Build tool
- [ ] **TypeScript** - Tipagem estática
- [ ] **Tailwind CSS** - Framework CSS
- [ ] **React 19** - Framework principal

### Variáveis de Ambiente
- [ ] **GEMINI_API_KEY** - Chave da API do Gemini

---

## 📝 NOTAS IMPORTANTES

### Últimas Alterações Aprovadas
- Email de contato atualizado para: `artpantoja@gmail.com`
- Sistema PIX simplificado com código fixo
- QR Code real implementado com `react-qr-code`
- Modal de doação redesenhado com valores sugeridos

### Pendências Conhecidas
- Nenhuma no momento

---

**Última Atualização:** 27/11/2024 16:20  
**Versão do Projeto:** 2.0
