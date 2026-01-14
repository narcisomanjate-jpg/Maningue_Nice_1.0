<#
PowerShell helper to configure JDK (JAVA_HOME), Android SDK (ANDROID_SDK_ROOT) and PATH entries,
and optionally create a signing keystore (my-release-key.jks).

Usage: Open PowerShell as normal (run as Administrator only if you want to set system-wide variables).
Run: .\scripts\setup-android-sdk.ps1

This script is interactive and will:
 - Detect an existing Java (JDK) and set JAVA_HOME (User) if found
 - Ask for Android SDK root (default C:\Android), download command-line tools if missing
 - Install essential SDK components (platform-tools, build-tools, platforms)
 - Attempt to accept licenses automatically (falls back to instructing you to run it manually)
 - Optionally create a keystore using keytool

Note: Downloads can be large; confirm when prompted.
#>

Set-StrictMode -Version Latest

function Write-Ok($msg) { Write-Host "[OK]  " -ForegroundColor Green -NoNewline; Write-Host $msg }
function Write-Info($msg) { Write-Host "[INFO]" -ForegroundColor Cyan -NoNewline; Write-Host $msg }
function Write-Warn($msg) { Write-Host "[WARN]" -ForegroundColor Yellow -NoNewline; Write-Host $msg }
function Write-Err($msg) { Write-Host "[ERR] " -ForegroundColor Red -NoNewline; Write-Host $msg }

# 1) Detect JDK
Write-Info "Detectando JDK (java)..."
$java = Get-Command java -ErrorAction SilentlyContinue
if ($java) {
    $javaExe = (Resolve-Path $java.Source).Path
    # normal path: C:\Program Files\Java\jdk-xx\bin\java.exe
    $javaBin = Split-Path $javaExe -Parent
    $javaHomeCandidate = Split-Path $javaBin -Parent
    Write-Ok "Java encontrado em: $javaExe"
    Write-Info "Propondo JAVA_HOME: $javaHomeCandidate"
    $confirm = Read-Host "Usar este JAVA_HOME? (S/n)"
    if ($confirm -eq 'n' -or $confirm -eq 'N') {
        $javaHome = Read-Host "Informe o caminho completo do JAVA_HOME (ex: C:\\Program Files\\Java\\jdk-17)"
    } else {
        $javaHome = $javaHomeCandidate
    }
    if (Test-Path $javaHome) {
        [Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'User')
        $env:JAVA_HOME = $javaHome
        Write-Ok "JAVA_HOME definido como: $javaHome"
        Write-Info "(Será necessário reiniciar novos terminais para enxergar a variável)")
    } else {
        Write-Warn "Caminho JAVA_HOME informado não existe. Verifique manualmente."
    }
} else {
    Write-Warn "Java não encontrado no PATH. Instale o JDK (Temurin/Adoptium/Oracle) e reexecute este script."
    Write-Host "Download JDK (Temurin): https://adoptium.net/"
}

# 2) Configure Android SDK root
$defaultSdkRoot = 'C:\Android'
$inputSdkRoot = Read-Host "Caminho para Android SDK root [$defaultSdkRoot]"
if ([string]::IsNullOrWhiteSpace($inputSdkRoot)) { $sdkRoot = $defaultSdkRoot } else { $sdkRoot = $inputSdkRoot }

if (-not (Test-Path $sdkRoot)) {
    New-Item -ItemType Directory -Path $sdkRoot -Force | Out-Null
    Write-Ok "Criado diretório: $sdkRoot"
} else { Write-Info "Usando SDK root: $sdkRoot" }

# 3) Download command-line tools if missing (cmdline-tools/latest)
$cmdlineToolsDir = Join-Path $sdkRoot 'cmdline-tools\latest'
if (-not (Test-Path $cmdlineToolsDir)) {
    Write-Info "Command-line tools não encontrados em $cmdlineToolsDir"
    $download = Read-Host "Baixar command-line tools do site oficial agora? (recomendado) (S/n)"
    if ($download -eq 'n' -or $download -eq 'N') {
        Write-Warn "Pulei download. Você precisará instalar manualmente command-line tools em $sdkRoot\\cmdline-tools\\latest"
    } else {
        $tmpZip = Join-Path $env:TEMP 'commandlinetools-win-latest.zip'
        $url = 'https://dl.google.com/android/repository/commandlinetools-win-latest.zip'
        Write-Info "Baixando $url ..."
        try {
            Invoke-WebRequest -Uri $url -OutFile $tmpZip -UseBasicParsing -ErrorAction Stop
            Write-Ok "Download concluído: $tmpZip"
            Expand-Archive -Path $tmpZip -DestinationPath $sdkRoot\cmdline-tools -Force
            # After extraction, Google ships a folder 'cmdline-tools' containing 'bin' etc. Move into 'latest'
            if (-not (Test-Path $cmdlineToolsDir)) {
                # try to move extracted 'cmdline-tools' subfolder
                $extractedCandidate = Join-Path $sdkRoot 'cmdline-tools\cmdline-tools'
                if (Test-Path $extractedCandidate) {
                    Move-Item -Path $extractedCandidate -Destination $cmdlineToolsDir -Force
                    Write-Ok "Organizado command-line tools em $cmdlineToolsDir"
                } else {
                    Write-Warn "Estrutura inesperada após extração. Verifique $sdkRoot\\cmdline-tools"
                }
            }
            Remove-Item $tmpZip -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Err "Falha ao baixar/instalar command-line tools: $_.Exception.Message"
            Write-Host "Você pode baixar manualmente de: https://developer.android.com/studio#cmdline-tools" -ForegroundColor Yellow
        }
    }
} else {
    Write-Ok "Command-line tools já presente em $cmdlineToolsDir"
}

