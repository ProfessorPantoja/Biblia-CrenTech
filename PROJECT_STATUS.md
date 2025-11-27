# Status do Projeto - Bíblia CrenTech (Versão 2.0)

## 🛠️ Resumo Técnico
Este projeto é uma **Single Page Application (SPA)** moderna construída com foco em performance e experiência do usuário.

*   **Core Framework:** React 19 (Hooks, Functional Components).
*   **Build Tool:** Vite (Rápido, Hot Module Replacement).
*   **Linguagem:** TypeScript (Tipagem estática para segurança).
*   **Estilização:** Tailwind CSS (Utilitários, Design Responsivo, Animações).
*   **Inteligência Artificial:** Google Gemini 2.5 Flash (Integrado via SDK Client-side).
*   **Ícones:** Lucide React.
*   **Áudio:** Engine de som customizada (`SoundEngine`) para feedback tátil.
*   **Persistência:** LocalStorage para histórico e preferências.

---

## ✅ Funcionalidades Atuais (V2.0)
O aplicativo já possui um conjunto robusto de features voltadas para busca e leitura bíblica:

1.  **Busca Multimodal:**
    *   **Voz:** Gravação e transcrição para busca de versículos.
    *   **Texto:** Busca semântica e por referência (ex: "João 3:16" ou "Versículos sobre ansiedade").
    *   **Autocomplete:** Sugestões de livros bíblicos enquanto digita.
2.  **Múltiplas Versões Bíblicas:** Suporte a ACF, NVI, ARC, NBV, NTLH, Católica (BAM) e TNM.
3.  **Sistema de Temas (Atmosfera):**
    *   6 Temas Imersivos: Hi-Tech, Jesus, Medieval, Infantil, Católico e Pentecostal (Fogo).
    *   Adaptação completa de cores, fontes e fundos.
4.  **Histórico e Navegação:**
    *   Slider para navegar entre pesquisas anteriores.
    *   Botões de "Anterior" e "Próximo".
    *   Persistência automática do histórico.
5.  **Ferramentas de Estudo:**
    *   Visualização de versículo com contexto.
    *   Botão para copiar versículo ou todo o histórico.
    *   Feedback sonoro para interações (Sucesso, Erro, Clique).
6.  **Engajamento e Monetização:**
    *   Modal de Doação (PIX com QR Code).
    *   Ticker de doação (aparece periodicamente).
    *   Botão de Feedback (Email).
    *   Modal "Sobre" com instruções de uso.

---

## 📊 Análise de Código
**Nota de Organização:** **4/10**

O código funciona perfeitamente, mas a estrutura precisa de refatoração para escalar para a V3.0.

**3 Pontos de Melhoria (Dívida Técnica):**
1.  **App.tsx Monolítico:** O arquivo principal (`App.tsx`) tem quase 600 linhas e acumula responsabilidades demais (Definição de temas, Roteamento, Estado Global, Lógica de UI, Modais). Isso torna a manutenção difícil.
2.  **Hardcoded Data:** As configurações de Temas e a lista de Versões estão "chumbadas" dentro do componente principal. Deveriam estar em arquivos de configuração separados (ex: `config/themes.ts`).
3.  **Gerenciamento de Estado:** O estado é passado via "Prop Drilling" (do pai para o filho) em vários níveis. O uso de um Context API ou Zustand simplificaria muito a comunicação entre componentes (ex: `ThemeContext`).

---

## 🚀 Sugestões para V3.0 (Futuro)
Considerando o nicho de "Bíblia de Estudo/Consulta Rápida", aqui estão 5 funcionalidades de alto impacto:

1.  **Gerador de Devocional com IA:**
    *   O usuário diz como está se sentindo (ex: "Cansado", "Grato") e a IA gera um devocional curto, exclusivo e personalizado para aquele momento.
2.  **Mapas Bíblicos Interativos:**
    *   Ao mencionar um local (ex: "Jerusalém", "Mar da Galileia"), exibir um mini-mapa ou permitir clicar para ver onde aquilo aconteceu.
3.  **Planos de Leitura Inteligentes:**
    *   A IA cria um plano de leitura baseado no tempo disponível do usuário (ex: "Ler os Evangelhos em 15 dias, 10min por dia").
4.  **Modo "Estudo Profundo" (Strong's):**
    *   Permitir clicar em palavras chave do versículo para ver o significado original em Hebraico ou Grego (Léxico de Strong).
5.  **Gerador de "Cards" para Redes Sociais:**
    *   Um botão "Compartilhar" que transforma o versículo atual em uma imagem bonita (Instagram Story) com o tema atual do App aplicado, pronta para postar.
