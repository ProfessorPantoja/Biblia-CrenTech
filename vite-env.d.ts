/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_GROQ_MODEL?: string;
  readonly VITE_GROQ_MODEL_FALLBACK?: string;
  readonly VITE_GROQ_WHISPER_MODEL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_WAKELOCK_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
