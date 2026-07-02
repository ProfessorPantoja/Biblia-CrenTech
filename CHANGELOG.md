# CHANGELOG - Bíblia CrenTech
> Registro de todas as modificações feitas no projeto

---

## 📅 Sessão: 02/07/2026 — parte 2 (trabalho autônomo autorizado, com push)

> Escolhido o que não depende de configuração do usuário. Commits atômicos;
> reverter um item isolado: `git revert <hash>`.

### 🔗 1. Rotas de URL com hash (`626de43`)

- ✅ A URL espelha a navegação: `#/home`, `#/busca`, `#/historico`, `#/quiz`
- ✅ Leitor mantém a posição: `#/leitor/João/3` (link compartilhável)
- ✅ Deep link com versículo: `#/leitor/João/3/16` abre destacado
- ✅ **Botão voltar do navegador/Android agora funciona** (antes saía do app)

### 🖼️ 2. Card de versículo em imagem (`42c31f7`)

- ✅ PNG 1080x1920 (story) gerado no aparelho via canvas, sem dependências
- ✅ Identidade do app: fundo escuro, serifa, dourado, marca no rodapé
- ✅ Compartilhar (Web Share API com arquivo) ou Baixar
- ✅ Entradas: ícone no Versículo do Dia (Home) e nas ações do resultado da Busca IA

### 🎮 3. Quiz: 40 → 60 perguntas (`807bc33`)

- ✅ +20 questões com referência bíblica, validadas por script
  (4 opções únicas, sem duplicatas)

### 🧰 4. Skill de projeto `run-app` (`2d98670`)

- ✅ Receita para o Claude Code rodar e visualizar o app em sessões futuras
  (não existe `chromium-cli` público; usamos playwright-core + Chromium do sistema)

**Não feito por depender do usuário**: backend para a chave Groq (precisa de
env var no painel da Vercel) e sincronização Supabase (precisa da Fase 1 do
login). São os próximos da fila.

---

## 📅 Sessão: 02/07/2026 (aprimoramentos — fim dos "Em Construção")

> Todos os commits são atômicos e reversíveis individualmente com
> `git revert <hash>`. Relatório completo: `docs/RELATORIO_MELHORIAS_2026-07-02.html`.

### 🐛 1. Correção crítica: dados apagados ao recarregar (`cc3a173`)

**Sintoma**: histórico, favoritos e última leitura se perdiam ao recarregar o app
(por isso a barra de histórico "sumia").

**Causa**: o `AppContext` carregava o localStorage num `useEffect`, mas o efeito
de salvar rodava antes com o estado vazio e sobrescrevia os dados.

**Correção**: os dados agora são carregados de forma síncrona nos inicializadores
de estado (sem corrida).

### 🕘 2. Tela de Histórico real (`905c2c9`)

- ✅ Substitui o placeholder "Em Construção" do cartão da Home
- ✅ Lista os versículos buscados (mais recentes primeiro)
- ✅ Tocar num item abre o leitor no versículo, com destaque
- ✅ Remover item individual, copiar tudo, limpar tudo (com confirmação)
- ✅ Estado vazio com atalho para a Busca IA

### 🎮 3. Quiz Bíblico offline (`849617f`)

- ✅ Substitui o último "Em Construção" do app
- ✅ Banco local com 40 perguntas (`data/quizQuestions.ts`) — fácil de expandir
- ✅ Rodadas de 10 perguntas sorteadas, alternativas embaralhadas
- ✅ Feedback imediato com a referência bíblica de cada resposta
- ✅ Placar, barra de progresso e recorde salvo no aparelho

### ⭐ 4. Favoritar na Busca IA (`c2873c5`)

- ✅ Estrela na linha de ações do resultado (junto de ouvir/copiar)
- ✅ Integrada aos mesmos favoritos do leitor e da Home

### 📊 5. Progresso real em "Continuar lendo" (`6b52d3e`)

- ✅ A barra ficava sempre 100%; agora mostra capítulo atual / total do livro
  (ex.: João 12 → "57% do livro")

### 🧹 6. Botão de limpar dados (`2ffe2bb`)

- ✅ Pedido antigo do FEATURES_APROVADAS (localStorage acumulava sem reset)
- ✅ No modal da conta (avatar da Home): "Limpar dados do app neste aparelho"
- ✅ Confirmação antes de apagar; recarrega o app limpo

