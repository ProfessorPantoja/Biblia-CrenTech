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

// Schema for Multiple Results (used for both Audio and Theme search now)
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
        properties: {
          number: { type: Type.INTEGER },
          text: { type: Type.STRING }
        }
      }
    },
    next: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          text: { type: Type.STRING }
        }
      }
    }
  },
  required: ["previous", "next"]
};

// Schema for Hermeneutics
const hermeneuticsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    author: { type: Type.STRING, description: "Quem escreveu o livro" },
    audience: { type: Type.STRING, description: "Para quem foi escrito originalmente" },
    purpose: { type: Type.STRING, description: "O motivo ou propósito da escrita" },
    meaning: { type: Type.STRING, description: "Explicação concisa do sentido teológico do versículo" },
  },
  required: ["author", "audience", "purpose", "meaning"]
};

const getVersionFullName = (version: BibleVersion): string => {
  switch (version) {
    case 'NVI': return 'Nova Versão Internacional (NVI)';
    case 'ARC': return 'João Ferreira de Almeida Revista e Corrigida (ARC)';
    case 'NBV': return 'Nova Bíblia Viva (NBV)';
    case 'BAM': return 'Bíblia Ave Maria (Católica)';
    case 'TNM': return 'Tradução do Novo Mundo (Testemunhas de Jeová)';
    case 'NTLH': return 'Nova Tradução na Linguagem de Hoje (NTLH)';
    default: return 'Nova Versão Internacional (NVI)';
  }
};

export const searchVerseByAudio = async (base64Audio: string, version: BibleVersion, mimeType: string = 'audio/webm'): Promise<VerseReference[]> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `Ouça o áudio. O usuário pode pedir um versículo específico (ex: "João 3:16") OU um tema/sentimento (ex: "estou triste", "versículo sobre dinheiro", "consolo").
            
            IMPORTANTE: Use especificamente a versão: ${versionPrompt}.
            
            1. Se for referência exata: Retorne uma lista contendo APENAS este versículo.
            2. Se for tema: Encontre 5 versículos variados e encorajadores na Bíblia para esse tema.
            Retorne JSON seguindo o esquema.`,
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
    
    if (!result.verses || !Array.isArray(result.verses) || result.verses.length === 0) {
        throw new Error("Não foi possível identificar o versículo.");
    }

    return result.verses as VerseReference[];
  } catch (error) {
    console.error("Error searching verse:", error);
    throw error;
  }
};

export const searchVerseByTheme = async (theme: string, version: BibleVersion): Promise<VerseReference[]> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const prompt = `Encontre 5 versículos bíblicos distintos que tragam sabedoria e direção sobre o tema: "${theme}".
    IMPORTANTE: Use especificamente a versão: ${versionPrompt}.
    Retorne uma lista JSON com esses 5 versículos.`;

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
    
    if (!result.verses || !Array.isArray(result.verses) || result.verses.length === 0) {
        throw new Error("Não foi possível encontrar versículos para o tema.");
    }

    return result.verses as VerseReference[];
  } catch (error) {
    console.error("Error searching verse by theme:", error);
    throw error;
  }
};

export const getVerseContext = async (book: string, chapter: number, verse: number, version: BibleVersion = 'NVI'): Promise<ContextData> => {
  try {
    const versionPrompt = getVersionFullName(version);
    const prompt = `Para o versículo: ${book} ${chapter}:${verse}. 
    Forneça uma ampla visão do contexto.
    Retorne os 10 versículos imediatamente anteriores e os 10 versículos imediatamente posteriores (ou o máximo possível dentro do capítulo).
    Use a versão: ${versionPrompt}.`;

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
    const prompt = `Faça uma análise hermenêutica concisa do versículo: "${text}" (${book} ${chapter}:${verse}).
    Forneça: Autor, Público Alvo, Motivo da escrita e o Sentido Principal do trecho.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: hermeneuticsSchema,
        temperature: 0.3,
      }
    });

    return JSON.parse(response.text || "{}") as HermeneuticsData;
  } catch (error) {
    console.error("Error fetching hermeneutics:", error);
    throw error;
  }
};