
export interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface ContextData {
  previous: { number: number; text: string }[];
  next: { number: number; text: string }[];
}

export interface HermeneuticsData {
  summary: string;
  speaker: string;     // Quem está falando?
  receiver: string;    // Para quem?
  immediateContext: string; // Contexto dos versos antes e depois
  generalContext: string;   // Contexto do livro/capítulo
  application: string; // Como aplicar hoje
}

// Adicionado ACF como solicitado
export type BibleVersion = 'NVI' | 'ACF' | 'ARC' | 'NBV' | 'BAM' | 'TNM' | 'NTLH';

// Adicionado tema medieval
export type AppTheme = 'hitech' | 'jesus' | 'kids' | 'catholic' | 'pentecostal' | 'medieval';

export enum AppStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type AppView = 'splash' | 'home' | 'search' | 'reader' | 'history' | 'quiz';
