import { ContextData, HermeneuticsData, VerseReference, BibleVersion } from "../types";

// --- Configuração (via .env.local) ---
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL_NAME = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = import.meta.env.VITE_GROQ_MODEL_FALLBACK || 'llama-3.1-8b-instant';
const WHISPER_MODEL = import.meta.env.VITE_GROQ_WHISPER_MODEL || 'whisper-large-v3';

// Recupera a chave de forma segura, com erro claro quando ausente.
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error("CRÍTICO: VITE_GROQ_API_KEY ausente. Configure a chave no arquivo .env.local.");
    throw new Error("Chave da API do Groq ausente. Configure VITE_GROQ_API_KEY no .env.local.");
  }
  return apiKey;
};

// Converte base64 (sem prefixo data URL) em Blob para upload no Whisper.
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
};

// Chamada genérica de chat com saída JSON garantida (JSON mode do Groq).
const chatJSON = async <T>(
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  model: string = MODEL_NAME
): Promise<T> => {
  const apiKey = getApiKey();
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API erro ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '{}';
  return JSON.parse(content) as T;
};

// Transcreve áudio usando o Whisper do Groq.
const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const apiKey = getApiKey();
  const blob = base64ToBlob(base64Audio, mimeType);

  const formData = new FormData();
  formData.append('file', blob, 'audio.webm');
  formData.append('model', WHISPER_MODEL);
  formData.append('language', 'pt');
  formData.append('response_format', 'json');

  const response = await fetch(`${GROQ_BASE_URL}/audio/transcriptions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Whisper erro ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return (data?.text || '').trim();
};

const getVersionFullName = (version: BibleVersion): string => {
  switch (version) {
    case 'NVI': return 'Nova Versão Internacional (NVI)';
    case 'ACF': return 'Almeida Corrigida Fiel (ACF)';
    case 'ARC': return 'João Ferreira de Almeida Revista e Corrigida (ARC)';
    case 'NBV': return 'Nova Bíblia Viva (NBV)';
    case 'BAM': return 'Bíblia Ave Maria (Católica)';
    case 'TNM': return 'Tradução do Novo Mundo (Testemunhas de Jeová)';
    case 'NTLH': return 'Nova Tradução na Linguagem de Hoje (NTLH)';
    default: return 'Almeida Corrigida Fiel (ACF)';
  }
};

const SYSTEM_BIBLE = 'Você é um assistente bíblico especialista. Responda SEMPRE em português do Brasil e SEMPRE com um objeto JSON válido, sem texto fora do JSON.';

// Busca por uma consulta de texto livre (referência exata OU tema).
const searchVerseByQuery = async (query: string, version: BibleVersion): Promise<VerseReference[]> => {
  const versionPrompt = getVersionFullName(version);
  const userPrompt = `O usuário pediu: "${query}".
Use especificamente a versão bíblica: ${versionPrompt}.
1. Se for uma referência exata (ex: "João 3:16"): retorne uma lista com APENAS esse versículo.
2. Se for um tema (ex: "ansiedade", "estou triste"): retorne 5 versículos variados e relevantes.
Responda com este formato JSON exato:
{"verses":[{"book":"Nome do livro em português","chapter":1,"verse":1,"text":"texto do versículo"}]}`;

  const result = await chatJSON<{ verses?: VerseReference[] }>(SYSTEM_BIBLE, userPrompt, 0.3);
  if (!result.verses || !Array.isArray(result.verses) || result.verses.length === 0) {
    throw new Error("Não identificado.");
  }
  return result.verses;
};

export const searchVerseByAudio = async (
  base64Audio: string,
  version: BibleVersion,
  mimeType: string = 'audio/webm'
): Promise<VerseReference[]> => {
  try {
    const transcript = await transcribeAudio(base64Audio, mimeType);
    if (!transcript) throw new Error("Áudio não reconhecido.");
    return await searchVerseByQuery(transcript, version);
  } catch (error) {
    console.error("Erro na busca por áudio:", error);
    throw error;
  }
};

export const searchVerseByTheme = async (theme: string, version: BibleVersion): Promise<VerseReference[]> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const userPrompt = `Encontre 5 versículos bíblicos distintos sobre o tema/texto: "${theme}".
Use especificamente a versão: ${versionPrompt}.
Responda com este formato JSON exato:
{"verses":[{"book":"Nome do livro em português","chapter":1,"verse":1,"text":"texto do versículo"}]}`;

    const result = await chatJSON<{ verses?: VerseReference[] }>(SYSTEM_BIBLE, userPrompt, 0.5);
    if (!result.verses || !Array.isArray(result.verses) || result.verses.length === 0) {
      throw new Error("Não encontrado.");
    }
    return result.verses;
  } catch (error) {
    console.error("Erro na busca por tema:", error);
    throw error;
  }
};

export const getVerseContext = async (
  book: string,
  chapter: number,
  verse: number,
  version: BibleVersion
): Promise<ContextData> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const userPrompt = `Para o versículo: ${book} ${chapter}:${verse}.
Retorne os 10 versículos anteriores e os 10 posteriores, na versão ${versionPrompt}.
Responda com este formato JSON exato:
{"previous":[{"number":1,"text":"..."}],"next":[{"number":1,"text":"..."}]}`;

    return await chatJSON<ContextData>(SYSTEM_BIBLE, userPrompt, 0.1);
  } catch (error) {
    console.error("Erro ao buscar contexto:", error);
    throw error;
  }
};

export const getHermeneutics = async (
  book: string,
  chapter: number,
  verse: number,
  text: string
): Promise<HermeneuticsData> => {
  const systemPrompt = 'Você é um teólogo especialista em hermenêutica bíblica. Responda SEMPRE em português do Brasil e SEMPRE com um objeto JSON válido, sem texto fora do JSON.';
  const userPrompt = `Faça uma análise hermenêutica PROFUNDA do versículo: "${text}" (${book} ${chapter}:${verse}).
Analise O TEXTO ESPECÍFICO, não apenas o livro.
1. 'summary': resumo curto e direto (máx 2 frases) que capture a essência.
2. 'speaker': quem está falando no texto.
3. 'receiver': para quem está sendo falado diretamente.
4. 'immediateContext': o que acontece imediatamente antes e depois (a cena).
5. 'generalContext': contexto geral do capítulo/livro e propósito teológico.
6. 'application': como aplicar este ensino na vida moderna hoje.
Responda com este formato JSON exato:
{"summary":"...","speaker":"...","receiver":"...","immediateContext":"...","generalContext":"...","application":"..."}`;

  try {
    return await chatJSON<HermeneuticsData>(systemPrompt, userPrompt, 0.4);
  } catch (primaryError) {
    console.warn("Hermenêutica falhou no modelo principal, tentando fallback...", primaryError);
    if (FALLBACK_MODEL && FALLBACK_MODEL !== MODEL_NAME) {
      try {
        return await chatJSON<HermeneuticsData>(systemPrompt, userPrompt, 0.4, FALLBACK_MODEL);
      } catch (fallbackError) {
        console.error("Erro ao buscar hermenêutica (fallback):", fallbackError);
        throw fallbackError;
      }
    }
    throw primaryError;
  }
};