**Próximos passos sugeridos**: sincronizar favoritos/histórico com o Supabase
quando logado (Fase 3 do login), melhorar temas Kids/Católico/Pentecostal,
revisar sons (reclamações registradas no FEATURES_APROVADAS).

---

## 📅 Sessão: 26/06/2026 (retomada do projeto)

> Contexto: retomada após o projeto ficar parado desde nov/2025. Antes das
> mudanças foi feita uma auditoria técnica (ver `docs/RELATORIO_RETOMADA_2026-06-26.html`).

### 🔐 6. Login com Google (Fase 2 de 3 — autenticação)

> Decisão: Supabase Auth + Google, login **opcional** (app funciona sem conta).

- ✅ `contexts/AuthContext.tsx` (sessão, signInWithGoogle, signOut)
- ✅ `components/modals/AuthModal.tsx` (entrar / ver perfil / sair)
- ✅ Avatar da Home virou botão de login; mostra foto e nome quando logado
- ✅ `AuthProvider` no topo da árvore de contextos
- ✅ Guia de configuração: `docs/GUIA_LOGIN_GOOGLE.html`

**Pendente**:
- Fase 1 (config do usuário): credenciais OAuth no Google + provider no Supabase
  + SQL da tabela `user_data` (ver o guia).
- Fase 3 (código): sincronizar favoritos/histórico/preferências/última leitura.

### 💸 5. Voz: Whisper turbo (mais barato)

- ✅ Default da transcrição mudou para `whisper-large-v3-turbo` (multilíngue,
  ~2-3x mais barato que o `large-v3`, ideal para economizar créditos)

### 🐛 4. Correção: leitor mostrava capítulo errado ao falhar o carregamento

**Sintoma**: ao abrir um livro não cacheado estando offline (ex.: "1 Coríntios"),
o cabeçalho atualizava mas o texto continuava o do capítulo anterior (Gênesis).

**Causa**: no `ReaderMode`, quando `getVerses` falhava (retornava null), o
conteúdo anterior não era limpo.

**Correção** (`components/ReaderMode.tsx`):
- ✅ Sempre reflete o resultado (`setChapterContent(verses ?? [])`)
- ✅ Mensagem clara quando o capítulo não carrega (com dica sobre offline)

### 🔄 1. Migração da IA: Gemini → Groq

**Motivo**: troca de provedor de IA.

- ✅ Removido `@google/genai` e o `services/geminiService.ts`
- ✅ Criado `services/groqService.ts` com as mesmas 4 funções
  (busca por tema, busca por voz, contexto, hermenêutica)
- ✅ Busca por voz agora usa **Whisper do Groq** (transcrição) + modelo de texto
- ✅ Chave passa a ser `VITE_GROQ_API_KEY` (não é mais injetada no bundle)
- ✅ Adicionado `.env.example` e `vite-env.d.ts` (este zerou os 5 erros de type-check)

**Pendência**: colar a chave real do Groq em `.env.local` para a IA voltar a funcionar.

### 🎨 2. Tailwind: CDN → build

- ✅ Saiu do `cdn.tailwindcss.com`; agora `tailwindcss` v3 + PostCSS no build
- ✅ `tailwind.config.js`, `postcss.config.js` e `index.css` (corrige o 404 do index.css)
- ✅ CSS gerado e purgado no build (~8 kB gzip)

### 📴 3. PWA offline (Service Worker)

- ✅ Adicionado `vite-plugin-pwa` (Workbox), `registerType: autoUpdate`
- ✅ App shell em precache; JSONs da Bíblia em runtime cache (CacheFirst)
- ✅ Manifest passa a ser gerado pelo plugin (removido `public/manifest.json`)

**Próximos passos sugeridos**: proteger a chave da IA via backend (Vercel Functions),
implementar a tela de Histórico, favoritos na Busca IA.

---

## 📅 Sessão: 28/11/2025 (11:12 - 13:23)

### ✅ 1. Integração da Bíblia Offline (Lazy Loading)

**Problema**: Arquivo JSON único muito grande (1M+ tokens)

**Solução Implementada**:
- ✅ Baixada Bíblia ACF completa do repositório `thiagobodruk/biblia`
- ✅ Criado script [`scripts/splitBible.js`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/scripts/splitBible.js)
  - Divide a Bíblia em **66 arquivos JSON** (um por livro)
  - Salva em `public/bible/` (ex: `gn.json`, `ap.json`)
  - Gera `index.json` com metadados dos livros

**Benefícios**:
- ⚡ Carregamento instantâneo (apenas o livro necessário)
- 📴 Funciona offline
- 💰 Economiza tokens da IA

