@echo off
chcp 65001 > nul
cls
echo ========================================
echo    🏆 AURUM - Plataforma de Cursos
echo ========================================
echo.
echo 📁 Configurando ambiente...
cd /d "C:\Users\gusge\OneDrive\Documentos\programs\Aurum\AURUM\nextjs-app\aurum-plataforma"

echo.
echo 🚀 Iniciando servidor na porta 3000...
echo 🌐 Acesse: http://localhost:3000
echo.
echo 👥 CREDENCIAIS:
echo    🔴 Admin: admin@aurum.com.br / admin123
echo    🔵 Estudante: joao@estudante.com / estudante123
echo.
echo ⏹️  Para parar: Pressione Ctrl+C
echo.

set PATH=%PATH%;C:\Program Files\nodejs
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aurum_plataforma

npm run dev

pause

