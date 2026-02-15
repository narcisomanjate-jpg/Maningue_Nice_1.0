# 🚀 Super Agente - Guia de Desenvolvimento

## Pré-requisitos

Você precisa ter instalado:
- **Node.js** (v16 ou superior) - [Baixar aqui](https://nodejs.org/)
- **npm** (normalmente vem com Node.js)

### Verificar instalação

```bash
node --version
npm --version
```

## 🎯 Iniciando a Aplicação

### Opção 1: Windows (Recomendado)

Simplesmente **clique duas vezes** no ficheiro `Iniciar.bat`

O script irá:
1. ✅ Verificar se o Node.js está instalado
2. 📦 Instalar dependências (se necessário)
3. 🚀 Iniciar o servidor de desenvolvimento
4. 🌐 Abrir o navegador automaticamente

### Opção 2: Linha de Comandos

```bash
# 1. Instalar dependências (apenas na primeira vez)
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
http://localhost:5173
```

### Opção 3: PowerShell

```powershell
# Executar no PowerShell
$env:PSExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\dev.ps1
```

## 📱 Funcionalidades Principais

### 1. Gestão de Clientes
- ➕ Adicionar novos clientes
- ✏️ Editar informações
- 🗑️ Arquivar contas

### 2. Transações
- 💰 Registar entradas e saídas
- 📊 Ver saldos em tempo real
- 📝 Editar transações

### 3. Extratos em PDF
- 📄 Gerar faturas profissionais
- 💾 Descarregar como PDF
- 📧 Enviar por SMS/WhatsApp

### 4. Backup e Restauração
- 💾 Exportar backup completo
- 📥 Importar dados
- 🔄 Sincronização automática

## 🎨 Personalização

### Temas
- 🌙 Modo Escuro/Claro
- 🎯 Cores customizáveis
- 📐 Interface responsiva

### Idiomas
- 🇵🇹 Português (Moçambique)
- 🇬🇧 English (disponível)

### Contas Disponíveis

Por padrão, a aplicação vem com:
- Super M-pesa
- Super E-mola
- M-pesa
- E-mola
- Mkesh
- Cash

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Compila para produção
npm run preview          # Preview do build

# Android (Capacitor)
npm run android:prepare  # Prepara para Android
npm run android:open     # Abre Android Studio
npm run android:build:debug    # Build debug
npm run android:build:release  # Build release

# Ícones
npm run icons:generate   # Gera ícones
npm run icons:apply      # Aplica ícones ao Android
```

## 🐛 Resolvendo Problemas

### Porta 5173 já está em uso

```bash
# Usar uma porta diferente
npm run dev -- --port 3000
```

### Error: Cannot find module

```bash
# Limpar cache e reinstalar
rm -r node_modules
npm install
```

### webpack/TypeScript errors

```bash
# Recompile TypeScript
npm run tsc -- --noEmit
```

## 🔧 Configuração Avançada

### Environment Variables

Criar ficheiro `.env` na raiz:

```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Super Agente
```

### Firebase (Desactivado em offline-only)

Esta versão é **offline-only**. Cloud sync foi removida.

## 📚 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── views/          # Páginas principais
│   ├── modals/         # Modais
│   └── shared/         # Componentes reutilizáveis
├── hooks/              # Custom hooks
├── contexts/           # React Context
├── utils/              # Utilidades (PDF, backup, etc)
├── types.ts            # TypeScript types
└── constants.ts        # Constantes

public/                 # Assets estáticos
scripts/                # Scripts de build
```

## 💡 Dicas de Desenvolvimento

1. **Console do Navegador**: F12 para debug
2. **Hot Reload**: Mudanças no código atualizam automaticamente
3. **TypeScript**: Type-checking em tempo real
4. **Tailwind CSS**: Classes utilitárias para estilos

## 📞 Suporte

Para reportar problemas, criar um issue com:
- Descrição do problema
- Passos para reproduzir
- Screenshots (se aplicável)
- Detalhes do navegador/sistema

## 📝 Licença

Projeto privado - Todos os direitos reservados

---

**Última atualização**: 15 de Fevereiro de 2026
