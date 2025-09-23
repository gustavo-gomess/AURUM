@echo off
echo ========================================
echo    CORREÇÃO DE AULAS - AURUM
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

echo 🎬 Criando aulas no banco de dados...
node create-lessons.js

echo.
echo ========================================
echo    TESTE DA APLICAÇÃO
echo ========================================
echo.
echo 🌐 Abrindo aplicação no navegador...
echo 📝 Acesse: http://localhost:3000/cursos
echo 👤 Login: admin@aurum.com.br / admin123
echo.

echo ✅ Processo concluído!
echo.
pause
