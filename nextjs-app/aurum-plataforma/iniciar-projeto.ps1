# ========================================
# 🚀 Script de Inicialização - AURUM
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "   🏆 AURUM - Plataforma de Cursos" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Navegar para o diretório correto
$projectPath = "C:\Users\gusge\OneDrive\Documentos\programs\Aurum\AURUM\nextjs-app\aurum-plataforma"
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Configurar variáveis de ambiente
Write-Host "⚙️  Configurando variáveis de ambiente..." -ForegroundColor Cyan
$env:PATH += ";C:\Program Files\nodejs"
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/aurum_plataforma"

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "   💡 Instale o Node.js de: https://nodejs.org" -ForegroundColor Yellow
    pause
    exit
}

# Verificar PostgreSQL
Write-Host "🔍 Verificando PostgreSQL..." -ForegroundColor Cyan
$pgService = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq "Running") {
    Write-Host "   ✅ PostgreSQL está rodando" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  PostgreSQL não está rodando" -ForegroundColor Yellow
    Write-Host "   💡 Iniciando PostgreSQL..." -ForegroundColor Cyan
    Start-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "   🚀 INICIANDO SERVIDOR..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "📦 Servidor Next.js iniciando..." -ForegroundColor Cyan
Write-Host "🌐 Acesse: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "👥 CREDENCIAIS:" -ForegroundColor Cyan
Write-Host "   🔴 Admin: admin@aurum.com.br / admin123" -ForegroundColor White
Write-Host "   🔵 Estudante: joao@estudante.com / estudante123" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Para parar: Pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor
npm run dev

