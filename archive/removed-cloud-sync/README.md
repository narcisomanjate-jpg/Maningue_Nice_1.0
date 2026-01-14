Arquivos removidos relacionados à sincronização na nuvem e artefatos gerados.

Motivo:
- Esta versão da aplicação foi convertida para ser 100% offline. As funcionalidades e UI relacionadas ao
  Firebase/Sync foram removidas para simplificar a base de código e evitar dependências externas.
- Arquivos de build gerados (dist/ e Android/www/) foram removidos do controle de versão e adicionados ao .gitignore.

Arquivos arquivados aqui:
- src/hooks/useFirebase.ts
- src/utils/firebaseConfig.ts
- src/utils/firebaseConfig.mock.ts
- src/components/modals/FirebaseLoginModal.tsx
- src/components/modals/AutoSyncPromptModal.tsx

Se precisar restaurar algum arquivo, mova-os de volta para os locais originais e ajuste imports conforme necessário.
