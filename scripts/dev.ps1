# Super Agente - Development Server Launcher
# PowerShell Script for Windows

Write-Host "========================================" -ForegroundColor Blue
Write-Host "  🚀 Iniciando Super Agente..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Verificar se Node.js está instalado
$nodeCheck = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO: Node.js não está instalado!" -ForegroundColor Red
    Write-Host "Por favor, instale de: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "✅ Node.js detectado: $nodeCheck" -ForegroundColor Green
Write-Host ""

# Verificar e instalar dependências
Write-Host "Verificando dependências..." -ForegroundColor Cyan

if (-Not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "📦 Instalando dependências (primeira vez)..." -ForegroundColor Yellow
    Write-Host "Isso pode demorar alguns minutos..." -ForegroundColor Gray
    Write-Host ""
    
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ ERRO ao instalar dependências!" -ForegroundColor Red
        Write-Host "Verificar conexão e tente novamente." -ForegroundColor Yellow
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  🎯 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""
Write-Host "Abrindo: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Para sair, pressione CTRL+C" -ForegroundColor Yellow
Write-Host ""

# Aguardar e abrir browser
Start-Sleep -Seconds 2

# Tentar abrir o browser (esperar um pouco pelo servidor iniciar)
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
} | Out-Null

# Executar servidor de desenvolvimento
npm run dev
