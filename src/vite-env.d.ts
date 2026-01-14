/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No environment variables required for offline-only build
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}