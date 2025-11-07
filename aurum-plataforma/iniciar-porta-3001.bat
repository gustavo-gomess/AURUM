@echo off
chcp 65001 > nul
cls
echo ========================================
echo    🏆 AURUM - Porta 3001
echo ========================================
echo.
echo 📁 Configurando ambiente...
cd /d "C:\Users\gusge\OneDrive\Documentos\programs\Aurum\AURUM\nextjs-app\aurum-plataforma"

echo.
echo 🚀 Iniciando servidor na porta 3001...
echo 🌐 Acesse: http://localhost:3001
echo.
echo 💡 DICA: Use para testar com outro usuário!
echo    🔴 Porta 3000: Admin
echo    🔵 Porta 3001: Estudante
echo.
echo ⏹️  Para parar: Pressione Ctrl+C
echo.

set PATH=%PATH%;C:\Program Files\nodejs
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aurum_plataforma
set PORT=3001

npm run dev -- -p 3001

pause

