# AI Rules

> [!IMPORTANT]
> **DO NOT READ** the following files as they are extremely large and will exhaust the context window:
> - `public/bible/acf.json`
> - `Bible/acf.json` (or any large JSON in that folder)
>
> If you need to manipulate these files, use scripts (Node.js/Python) or shell commands. NEVER use `view_file` on them.

# Prioridade Absoluta

> [!IMPORTANT]
> **NÃO PODE QUEBRAR O APP.**
> Qualquer alteração deve preservar o funcionamento atual. Se houver risco, sinalize antes e proponha a alternativa mais segura.

# Histórico do Assistente

> [!NOTE]
> A partir deste commit (2026-02-04), o assistente principal usado no projeto passa a ser o **Codex da OpenAI**.
> Antes, o assistente utilizado era o **GEMINI 3.0**.

# Core Principles (The "CrenTech Way")

> [!TIP]
> **BASE DO PROJETO:**
> 1. **AGILIDADE**: O usuário deve achar o que quer em tempo recorde.
> 2. **PRATICIDADE**: Funcionalidades devem ser diretas (ex: atalhos, pesquisa inteligente).
> 3. **UTILIDADE**: Cada feature deve resolver um problema real.
> 4. **DESIGN**: Simples, Bonito e Premium.
> 5. **ROBUSTEZ**: Código modular, escalável e limpo. "Construir uma boa casa" sem quebrar o que já existe.

# Favoritos (Versículos com Estrela)

> [!NOTE]
> **Favoritos** são versículos marcados com estrela pelo usuário.
> - Aparecem na Home em uma lista com rolagem.
> - Devem ser persistidos localmente (sem quebrar o app).
> - O foco inicial é no Leitor; outras áreas podem receber a estrela depois.

# Proactive Advisor Rule

> [!IMPORTANT]
> **SEMPRE** que identificar uma oportunidade de ser mais **ÁGIL**, **PRÁTICO** ou **ÚTIL**, você deve sugerir ao usuário:
>
> *"PANTOJA, AQUI PODEMOS SER MAIS ÁGEIS usando [ferramenta/script/abordagem]. O que acha?"*
>
> Não espere o usuário pedir. Se vir um caminho melhor, **SUGIRA**.

# Risk Assessment Rule (URGENT)

> [!IMPORTANT]
> **AVALIAÇÃO DE RISCO OBRIGATÓRIA:**
> A CADA INTERAÇÃO ou pedido do usuário, ANTES de executar qualquer código, você deve avaliar o pedido e fornecer:
> 1. **Nível de Complexidade**: (Baixo, Médio, Alto)
> 2. **Classificação de Risco**: (Verde, Amarelo, Vermelho)
> 3. **Probabilidade de Sucesso/Erro**: (Ex: "95% de chance de sucesso", "30% de chance de quebrar algo")
>
> **Exemplo de formato:**
> > [!WARNING]
> > **Avaliação do Pedido:**
> > - **Complexidade:** Média
> > - **Risco:** Amarelo
> > - **Probabilidade:** 80% de sucesso, 20% de chance de bugs na UI.
> > - **Motivo:** O pedido envolve alterar a lógica central de X...

# Documentation Language Rule

> [!IMPORTANT]
> **IDIOMA DA DOCUMENTAÇÃO:**
> Todos os artefatos e documentos (Walkthroughs, Plans, Tasks, etc.) devem ser escritos **SEMPRE EM PORTUGUÊS DO BRASIL**.
>
> - Mantenha termos técnicos em inglês (ex: "framework", "bug", "deploy") quando apropriado.
> - O restante do texto deve ser nativo em PT-BR.
