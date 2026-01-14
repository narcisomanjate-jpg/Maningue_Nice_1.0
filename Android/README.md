Android folder - Instruções para criar app Android offline

Este projeto contém uma versão web (Vite + React). Para transformar em uma app Android nativa offline, siga os passos abaixo. As instruções assumem que você está num ambiente Windows (PowerShell).

1) Instalar dependências (uma vez):
   npm install
   npm install @capacitor/cli @capacitor/core --save-dev

2) Preparar a build web e copiar para a pasta Android/www (já incluí um script):
   npm run android:prepare

   - Este script faz `npm run build` e copia `dist` para `Android/www`.
   - Verifique o conteúdo de `Android/www` para certificar que os arquivos estáticos estão lá.

3) Inicializar Capacitor (apenas se não quiser usar a configuração já criada):
   npx cap init "Super Agente" "com.example.superagente" --webDir=Android/www

   Observação: já foi adicionado um arquivo `capacitor.config.json` no root com webDir apontando para `Android/www`. Se preferir, edite `appId` e `appName` antes de prosseguir.

4) Adicionar a plataforma Android (executar uma única vez):
   npx cap add android

5) Abrir o projeto no Android Studio:
   npx cap open android

   - No Android Studio, construa a app e instale num dispositivo/emulador.
   - A app usará os arquivos estáticos em `Android/www`, portanto é totalmente offline (desde que não use serviços externos como Firebase sync).

6) Ativar suporte offline localmente (PWA):
   - Este projeto já inclui um Service Worker gerado pelo `vite-plugin-pwa` que faz cache offline dos activos estáticos.
   - Em producao, o service worker será gerado automaticamente e registered em `main.tsx`.

7) Dicas para ser totalmente offline:
   - Evite ativar sincronização com Firebase (ou desative nas configurações da app). O app funciona totalmente local usando IndexedDB/localforage.
   - Teste no dispositivo com rede desligada para confirmar o comportamento offline.

8) Publicação (opcional):
   - Use Android Studio para gerar o APK/AAB.

CI (GitHub Actions)
--------------------
Você pode automatizar a geração do APK usando GitHub Actions. Um workflow de exemplo foi adicionado em `.github/workflows/android-build.yml`.

Como usar:
- Vá para a aba "Actions" no GitHub e dispare o workflow "Android CI Build" (botão "Run workflow").
- Por padrão ele gera um build debug e faz upload do artefacto `app-debug-apk`.

Para gerar um build release assinado:
1. Crie um keystore localmente (se ainda não tem) e gere Base64 do arquivo:
   - PowerShell:
     $b=[IO.File]::ReadAllBytes('my-release-key.jks'); [Convert]::ToBase64String($b) | Out-File -Encoding ascii keystore.b64
   - Copie o conteúdo de `keystore.b64` e adicione ao repositório como secret chamado `KEYSTORE_BASE64`.
2. Adicione secrets no repositório (`Settings → Secrets`):
   - KEYSTORE_BASE64 (conteúdo base64 do .jks)
   - KEYSTORE_PASSWORD
   - KEYSTORE_ALIAS
   - KEY_PASSWORD
3. Ao rodar o workflow no GitHub Actions, escolha `build_type=release`. O workflow irá decodificar o keystore e executar `./gradlew assembleRelease`, e fará upload do APK gerado como artefato.

Se preferir que eu ajuste o workflow (ex.: usar outra versão do API level, criar um AAB em vez de APK, ou enviar artefatos para um release), diga qual deseja.

Se quiser, eu posso:
 - Gerar um 'template' de app Android WebView (ex.: cordova) diretamente na pasta Android, mas requer que eu execute comandos nativos. Posso guiar passo-a-passo.
 - Ajudar a criar ícones/splash screens nativos e configurar o arquivo `capacitor.config.json` com o appId desejado.
   - Gerar ícones/splash nativos a partir de uma imagem fonte e aplicar ao projecto Android (veja os scripts em /scripts).