---

### ✅ 2. Serviço de Leitura Local

**Arquivos Criados**:
- [`services/BibleService.ts`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/services/BibleService.ts)
  - `loadBook(abbrev)`: Carrega livro específico
  - `getChapter(book, chapter)`: Retorna versículos do capítulo
  - Cache em memória para performance

- [`hooks/useBible.ts`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/hooks/useBible.ts)
  - Hook React para usar o serviço
  - `parseReference()`: Interpreta referências bíblicas
  - `getVerses()`: Busca versículos localmente

**Arquivos Modificados**:
- [`App.tsx`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/App.tsx)
  - Integrado `useBible` hook
  - Prioriza busca local antes da IA
  - Exemplo: "João 3:16" → busca no JSON local primeiro

---

### ✅ 3. Supabase - Banco de Dados

**Projeto Criado**:
- Nome: `biblia-crentech`
- Região: `sa-east-1` (São Paulo)
- Custo: $0/mês (plano gratuito)
- Status: ✅ Ativo

**Configuração**:
- ✅ Chaves salvas em [`.env.local`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/.env.local)
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- ✅ Cliente criado em [`utils/supabaseClient.ts`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/utils/supabaseClient.ts)
- ✅ Biblioteca instalada: `@supabase/supabase-js`

**Uso Futuro**: Salvar histórico, preferências, sincronização

---

### ✅ 4. Busca Flexível (Regex Robusto)

**Problema**: Busca só aceitava formato rígido "ap 11:4"

**Solução**: Regex super flexível aceita:
- `ap 11.4` (ponto)
- `ap 11:4` (dois pontos)
- `ap11.4` (sem espaço)
- `ap11:4` (sem espaço, dois pontos)
- `ap 11 4` (espaço)
- `apocalipse 11.4` (nome completo)
- `AP  11 . 4` (espaços extras)

**Arquivo Modificado**: [`hooks/useBible.ts`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/hooks/useBible.ts)
- Normalização de entrada
- Regex: `/^(\d?\s?[a-zà-ÿ]+)\s*(\d+)\s*[.:\s]\s*(\d+)(?:\s*[-–]\s*(\d+))?$/`

---

### ✅ 5. UX - Botão Voltar no Modal PIX

**Arquivo Modificado**: [`components/modals/DonateModal.tsx`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/components/modals/DonateModal.tsx)
- Adicionado ícone `ArrowLeft` no canto superior esquerdo
- Melhora navegação intuitiva

---

### ✅ 6. Documentação de Segurança

**Arquivo Criado**: [`GEMINI.md`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/GEMINI.md)
- Regras para a IA não ler arquivos grandes
- Previne travamento por excesso de tokens

### ✅ 7. Atalhos de Teclado (Produtividade)

**Arquivo Modificado**: [`App.tsx`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/App.tsx)
- **P**: Abrir Pesquisa (foca automaticamente)
- **S**: Abrir "Sobre"
- **D**: Abrir "Doação" (PIX)
- **T**: Abrir "Temas" (Sugestão adicionada)
- **ESC**: Fecha qualquer modal ou pesquisa

### 🔒 8. Controle de Versão (Limitação Offline)

**Arquivo Modificado**: [`App.tsx`](file:///d:/01_PROJETOS_ATIVOS/Biblia CrenTech/bíblia-crentech-legado/App.tsx)
- **Restrição**: Apenas a versão **ACF** está disponível no momento.
- **Feedback**: Ao tentar mudar para NVI, ARC, etc., o sistema exibe um alerta explicativo e reverte para ACF.

---

## 📊 Resumo Técnico

| Categoria | Ação | Status |
|-----------|------|--------|
| **Dados** | Bíblia ACF dividida em 66 arquivos | ✅ |
| **Performance** | Lazy loading implementado | ✅ |
| **Backend** | Supabase conectado | ✅ |
| **Busca** | Regex flexível (7+ formatos) | ✅ |
| **UX** | Botão voltar no PIX | ✅ |
| **UX** | Atalhos de Teclado (P, S, D, T, Esc) | ✅ |
| **Docs** | Regras de segurança | ✅ |

---

## 🔜 Próximos Passos Sugeridos

- [ ] Criar tabelas no Supabase (histórico, preferências)
- [ ] Implementar sincronização de histórico
- [ ] Testar busca offline
- [ ] Adicionar analytics de uso

---

**Última Atualização**: 28/11/2025 13:23