# 4) Set ANDROID_SDK_ROOT and PATH entries (User)
[Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $sdkRoot, 'User')
$env:ANDROID_SDK_ROOT = $sdkRoot

$pathsToAdd = @(
    (Join-Path $sdkRoot 'platform-tools'),
    (Join-Path $sdkRoot 'cmdline-tools\latest\bin')
)

$curPath = [Environment]::GetEnvironmentVariable('PATH','User')
$newPath = $curPath
foreach ($p in $pathsToAdd) {
    if (-not [string]::IsNullOrWhiteSpace($p) -and -not ($curPath -like "*$p*")) {
        $newPath = "$newPath;$p"
        Write-Ok "Adicionando ao PATH (User): $p"
    }
}
[Environment]::SetEnvironmentVariable('PATH', $newPath, 'User')

Write-Info "As variáveis foram definidas como usuário. Reinicie o terminal (ou reinicie o Explorer) para que novas janelas as vejam." 

# 5) Install SDK components
$manager = Join-Path $sdkRoot 'cmdline-tools\latest\bin\sdkmanager.bat'
if (Test-Path $manager) {
    Write-Info "Instalando componentes: platform-tools, platforms;android-33, build-tools;33.0.2"
    try {
        & $manager "platform-tools" "platforms;android-33" "build-tools;33.0.2"
        Write-Ok "Componentes instalados (se não houve erros)."
        Write-Info "Aceitando licenças..."
        # Tentativa de aceitar automaticamente
        cmd.exe /c "echo y|`"$manager`" --licenses"
        Write-Ok "Licenças aceitas (ou dialogo será mostrado)."
    } catch {
        Write-Warn "Falha na instalação automática. Você pode executar manualmente:`"
        Write-Host "  $manager platform-tools platforms;android-33 build-tools;33.0.2"
        Write-Host "  $manager --licenses" -ForegroundColor Yellow
    }
} else {
    Write-Warn "sdkmanager não encontrado em $manager. Verifique instalação do cmdline-tools."
}

# 6) Opcional: criar keystore para assinatura
$createKeystore = Read-Host "Deseja criar um keystore (usado para assinatura de release)? (S/n)"
if ($createKeystore -ne 'n' -and $createKeystore -ne 'N') {
    $defaultKs = Join-Path (Get-Location) 'android\app\my-release-key.jks'
    $ksPath = Read-Host "Caminho do keystore [$defaultKs]"
    if ([string]::IsNullOrWhiteSpace($ksPath)) { $ksPath = $defaultKs }
    $alias = Read-Host "Alias da chave (ex: my-key-alias) [my-key-alias]"
    if ([string]::IsNullOrWhiteSpace($alias)) { $alias = 'my-key-alias' }

    $keytool = "$($env:JAVA_HOME)\bin\keytool.exe"
    if (-not (Test-Path $keytool)) { $keytool = 'keytool' }

    Write-Info "Gerando keystore em: $ksPath"
    & $keytool -genkeypair -v -keystore "$ksPath" -alias $alias -keyalg RSA -keysize 2048 -validity 10000
    if ($LASTEXITCODE -eq 0) { Write-Ok "Keystore gerado: $ksPath" } else { Write-Warn "keytool retornou código $LASTEXITCODE" }

    Write-Host "Dicas: você pode converte o keystore para base64 para usar em CI (GitHub Actions):" -ForegroundColor Cyan
    Write-Host "  [Convert]::ToBase64String([IO.File]::ReadAllBytes('path\\to\\my-release-key.jks'))" -ForegroundColor Yellow
}

Write-Ok "Configuração concluída. Feche e reabra o terminal ou reinicie o Explorer para que alterações de ambiente sejam aplicadas em novas janelas."
Write-Host "Verifique:
  java -version
  echo %JAVA_HOME% (ou $env:JAVA_HOME)
  sdkmanager --list" -ForegroundColor Cyan

# End
