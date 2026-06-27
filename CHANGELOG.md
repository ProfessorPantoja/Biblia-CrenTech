# CHANGELOG - Bíblia CrenTech
> Registro de todas as modificações feitas no projeto

---

## 📅 Sessão: 26/06/2026 (retomada do projeto)

> Contexto: retomada após o projeto ficar parado desde nov/2025. Antes das
> mudanças foi feita uma auditoria técnica (ver `docs/RELATORIO_RETOMADA_2026-06-26.html`).

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
