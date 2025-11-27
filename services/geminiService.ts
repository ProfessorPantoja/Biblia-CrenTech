
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ContextData, HermeneuticsData, VerseReference, BibleVersion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

// Schema for a single verse
const verseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    book: { type: Type.STRING, description: "The name of the Bible book in Portuguese" },
    chapter: { type: Type.INTEGER, description: "The chapter number" },
    verse: { type: Type.INTEGER, description: "The verse number" },
    text: { type: Type.STRING, description: "The actual text of the verse in Portuguese" },
  },
  required: ["book", "chapter", "verse", "text"],
};

// Schema for Multiple Results
const multiVerseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    verses: {
      type: Type.ARRAY,
      items: verseSchema,
      description: "A list of relevant verses. 1 if specific, 5 if theme."
    }
  },
  required: ["verses"]
};

// Schema for Context
const contextSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    previous: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { number: { type: Type.INTEGER }, text: { type: Type.STRING } }
      }
    },
    next: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { number: { type: Type.INTEGER }, text: { type: Type.STRING } }
      }
    }
  },
  required: ["previous", "next"]
};

// NEW Hermeneutics Schema (Detailed)
const hermeneuticsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    speaker: { type: Type.STRING, description: "Quem está falando no texto? (Ex: Jesus, Paulo, Deus, um Profeta)" },
    receiver: { type: Type.STRING, description: "Para quem está sendo falado diretamente? (Ex: Os discípulos, a multidão, os fariseus)" },
    immediateContext: { type: Type.STRING, description: "O que acontece imediatamente antes e depois? Explique a cena." },
    generalContext: { type: Type.STRING, description: "Contexto geral do capítulo/livro e propósito teológico." },
    application: { type: Type.STRING, description: "Como aplicar este ensino específico na vida moderna hoje?" },
  },
  required: ["speaker", "receiver", "immediateContext", "generalContext", "application"]
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

export const searchVerseByAudio = async (base64Audio: string, version: BibleVersion, mimeType: string = 'audio/webm'): Promise<VerseReference[]> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Audio } },
          {
            text: `Ouça o áudio. O usuário pode pedir um versículo (ex: "João 3:16") OU um tema (ex: "estou triste").
            IMPORTANTE: Use especificamente a versão: ${versionPrompt}.
            1. Se referência exata: Retorne lista com APENAS este versículo.
            2. Se tema: Encontre 5 versículos variados.
            Retorne JSON.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: multiVerseSchema,
        temperature: 0.2, 
      },
    });

    const result = JSON.parse(response.text || "{}");
    if (!result.verses || !Array.isArray(result.verses) || result.verses.length === 0) throw new Error("Não identificado.");
    return result.verses as VerseReference[];
  } catch (error) {
    console.error("Error searching verse:", error);
    throw error;
  }
};

export const searchVerseByTheme = async (theme: string, version: BibleVersion): Promise<VerseReference[]> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const prompt = `Encontre 5 versículos bíblicos distintos sobre o tema/texto: "${theme}".
    IMPORTANTE: Use especificamente a versão: ${versionPrompt}.
    Retorne JSON com 5 versículos.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: multiVerseSchema,
        temperature: 0.5, 
      },
    });

    const result = JSON.parse(response.text || "{}");
    if (!result.verses || !Array.isArray(result.verses) || result.verses.length === 0) throw new Error("Não encontrado.");
    return result.verses as VerseReference[];
  } catch (error) {
    console.error("Error searching by theme:", error);
    throw error;
  }
};

export const getVerseContext = async (book: string, chapter: number, verse: number, version: BibleVersion): Promise<ContextData> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const prompt = `Para o versículo: ${book} ${chapter}:${verse}. 
    Retorne 10 anteriores e 10 posteriores na versão ${versionPrompt}.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: contextSchema,
        temperature: 0.1,
      }
    });
    return JSON.parse(response.text || "{}") as ContextData;
  } catch (error) {
    console.error("Error fetching context:", error);
    throw error;
  }
};

export const getHermeneutics = async (book: string, chapter: number, verse: number, text: string): Promise<HermeneuticsData> => {
  try {
    const prompt = `Faça uma análise hermenêutica PROFUNDA do versículo: "${text}" (${book} ${chapter}:${verse}).
    Analise O TEXTO ESPECÍFICO, não apenas o livro.
    Identifique:
    1. Quem está falando neste verso?
    2. Para quem está falando neste momento exato?
    3. O que acontece imediatamente antes e depois (contexto imediato)?
    4. Qual o contexto geral e teológico?
    5. Aplicação prática para hoje.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: hermeneuticsSchema,
        temperature: 0.4,
      }
    });
    return JSON.parse(response.text || "{}") as HermeneuticsData;
  } catch (error) {
    console.error("Error fetching hermeneutics:", error);
    throw error;
  }
};
