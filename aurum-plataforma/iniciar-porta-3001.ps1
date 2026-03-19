# ========================================
# 🚀 Script de Inicialização - AURUM
# Porta 3001 (para testes simultâneos)
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🏆 AURUM - Porta 3001" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do script (aurum-plataforma)
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Configurar variáveis de ambiente
Write-Host "⚙️  Configurando variáveis de ambiente..." -ForegroundColor Cyan
$env:PATH += ";C:\Program Files\nodejs"
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/aurum_plataforma"
$env:PORT = "3001"

Write-Host "   ✅ Porta configurada: 3001" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🚀 INICIANDO SERVIDOR NA PORTA 3001..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Servidor Next.js iniciando..." -ForegroundColor Cyan
Write-Host "🌐 Acesse: http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "💡 DICA: Use para testar com outro usuário!" -ForegroundColor Yellow
Write-Host "   🔴 Porta 3000: Admin" -ForegroundColor White
Write-Host "   🔵 Porta 3001: Estudante" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Para parar: Pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor na porta 3001
npm run dev -- -p 3001

