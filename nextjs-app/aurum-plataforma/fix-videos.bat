@echo off
echo ========================================
echo    CORREÇÃO DE VÍDEOS DO VIMEO
echo ========================================
echo.

echo 🔍 Verificando dependências...
if not exist "node_modules" (
    echo ❌ node_modules não encontrado. Execute 'npm install' primeiro.
    pause
    exit /b 1
)

echo ✅ Dependências encontradas
echo.

echo 🎬 Executando correção dos vídeos...
node fix-vimeo-videos.js

echo.
echo ========================================
echo    TESTE DE VÍDEOS
echo ========================================
echo.
echo 📋 Para testar os vídeos:
echo 1. Abra o arquivo 'test-vimeo-video.html' no navegador
echo 2. Verifique se os vídeos carregam corretamente
echo 3. Se funcionarem, substitua pelos seus próprios IDs do Vimeo
echo.

echo 🌐 Abrindo arquivo de teste...
start test-vimeo-video.html

echo.
echo ✅ Processo concluído!
echo.
pause
