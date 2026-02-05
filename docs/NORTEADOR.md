# Norteador do Projeto (Mapa Geral)

Este documento resume o estado atual do projeto e cria um norte claro para evolução, sem quebrar o app.

## Objetivo

Servir como referência rápida para:
1. Entender a arquitetura e os fluxos principais.
2. Localizar módulos e responsabilidades.
3. Identificar pontos críticos, riscos e próximos passos.

## Visão Geral

Aplicação web de estudo bíblico com foco em:
1. Busca por voz e por texto (com IA).
2. Leitura por livro e capítulo.
3. Experiência premium e rápida.

## Arquitetura (Alto Nível)

Entradas:
1. `index.tsx` inicializa o app.
2. `App.tsx` controla o splash e injeta providers.

Navegação:
1. `contexts/NavigationContext.tsx` define a view atual.
2. `router/AppRouter.tsx` renderiza as telas.

Estado global:
1. `contexts/AppContext.tsx` guarda tema, versão, histórico, favoritos, leitura atual.

## Fluxos Principais

Home:
1. Versículo do dia com cache local.
2. Atalhos para busca, leitura, histórico e quiz.
3. Favoritos (quando existem).
4. Continuar lendo (último capítulo).

Busca IA:
1. Busca local primeiro (via `useBible`).
2. Se não achar, chama Gemini (`services/geminiService.ts`).
3. Resultados entram no histórico e alimentam o slider.

Leitor:
1. Escolha de livro e capítulo.
2. Scroll para versículo específico quando chega por referência.
3. Destaque temporário e opção de destaque permanente.
4. Favoritar versículo (estrela no header).

Favoritos:
1. Persistência local.
2. Exibição na Home com rolagem.

## Persistência Local (localStorage)

Chave `bible_crentech_data`:
1. `history`
2. `theme`
3. `version`
4. `lastReading`
5. `favorites`

Chave `bible_crentech_daily_verse`:
1. `dateKey`
2. `text`
3. `reference`

## Diretórios e Responsabilidades

`components/`:
1. UI principal (`HomeScreen`, `SearchMode`, `ReaderMode`).
2. Layout e modais.

`contexts/`:
1. Estado global e navegação.

`hooks/`:
1. Bíblia local (`useBible`).
2. PWA (`usePWAInstall`).
3. Wake lock (`useWakeLock`).

`services/`:
1. Bíblia local (`BibleService`).
2. IA (`geminiService`).
3. Armazenamento (`StorageService`).

`utils/`:
1. Dados bíblicos e helpers.
2. Áudio e som.

`public/`:
1. JSONs bíblicos e assets.

`docs/`:
1. Documentação técnica e planos.

## Regras Críticas (Não Quebrar o App)

1. Sempre preservar funcionamento atual.
2. Em mudanças de UI, evitar regressão visual.
3. Mudanças de estado global devem ser compatíveis com dados já salvos.
4. Evitar leitura direta dos grandes JSONs (usar scripts).

## Dependências-Chave

1. React 19 + Vite.
2. `@google/genai` para IA.
3. `@supabase/supabase-js` existe, mas hoje está sem uso direto.

## Backlog Sugerido (Curto)

1. Implementar a tela de Histórico real (não placeholder).
2. Favoritos também na Busca IA (estrela nos resultados).
3. Melhorar persistência por usuário (quando houver login).
4. Atualizar README com “Codex da OpenAI” como assistente atual.

## Observações

1. Telas `history` e `quiz` estão como “Em construção”.
2. A busca local usa a base ACF, mesmo quando a versão exibida muda.
3. `utils/supabaseClient.ts` e `utils/pixGenerator.ts` ainda não são usados.

