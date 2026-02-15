@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

echo ========================================
echo  🚀 Iniciando Super Agente...
echo ========================================
echo.

:: Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERRO: Node.js não está instalado!
    echo Por favor, instale Node.js de: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version

echo.
echo Verificando dependências...

:: Verificar se node_modules existe
if not exist node_modules (
    echo.
    echo 📦 Instalando dependências (primeira vez)...
    echo Isso pode demorar alguns minutos...
    echo.
    
    call npm install
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ ERRO ao instalar dependências!
        echo Por favor, verifique sua conexão internet e tente novamente.
        echo.
        pause
        exit /b 1
    )
    
    echo ✅ Dependências instaladas com sucesso!
) else (
    echo ✅ Dependências já estão instaladas
)

echo.
echo ========================================
echo  🎯 Iniciando servidor de desenvolvimento...
echo ========================================
echo.
echo Abrindo: http://localhost:5173
echo Para sair, pressione CTRL+C no terminal
echo.

:: Aguardar alguns segundos e depois abrir o browser
timeout /t 3 /nobreak

:: Tentar abrir o browser
start http://localhost:5173

:: Executar o servidor de desenvolvimento
call npm run dev

pause