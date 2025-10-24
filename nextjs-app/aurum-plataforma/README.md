# 🏆 AURUM - Plataforma de Educação Financeira

Plataforma completa de cursos online com sistema de progresso, comentários e gestão de alunos.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

✅ **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org)  
✅ **PostgreSQL** (versão 15 ou superior) - [Download](https://www.postgresql.org/download/windows/)  
✅ **npm** (vem automaticamente com o Node.js)

---

## 🚀 Como Rodar o Projeto

### **Método 1: Script Automatizado (Recomendado) ⚡**

1. Abra a pasta do projeto no Windows Explorer
2. Localize o arquivo **`iniciar-projeto.ps1`**
3. Clique com botão direito → **"Executar com PowerShell"**
4. Aguarde o servidor iniciar (15-30 segundos)
5. Acesse: **http://localhost:3000**

### **Método 2: Manual via PowerShell 💻**

#### **1️⃣ Abra o PowerShell e navegue até o projeto**
```powershell
cd "C:\Users\gusge\OneDrive\Documentos\programs\Aurum\AURUM\nextjs-app\aurum-plataforma"
```

#### **2️⃣ Configure as variáveis de ambiente**
```powershell
$env:PATH += ";C:\Program Files\nodejs"
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/aurum_plataforma"
```

#### **3️⃣ Instale as dependências** *(apenas na primeira vez)*
```powershell
npm install --legacy-peer-deps
```

#### **4️⃣ Execute as migrações do banco** *(apenas na primeira vez)*
```powershell
npx prisma migrate deploy
npx prisma generate
```

#### **5️⃣ Inicie o servidor**
```powershell
npm run dev
```

#### **6️⃣ Acesse no navegador**
```
http://localhost:3000
```

---

## 👥 Credenciais de Acesso

### 🔴 **Administrador**
```
📧 Email: admin@aurum.com.br
🔑 Senha: admin123
```
**Permissões:**
- Responder dúvidas dos estudantes
- Gerenciar cursos e conteúdo
- Acessar painel administrativo

### 🔵 **Estudante Principal - João Silva**
```
📧 Email: joao@estudante.com
🔑 Senha: estudante123
```
**Status:** Já tem 3 aulas concluídas e comentários

### 🔵 **Outros Estudantes**
```
📧 maria@estudante.com | 🔑 estudante123
📧 pedro@estudante.com | 🔑 estudante123
```

---

## 🔄 Script Rápido (Copie e Cole)

Se você já rodou o projeto antes, use este script para iniciar rapidamente:

```powershell
cd "C:\Users\gusge\OneDrive\Documentos\programs\Aurum\AURUM\nextjs-app\aurum-plataforma"
$env:PATH += ";C:\Program Files\nodejs"
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/aurum_plataforma"
npm run dev
```

---

## ✨ Funcionalidades

### 🎥 **Sistema de Aulas**
- Player Vimeo integrado com API
- Progresso automático por aula
- Desbloqueio sequencial de conteúdo
- Marcação de aulas concluídas

### 👥 **Gestão de Usuários**
- Autenticação com JWT
- Perfis: Administrador e Estudante
- Dashboard personalizado por tipo de usuário
- Sistema de matrículas

### 💬 **Comentários e Dúvidas**
- Comentários públicos por aula
- Sistema de respostas em threads
- Admin pode responder oficialmente
- Todos os usuários podem interagir

### 📊 **Progresso do Aluno**
- Tracking automático de aulas assistidas
- Porcentagem de conclusão do curso
- Histórico completo de progresso
- Estatísticas por módulo

### 🎓 **Certificados**
- Geração automática ao concluir curso
- Download em PDF personalizado
- Dados do aluno e data de conclusão

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| **Next.js 15** | Framework React com SSR |
| **React 19** | Biblioteca UI |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Estilização |
| **Prisma ORM** | ORM para banco de dados |
| **PostgreSQL** | Banco de dados relacional |
| **JWT** | Autenticação |
| **Vimeo API** | Player de vídeos |
| **Radix UI** | Componentes acessíveis |
| **Bcrypt** | Criptografia de senhas |

---

## 📂 Estrutura do Projeto

```
nextjs-app/aurum-plataforma/
├── src/
│   ├── app/                      # Páginas e rotas (App Router)
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/           # Login, registro, JWT
│   │   │   ├── courses/        # CRUD de cursos
│   │   │   ├── lessons/        # Aulas e conteúdo
│   │   │   ├── comments/       # Sistema de comentários
│   │   │   ├── progress/       # Tracking de progresso
│   │   │   └── certificates/   # Geração de certificados
│   │   ├── cursos/             # Páginas de cursos
│   │   ├── dashboard/          # Dashboard do aluno
│   │   ├── admin/              # Painel administrativo
│   │   └── login/              # Autenticação
│   ├── components/              # Componentes React
│   │   ├── ui/                 # Componentes base (shadcn)
│   │   ├── VimeoPlayer.tsx     # Player personalizado
│   │   └── navigation.tsx      # Menu de navegação
│   ├── lib/                     # Utilitários
│   │   ├── auth.ts             # JWT e autenticação
│   │   ├── database.ts         # Cliente Prisma
│   │   ├── cache.ts            # Redis (opcional)
│   │   └── utils.ts            # Helpers gerais
│   └── types/                   # TypeScript types
├── prisma/
│   ├── schema.prisma           # Schema do banco
│   ├── migrations/             # Migrações SQL
│   └── seed.js                # Dados iniciais do curso
├── public/                      # Arquivos estáticos
├── .env                         # Variáveis de ambiente
├── .env.local                  # Variáveis locais (git ignore)
├── iniciar-projeto.ps1         # Script de inicialização
├── package.json                # Dependências NPM
└── README.md                   # Este arquivo
```

---

## 🎯 Estrutura do Curso AURUM

O curso está organizado em 4 módulos principais:

### **📚 Módulo 01: MENTALIDADE** (15 aulas)
Fundamentos da mentalidade financeira de sucesso, crenças limitantes, hábitos e mindset de longo prazo.

### **💰 Módulo 02: DINHEIRO, BANCOS E GOVERNOS** (10 aulas)
História do dinheiro, sistema financeiro, inflação, moedas fiduciárias e capitalismo.

### **💳 Módulo 03: DÍVIDAS, GASTOS E ORÇAMENTO** (10 aulas)
Controle financeiro, eliminação de dívidas, orçamento pessoal e primeiros passos para investir.

### **📈 Módulo 04: RENDA FIXA** (12 aulas)
Investimentos em renda fixa: Tesouro Direto, CDB, LCI, LCA, debêntures e como investir na prática.

**Total:** 47 aulas de conteúdo completo

---

## 🔧 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run seed` | Popula banco com dados do curso |
| `npm run lint` | Verifica código com ESLint |
| `npx prisma studio` | Abre interface visual do banco de dados |
| `npx prisma migrate dev` | Cria nova migração |
| `npx prisma migrate deploy` | Aplica migrações no banco |
| `npx prisma generate` | Gera cliente Prisma |

---

## 🐛 Solução de Problemas

### ❌ **"npm não é reconhecido"**
**Causa:** Node.js não está no PATH  
**Solução:**
```powershell
$env:PATH += ";C:\Program Files\nodejs"
```

### ❌ **"PostgreSQL não conecta"**
**Causa:** Serviço do PostgreSQL não está rodando  
**Solução:**
```powershell
Get-Service -Name "*postgres*"
Start-Service -Name "postgresql-x64-17"
```

### ❌ **"Erro de migração do Prisma"**
**Causa:** Banco desatualizado ou corrompido  
**Solução:**
```powershell
$env:PGPASSWORD="postgres"
psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS aurum_plataforma;"
psql -U postgres -h localhost -c "CREATE DATABASE aurum_plataforma;"
npx prisma migrate deploy
npx prisma generate
```

### ❌ **"Vídeos não carregam"**
**Causa:** Vídeos do Vimeo com configuração de privacidade incorreta  
**Solução:**
1. Acesse as configurações do vídeo no Vimeo
2. Em **Privacy**, selecione "Anyone" ou "Hide from Vimeo"
3. Em **Where can this be embedded?**, selecione "Anywhere"
4. Remova qualquer senha do vídeo

### ❌ **"Cache desatualizado / Página não atualiza"**
**Causa:** Cache do Next.js com dados antigos  
**Solução:**
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### ❌ **"Erro ao fazer login"**
**Causa:** Usuários não foram criados  
**Solução:**
Use a rota de desenvolvimento para criar usuários:
```
http://localhost:3000/api/dev/create-users
```

---

## 📝 Variáveis de Ambiente

O projeto usa variáveis de ambiente para configuração. O arquivo `.env` já está configurado com:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aurum_plataforma"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

Para configurações adicionais (produção), crie um arquivo `.env.local`:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"

# Autenticação
JWT_SECRET="chave-secreta-muito-segura"
NEXTAUTH_SECRET="outra-chave-secreta"
NEXTAUTH_URL="https://seu-dominio.com"

# Cache (Opcional)
REDIS_URL="redis://localhost:6379"

# Vimeo (Opcional)
VIMEO_ACCESS_TOKEN="seu-token-vimeo"

# Pagamentos (Futuro)
MERCADOPAGO_ACCESS_TOKEN="seu-token-mp"
MERCADOPAGO_WEBHOOK_SECRET="seu-webhook-secret"
```

---

## 🎯 Fluxo de Uso da Plataforma

### **Para Estudantes:**
1. Acesse `/login` e faça login
2. Veja o curso disponível em `/cursos`
3. Entre no curso AURUM
4. Assista as aulas em ordem sequencial
5. Comente suas dúvidas em cada aula
6. Acompanhe seu progresso no dashboard
7. Receba certificado ao concluir 100%

### **Para Administradores:**
1. Acesse `/login` com credenciais de admin
2. Entre no curso para ver comentários dos alunos
3. Responda dúvidas nos comentários
4. Acesse `/admin/dashboard` para gestão
5. Acompanhe progresso dos alunos

---

## 📊 Status do Projeto

| Funcionalidade | Status |
|----------------|--------|
| Autenticação JWT | ✅ Completo |
| Gestão de Cursos | ✅ Completo |
| Player Vimeo | ✅ Completo |
| Sistema de Comentários | ✅ Completo |
| Progresso do Aluno | ✅ Completo |
| Certificados PDF | ✅ Completo |
| Dashboard Admin | ✅ Completo |
| Dashboard Aluno | ✅ Completo |
| Pagamentos MercadoPago | 🚧 Em desenvolvimento |
| Notificações Email | 🚧 Planejado |
| Chat em Tempo Real | 🚧 Planejado |

---

## 👨‍💻 Desenvolvimento

### **Primeiro Setup (Completo)**

```bash
# 1. Clonar repositório (se aplicável)
git clone <url-do-repo>
cd nextjs-app/aurum-plataforma

# 2. Instalar dependências
npm install --legacy-peer-deps

# 3. Configurar variáveis de ambiente
# Edite o arquivo .env com suas credenciais

# 4. Configurar banco de dados
npx prisma migrate deploy
npx prisma generate

# 5. Popular banco com dados do curso
npm run seed

# 6. Criar usuários de teste
# Acesse: http://localhost:3000/api/dev/create-users

# 7. Iniciar desenvolvimento
npm run dev
```

### **Modificar Estrutura do Banco**

```bash
# 1. Edite prisma/schema.prisma

# 2. Crie uma migração
npx prisma migrate dev --name descricao_da_mudanca

# 3. Gere o cliente Prisma
npx prisma generate
```

### **Adicionar Novos Vídeos**

1. Edite `prisma/seed.js`
2. Substitua os `videoId` pelos IDs reais do Vimeo
3. Execute: `npm run seed`

---

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Autenticação com JWT
- ✅ Tokens com expiração configurável
- ✅ Proteção de rotas por role (ADMIN/STUDENT)
- ✅ Validação de dados no backend
- ✅ Sanitização de inputs
- ⚠️ **IMPORTANTE:** Altere as chaves secretas em produção!

---

## 📄 Licença

Todos os direitos reservados © 2025 AURUM Academy

---

## 🤝 Suporte e Recursos

- 📖 [Documentação Next.js](https://nextjs.org/docs)
- 🗄️ [Documentação Prisma](https://www.prisma.io/docs)
- 🎥 [API Vimeo](https://developer.vimeo.com)
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs)
- 🧩 [Radix UI](https://www.radix-ui.com)

---

## 📞 Contato

- 🐛 Reportar Bug: Crie uma issue no repositório
- 💡 Sugestões: Entre em contato com a equipe
- 📧 Email: suporte@aurum.com.br

---

**Desenvolvido com ❤️ pela AURUM Academy**

*Última atualização: Outubro 2025*
