/// <reference types="vite/client" />

// (optional but nice) declare the env vars you use:
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
