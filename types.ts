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
  author: string;
  audience: string;
  purpose: string;
  meaning: string;
}

export type BibleVersion = 'NVI' | 'ARC' | 'NBV' | 'BAM' | 'TNM' | 'NTLH';

export enum AppStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}