@echo off
echo ============================================
echo     CONFIGURACAO COMPLETA - AURUM
echo ============================================

echo.
echo 1. Criando arquivo .env.local...
echo DATABASE_URL="postgresql://postgres:senha@localhost:5432/aurum_db?schema=public" > .env.local
echo JWT_SECRET="aurum-jwt-secret-muito-seguro-para-producao" >> .env.local
echo REDIS_URL="redis://localhost:6379" >> .env.local
echo NEXT_PUBLIC_APP_URL="http://localhost:3000" >> .env.local

echo.
echo 2. Executando migracao do Prisma...
call npx prisma migrate dev --name init

echo.
echo 3. Criando usuarios iniciais...
call node setup-database.js

echo.
echo ============================================
echo     CONFIGURACAO CONCLUIDA!
echo ============================================
echo.
echo Credenciais criadas:
echo - Admin: admin@aurum.com.br / admin123
echo - Estudante: estudante@teste.com / student123
echo.
echo Proximo passo:
echo 1. Abra o DBeaver
echo 2. Conecte em: localhost:5432 / aurum_db
echo 3. Execute: npm run dev
echo.
pause
