@echo off
echo 🌱 Criando curso de Educação Financeira...

REM Criar usuários
echo 📝 Criando usuários...
curl -X POST "http://localhost:3000/api/dev/create-users"
echo.

REM Fazer login como admin
echo 🔐 Fazendo login...
for /f "tokens=*" %%i in ('curl -s -X POST "http://localhost:3000/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"admin@aurum.com.br\",\"password\":\"admin123\"}" ^| jq -r ".token"') do set TOKEN=%%i

REM Executar seed
echo 🏗️ Criando módulos e aulas...
curl -X POST "http://localhost:3000/api/dev/seed" -H "Authorization: Bearer %TOKEN%"
echo.

echo ✅ Seed executado!
echo 🌐 Acesse: http://localhost:3000/cursos
echo 👤 Login: admin@aurum.com.br / admin123
pause
