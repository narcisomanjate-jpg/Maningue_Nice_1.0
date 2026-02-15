# ⚡ SETUP RÁPIDO - Super Agente

## 🎯 Antes de Começar

### 1️⃣ Instalar Node.js (OBRIGATÓRIO)

1. Aceda a: https://nodejs.org/
2. Clique em "LTS" (versão estável recomendada)
3. Descarregue e execute o instalador
4. Siga os passos (deixe as opções padrão)
5. **Reinicie o computador** após instalação

### 2️⃣ Verificar Instalação

Abra **Cmd** ou **PowerShell** e execute:
```
node --version
npm --version
```

Se ver números de versão, está tudo bem! ✅

---

## 🚀 Iniciar a Aplicação

### Opção A: Windows (Mais Fácil) 🎯

1. Vá para a pasta: `C:\Users\hacker\Desktop\Maningue_Nice_1.1`
2. **Duplo-clique** em `Iniciar.bat`
3. Aguarde (primeira vez pode levar 5-10 minutos)
4. O navegador abre automaticamente

**Pronto!** A aplicação está a funcionar em: `http://localhost:5173`

---

### Opção B: Command Prompt / PowerShell

1. Abra **Command Prompt** ou **PowerShell**
2. Navegue até à pasta:
   ```
   cd C:\Users\hacker\Desktop\Maningue_Nice_1.1
   ```
3. Execute:
   ```
   npm run dev
   ```
4. Abra no navegador: `http://localhost:5173`

---

## 📖 Guias Detalhados

- **Desenvolvimento:** Ver `DEV_GUIDE.md`
- **O que foi corrigido:** Ver `CORRECTIONS_SUMMARY.md`
- **Troubleshooting:** Ver `DEV_GUIDE.md` seção "Resolvendo Problemas"

---

## ✨ O Que Está Corrigido

### ✅ 1. Extratos em PDF
- Clique "Visualizar" numa fatura para abrir o modal
- Escolha: **Download PDF**, **Enviar SMS**, ou **Imprimir**

### ✅ 2. Backup Funcional
- Ir a **Definições** → **Exportar/Importar Backup**
- Tudo funciona automaticamente

### ✅ 3. Sem Páginas em Branco
- Faturas visualizam correctamente num modal
- Opções de download/envio disponíveis

### ✅ 4. Servidor Local
- Execute `Iniciar.bat` para começar
- Hot-reload automático ao fazer mudanças

---

## 🆘 Problemas Comuns

### ❌ "npm não é reconhecido"
- Node.js não foi instalado
- **Solução:** Reinicie o computador após instalar Node.js

### ❌ "Port 5173 já está em uso"
- Outro programa está usando a porta
- **Solução:** Feche o navegador/terminal anterior e tente novamente

### ❌ "Erro ao descarregar PDF"
- Bloqueador de pop-ups ativado
- **Solução:** Permita pop-ups do localhost

### ❌ "Dependências não encontradas"
- node_modules não instalado
- **Solução:** Execute `npm install` manualmente

---

## 💡 Proximas Vezes

Depois da primeira instalação, basta:
- Windows: Duplo-clique em `Iniciar.bat`
- CMD: `npm run dev`
- PowerShell: `.\scripts\dev.ps1`

---

## 📱 Utilizar a Aplicação

1. **Criar Novo Cliente**: Botão "+" no canto
2. **Adicionar Transação**: Selecione cliente → botão Entrada/Saída
3. **Ver Extrato**: Clique no cliente → aba "Arquivo"
4. **Download PDF**: Clique "Visualizar" → "Download PDF"
5. **Fazer Backup**: Definições → "Exportar Backup Completo"

---

## 🎉 Está Funcionando?

Se vir a aplicação no navegador com:
- ✅ Dashboard com gráficos
- ✅ Lista de clientes
- ✅ Definições funcionando
- ✅ PDFs gerando

**Tudo está a funcionar corretamente!** 🎊

---

**Precisa de ajuda?**
- Console (F12) mostra erros técnicos
- Verifique `DEV_GUIDE.md` para mais opções
- Restart do computador resolve 90% dos problemas

🚀 **Boa sorte!**
