---
name: run-app
description: Rodar a Bíblia CrenTech e visualizá-la num navegador headless (dev server Vite + playwright-core com o Chromium do sistema)
---

# Rodar e visualizar o app

Receita verificada em 02/07/2026 nesta máquina (não há `chromium-cli`; há `/usr/bin/chromium`).

## 1. Dev server

```bash
npm run dev -- --port 5199 &
timeout 30 bash -c 'until curl -sf http://localhost:5199 >/dev/null; do sleep 1; done'
```

Ao terminar, encerre com `pkill -f "vite --port 5199"` (senão a próxima sessão pega `EADDRINUSE`).

## 2. Driver headless

Instale `playwright-core` **fora do projeto** (scratchpad ou pasta temporária — não adicionar ao package.json):

```bash
cd <scratchpad> && npm init -y && npm i playwright-core
```

Esqueleto do driver (viewport mobile, o formato principal do app):

```js
import { chromium } from 'playwright-core';
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const page = await (await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})).newPage();
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200); // splash -> home é automático
```

## 3. Particularidades do app

- **Navegação é por estado interno, sem rotas de URL.** Para chegar a uma tela,
  clique nos cartões da Home: `page.getByText('Histórico', { exact: true })`,
  `'Quiz'`, `'Ler Bíblia'`, `'Busca IA'`. Não existe deep link.
- **Dados de teste**: gravar no localStorage e recarregar:
  `bible_crentech_data` = `{ history, theme, version, lastReading, favorites }`;
  `bible_crentech_quiz_best` = número. Depois `page.reload()`.
- **Busca por texto sem IA**: na Busca IA, tecla `p` abre o campo; referências
  como `sl 23 1` resolvem localmente (não gastam créditos Groq).
- **Diálogos nativos**: limpar histórico/dados usa `window.confirm` —
  registre `page.on('dialog', d => d.accept())` antes de clicar.
- **Console**: avisos de `navigator.vibrate` bloqueado são benignos; ignore.
