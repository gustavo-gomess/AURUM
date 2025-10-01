# AURUM - Plataforma de Ensino

## 1\. Visão Geral do Projeto

O objetivo é desenvolver uma plataforma de e-learning para um único curso com cerca de 10 módulos e 30 vídeos, focada no acompanhamento de progresso do aluno. A ferramenta permitirá que os usuários comentem em cada vídeo para que o administrador responda às dúvidas, além de oferecer um painel completo para gestão de usuários (CRUD). O dashboard do aluno exibirá seu avanço e um carrossel com novidades sobre futuros projetos. Opcionalmente, será implementado um sistema de avaliação com 5 estrelas para criar um ranking dos vídeos mais bem votados.

## 2\. Tecnologias Utilizadas

  - **Frontend:** Next.js 15 (com React 19), Tailwind CSS, Radix UI
  - **Backend:** Next.js (API Routes), TypeScript
  - **Banco de Dados:** PostgreSQL com Prisma ORM
  - **Autenticação:** JWT (JSON Web Tokens) com bcrypt para hashing de senhas
  - **Cache:** Redis (implementado mas não configurado em produção)
  - **Pagamentos:** Mercado Pago
  - **Player de Vídeo:** Vimeo
  - **Geração de PDF:** Puppeteer
  - **CI/CD:** GitHub Actions, Docker
  - **Logging:** Winston, Axiom
  - **Rate Limiting:** LRU Cache

## 3\. Como Iniciar e Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento local.

### 3.1. Pré-requisitos

  - Node.js (versão 20 ou superior)
  - npm, yarn, pnpm ou bun
  - PostgreSQL (versão 14 ou superior - local ou serviço como Neon, Supabase, Railway)
  - Redis (opcional, para cache - pode ser uma instância local)
  - Docker (opcional, para rodar via contêiner)

### 3.2. Configuração do Ambiente

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    cd nextjs-app/aurum-plataforma
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    # ou
    bun install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz do diretório `nextjs-app/aurum-plataforma` e adicione as seguintes variáveis. Substitua os valores de exemplo pelos seus.

    ```env
    # URL da sua instância do PostgreSQL
    DATABASE_URL=postgresql://usuario:senha@localhost:5432/aurum_db?schema=public

    # Segredo para a geração de tokens JWT (use uma string longa e segura)
    JWT_SECRET=SEU_SEGREDO_SUPER_SECRETO

    # URL da sua instância do Redis (opcional)
    REDIS_URL=redis://localhost:6379

    # URL pública da sua aplicação (para webhooks e redirects)
    NEXT_PUBLIC_APP_URL=http://localhost:3000

    # Credenciais do Mercado Pago (obtenha no painel do Mercado Pago)
    MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN_DO_MERCADO_PAGO

    # (Opcional) Credenciais do Axiom para logging
    AXIOM_TOKEN=
    AXIOM_ORG_ID=
    AXIOM_PROJECT_ID=

    # (Opcional) Credenciais do Vimeo para vídeos
    VIMEO_ACCESS_TOKEN=
    ```

4.  **Configure o Banco de Dados:**
    Execute as migrations do Prisma para criar as tabelas no banco de dados:

    ```bash
    npx prisma migrate dev
    # ou para apenas gerar o cliente Prisma
    npx prisma generate
    ```

### 3.3. Rodando a Aplicação

Com as dependências instaladas e as variáveis de ambiente configuradas, inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.

### 3.4. Populando o Banco com Dados de Demonstração

Para facilitar o desenvolvimento e testes, existe uma API de seed que cria um curso completo com 6 módulos e 40 aulas:

1. **Primeiro, crie um usuário admin:**
   - Faça o registro através da API ou interface
   - Ou use a rota de desenvolvimento: `POST /api/dev/create-users`

2. **Execute o seed:**
   ```bash
   # Via API (com token de admin):
   POST http://localhost:3000/api/dev/seed
   Authorization: Bearer SEU_TOKEN_ADMIN
   ```

   Ou use o script batch no Windows:
   ```bash
   cd nextjs-app/aurum-plataforma
   .\seed-course.bat
   ```

Isso criará o curso "EDUCAÇÃO FINANCEIRA BÁSICA" com:
- Módulo 1: Mentalidade Financeira (15 aulas)
- Módulo 2: Orçamento Pessoal (5 aulas)
- Módulo 3: Investimentos Básicos (5 aulas)
- Módulo 4: Controle de Dívidas (5 aulas)
- Módulo 5: Planejamento Financeiro (5 aulas)
- Módulo Extra: Conteúdo Bônus (5 aulas)

## 4\. Análise Detalhada da Estrutura e Classes

### 4.1. Estrutura de Diretórios

```
.
├── src/
│   ├── app/                  # Rotas e páginas da aplicação (App Router)
│   │   ├── api/              # Endpoints da API
│   │   │   ├── auth/         # Rotas de autenticação (login, registro)
│   │   │   ├── courses/      # Rotas para CRUD de cursos
│   │   │   ├── modules/      # Rotas para CRUD de módulos
│   │   │   ├── lessons/      # Rotas para CRUD de aulas
│   │   │   ├── users/        # Rotas para gerenciamento de usuários
│   │   │   ├── progress/     # Rotas para acompanhamento de progresso
│   │   │   ├── comments/     # Rotas para comentários
│   │   │   ├── certificates/ # Rotas para certificados
│   │   │   └── webhooks/     # Webhooks (ex: Mercado Pago)
│   │   ├── admin/            # Páginas do painel administrativo
│   │   ├── cursos/           # Página de visualização de um curso
│   │   ├── dashboard/        # Dashboard do aluno
│   │   ├── login/            # Página de login
│   │   └── page.tsx          # Página inicial (landing page)
│   ├── components/           # Componentes React reutilizáveis
│   │   └── CertificateTemplate.tsx
│   ├── lib/                  # Módulos de suporte e utilitários
│   │   ├── auth.ts           # Funções de autenticação (JWT, bcrypt)
│   │   ├── cache.ts          # Configuração e conexão com Redis
│   │   ├── logger.ts         # Configuração do logger (Winston)
│   │   ├── mongodb.ts        # Conexão com o banco de dados MongoDB
│   │   └── rateLimit.ts      # Middleware de limitação de requisições
│   ├── models/               # Schemas e Models do Mongoose
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Module.ts
│   │   ├── Lesson.ts
│   │   ├── Enrollment.ts
│   │   └── Comment.ts
│   └── middleware.ts         # Middleware do Next.js para proteção de rotas
├── public/                 # Arquivos estáticos
├── .env.local              # Arquivo de variáveis de ambiente (não versionado)
├── Dockerfile              # Configuração do contêiner Docker
├── next.config.ts          # Configuração do Next.js
└── package.json            # Dependências e scripts do projeto
```

### 4.2. Análise do Schema do Prisma (PostgreSQL)

O schema do Prisma define a estrutura das tabelas no banco de dados PostgreSQL. Localização: `prisma/schema.prisma`

#### **Model User**
  - `id`: CUID, chave primária
  - `name`: String (máx. 60 caracteres)
  - `email`: String, único
  - `password`: String (hash bcrypt)
  - `role`: Enum (ADMIN | STUDENT), padrão: STUDENT
  - `createdAt`, `updatedAt`: Timestamps automáticos
  - **Relacionamentos**: enrollments (1:N), comments (1:N), answeredComments (1:N)

#### **Model Course**
  - `id`: CUID, chave primária
  - `title`: String (máx. 100 caracteres)
  - `description`: String
  - `instructor`: String
  - `price`: Decimal (10,2)
  - `createdAt`, `updatedAt`: Timestamps automáticos
  - **Relacionamentos**: modules (1:N), enrollments (1:N)

#### **Model Module**
  - `id`: CUID, chave primária
  - `title`: String (máx. 100 caracteres)
  - `description`: String (opcional)
  - `order`: Integer
  - `courseId`: String, foreign key para Course
  - `createdAt`, `updatedAt`: Timestamps automáticos
  - **Relacionamentos**: course (N:1), lessons (1:N)
  - **Cascata**: Delete cascade ao deletar curso

#### **Model Lesson**
  - `id`: CUID, chave primária
  - `title`: String (máx. 100 caracteres)
  - `description`: String (opcional)
  - `vimeoVideoId`: String
  - `order`: Integer
  - `tasks`: Array de strings
  - `moduleId`: String, foreign key para Module
  - `courseId`: String, foreign key para Course
  - `createdAt`, `updatedAt`: Timestamps automáticos
  - **Relacionamentos**: module (N:1), comments (1:N)
  - **Cascata**: Delete cascade ao deletar módulo

#### **Model Enrollment**
  - `id`: CUID, chave primária
  - `userId`: String, foreign key para User
  - `courseId`: String, foreign key para Course
  - `enrolledAt`: DateTime (padrão: now)
  - `completedAt`: DateTime (opcional)
  - **Relacionamentos**: user (N:1), course (N:1), progress (1:N)
  - **Constraint**: Unique index em (userId, courseId) para evitar matrículas duplicadas
  - **Cascata**: Delete cascade ao deletar usuário ou curso

#### **Model Progress**
  - `id`: CUID, chave primária
  - `enrollmentId`: String, foreign key para Enrollment
  - `moduleIndex`: Integer
  - `lessonIndex`: Integer
  - `completed`: Boolean (padrão: false)
  - `completedAt`: DateTime (opcional)
  - **Relacionamentos**: enrollment (N:1)
  - **Constraint**: Unique index em (enrollmentId, moduleIndex, lessonIndex)
  - **Cascata**: Delete cascade ao deletar enrollment

#### **Model Comment**
  - `id`: CUID, chave primária
  - `userId`: String, foreign key para User
  - `lessonId`: String, foreign key para Lesson
  - `content`: String
  - `timestamp`: DateTime (padrão: now)
  - `parentId`: String (opcional), para respostas a comentários
  - `answeredBy`: String (opcional), foreign key para User (admin)
  - `answerContent`: String (opcional)
  - **Relacionamentos**: user (N:1), lesson (N:1), parent (N:1), replies (1:N), answeredByUser (N:1)
  - **Cascata**: Delete cascade ao deletar usuário ou aula

### 4.3. Análise das Rotas da API (`src/app/api`)

A API segue o padrão RESTful e utiliza o App Router do Next.js.

  - **`auth/`**:
      - `login`: Autentica o usuário e retorna um token JWT.
      - `register`: Cria um novo usuário.
      - `me`: Retorna os dados do usuário logado (baseado no token).
  - **`courses/`**:
      - `GET /api/courses`: Lista todos os cursos.
      - `POST /api/courses`: Cria um novo curso (requer admin).
      - `GET /api/courses/[id]`: Retorna um curso específico (com cache no Redis).
      - `PUT /api/courses/[id]`: Atualiza um curso (requer admin).
      - `DELETE /api/courses/[id]`: Deleta um curso (requer admin).
  - **`progress/`**:
      - `POST /api/progress/update`: Atualiza o progresso de uma aula para o usuário logado.
  - **`users/`**:
      - `GET /api/users`: Lista todos os usuários (requer admin).
      - `GET /api/users/[id]`: Retorna um usuário e suas matrículas (requer admin ou o próprio usuário).
      - `PUT /api/users/[id]`: Atualiza o papel de um usuário (requer admin).
  - **`webhooks/`**:
      - `POST /api/webhooks/mercadopago`: Recebe notificações do Mercado Pago para processar pagamentos e matrículas.
  - **`certificates/`**:
      - `GET /api/certificates/check-completion`: Verifica se um usuário completou um curso.
      - `GET /api/certificates/generate`: Gera o PDF do certificado usando Puppeteer.

### 4.4. Análise dos Componentes e Páginas Frontend

  - **`page.tsx` (Home)**: Landing page da plataforma, apresentando os cofundadores e cursos em destaque.
  - **`login/page.tsx`**: Formulário de login com lógica para autenticação via API.
  - **`dashboard/page.tsx`**: Painel do aluno, mostrando informações do perfil e cursos disponíveis.
  - **`cursos/[id]/page.tsx`**: Página de visualização do curso, com player de vídeo, lista de aulas, tarefas e seção de comentários.
  - **`admin/dashboard/page.tsx`**: Painel administrativo para gerenciamento de usuários, incluindo a visualização de progresso e alteração de papéis.

### 4.5. Análise dos Módulos de Suporte (`src/lib`)

  - **`auth.ts`**: Centraliza toda a lógica de JWT e hashing de senhas. Funções como `generateToken`, `verifyToken`, `hashPassword`, e `comparePassword` são exportadas daqui.
  - **`cache.ts`**: Configura a conexão com o Redis, que é usado para cachear dados de cursos e reduzir a carga no banco de dados (atualmente implementado mas não ativado).
  - **`logger.ts`**: Implementa o logging com Winston, configurado para salvar logs em arquivos (combined.log, error.log) e no console durante o desenvolvimento.
  - **`database.ts`**: Gerencia a conexão com o PostgreSQL através do Prisma Client, utilizando um padrão de cache global para evitar múltiplas conexões em ambientes serverless do Next.js.
  - **`rateLimit.ts`**: Fornece um middleware de limitação de requisições usando LRU Cache para proteger a API contra ataques de força bruta, especialmente nos endpoints de login e registro (5 requisições por minuto).
  - **`axiom.ts`**: Configuração para integração com Axiom para logging em produção.
  - **`utils.ts`**: Funções utilitárias gerais (provavelmente inclui helpers do Tailwind com clsx e tailwind-merge).

## 5\. Status Detalhado do Projeto

Esta seção apresenta uma análise completa do que foi implementado, o que está em progresso e o que ainda precisa ser desenvolvido.

### 5.1. ✅ FUNCIONALIDADES CONCLUÍDAS

#### **Autenticação e Autorização**
- ✅ Sistema de login com JWT
- ✅ Registro de usuários
- ✅ Hash de senhas com bcrypt
- ✅ Rate limiting em rotas sensíveis (5 req/min no login)
- ✅ Middleware de proteção para rotas admin
- ✅ Endpoint `/api/auth/me` para dados do usuário autenticado
- ✅ Roles (ADMIN e STUDENT)

#### **Banco de Dados**
- ✅ Migração completa de MongoDB para PostgreSQL + Prisma
- ✅ Schema completo com 7 models (User, Course, Module, Lesson, Enrollment, Progress, Comment)
- ✅ Relacionamentos configurados com cascade delete
- ✅ Índices únicos para evitar duplicatas (email, enrollment)
- ✅ Sistema de migrations configurado

#### **Sistema de Cursos**
- ✅ CRUD completo de cursos (create, read, update, delete)
- ✅ Estrutura de módulos e aulas (1 curso → N módulos → N aulas)
- ✅ Sistema de ordenação (modules e lessons têm campo `order`)
- ✅ Integração com Vimeo para vídeos
- ✅ API de seed para popular curso de demonstração (40 aulas em 6 módulos)
- ✅ Script `create-all-modules.js` para criação em massa

#### **Player de Vídeo**
- ✅ Componente VimeoPlayer funcional
- ✅ Integração com API do Vimeo
- ✅ Player responsivo

#### **Sistema de Progresso**
- ✅ Model Progress com tracking por aula
- ✅ API `/api/progress/update` para marcar aulas como concluídas
- ✅ Tracking de data de conclusão (completedAt)
- ✅ Verificação de curso completo para certificados

#### **Sistema de Comentários**
- ✅ CRUD de comentários por aula
- ✅ Sistema de respostas (parentId para threads)
- ✅ Campo para respostas de admin (answeredBy, answerContent)
- ✅ GET `/api/lessons/[id]/comments` e POST para criar

#### **Sistema de Pagamentos**
- ✅ Integração com Mercado Pago
- ✅ Criação de preferências de pagamento
- ✅ Webhook para processar pagamentos aprovados
- ✅ Criação automática de usuário após pagamento
- ✅ Matrícula automática após pagamento aprovado

#### **Geração de Certificados**
- ✅ Componente CertificateTemplate
- ✅ Geração de PDF com Puppeteer
- ✅ Verificação de conclusão do curso
- ✅ API `/api/certificates/generate`
- ✅ API `/api/certificates/check-completion`

#### **Interface do Usuário**
- ✅ Dashboard do aluno (StudentDashboard component)
- ✅ Página de visualização de curso com navegação entre aulas
- ✅ Sistema de tabs (Comentários e Materiais)
- ✅ Componentes UI com Radix UI (Avatar, Badge, Button, Card, Progress, Tabs, Textarea)
- ✅ Design system com Tailwind CSS
- ✅ Tema dark implementado
- ✅ Layout responsivo básico
- ✅ Navegação principal (Navigation component)
- ✅ Página de login funcional

#### **Logging e Monitoramento**
- ✅ Winston configurado para logs
- ✅ Integração com Axiom para logs em produção
- ✅ Logs de erro e info salvos em arquivos (combined.log, error.log)

#### **DevOps**
- ✅ Dockerfile configurado
- ✅ Scripts de setup (setup-completo.bat, setup-database.js)
- ✅ Ambiente de desenvolvimento configurado

---

### 5.2. ⚠️ FUNCIONALIDADES PARCIALMENTE IMPLEMENTADAS

#### **Cache com Redis**
- ⚠️ Código implementado em `src/lib/cache.ts`
- ❌ **FALTA**: Configuração em produção
- ❌ **FALTA**: Uso efetivo nas rotas (comentado no código)
- 📝 **TODO**: Ativar cache nas rotas de cursos e aulas

#### **Sistema de Progresso no Frontend**
- ⚠️ Backend completo
- ❌ **FALTA**: Botão "Marcar como Concluída" não está conectado à API
- ❌ **FALTA**: Barra de progresso real (atualmente com dados mockados)
- ❌ **FALTA**: Desbloqueio progressivo de aulas
- 📝 **TODO**: Conectar frontend com `/api/progress/update`

#### **Painel Administrativo**
- ⚠️ Estrutura criada em `/admin/dashboard`
- ❌ **FALTA**: Implementação completa da UI
- ❌ **FALTA**: Gerenciamento de usuários (CRUD)
- ❌ **FALTA**: Visualização de progresso dos alunos
- ❌ **FALTA**: Responder comentários
- 📝 **TODO**: Desenvolver páginas de admin completas

#### **Sistema de Notificações**
- ⚠️ TODO identificado no código (webhook do Mercado Pago linha 60)
- ❌ **FALTA**: Sistema de envio de emails
- ❌ **FALTA**: Email com credenciais após pagamento
- ❌ **FALTA**: Email de boas-vindas
- ❌ **FALTA**: Notificação de novos comentários
- 📝 **TODO**: Integrar com serviço de email (SendGrid, Resend, etc.)

#### **Materiais de Apoio**
- ⚠️ Tab "Materiais" criada na interface
- ❌ **FALTA**: Sistema de upload de arquivos
- ❌ **FALTA**: Storage para arquivos (S3, Cloudinary, etc.)
- ❌ **FALTA**: API para gerenciar materiais
- 📝 **TODO**: Implementar sistema completo de upload

---

### 5.3. ❌ FUNCIONALIDADES NÃO INICIADAS

#### **Autenticação Avançada**
- ❌ Recuperação de senha ("Esqueci minha senha")
- ❌ Verificação de email
- ❌ Login social (Google, Facebook)
- ❌ Two-Factor Authentication (2FA)

#### **Perfil de Usuário**
- ❌ Página de edição de perfil
- ❌ Upload de foto de perfil
- ❌ Alteração de senha pelo usuário
- ❌ Preferências de usuário

#### **Sistema de Avaliação**
- ❌ Avaliação de aulas com 5 estrelas (mencionado na visão do projeto)
- ❌ Ranking de vídeos mais bem votados
- ❌ Sistema de feedback qualitativo

#### **Gamificação**
- ❌ Sistema de pontos (há UI mockada no dashboard)
- ❌ Sistema de conquistas/badges
- ❌ Streak de dias seguidos (há UI mockada)
- ❌ Ranking de alunos

#### **Comunidade**
- ❌ Fórum de discussões
- ❌ Sistema de curtidas em comentários
- ❌ Notificações em tempo real
- ❌ Chat entre alunos

#### **Relatórios e Analytics**
- ❌ Dashboard de métricas para admin
- ❌ Relatório de progresso por aluno
- ❌ Analytics de engajamento
- ❌ Exportação de dados

#### **Landing Page e Marketing**
- ❌ Landing page completa (existe `/page.tsx` mas está básica)
- ❌ Página "Sobre nós"
- ❌ Página de FAQ
- ❌ Depoimentos de alunos
- ❌ Carrossel de novidades (mencionado na visão do projeto)

#### **Mobile e PWA**
- ❌ Progressive Web App (PWA)
- ❌ App mobile nativo
- ❌ Otimizações específicas para mobile

#### **Múltiplos Cursos**
- ❌ Sistema escalável para múltiplos cursos (atualmente focado em 1 curso)
- ❌ Página de catálogo de cursos
- ❌ Sistema de categorias

#### **Testes**
- ❌ Testes unitários
- ❌ Testes de integração
- ❌ Testes E2E
- ❌ Coverage configurado

---

### 5.4. 🔧 MELHORIAS TÉCNICAS NECESSÁRIAS

#### **Segurança**
- ⚠️ Middleware protege apenas `/admin/*` - outras rotas precisam de proteção
- ❌ Validação de input com Zod ou Joi (atualmente validações básicas)
- ❌ Rate limiting em todas as rotas sensíveis
- ❌ CORS configurado adequadamente
- ❌ Helmet para headers de segurança
- ❌ Sanitização de inputs contra XSS

#### **Performance**
- ❌ Paginação na API (users, courses, comments)
- ❌ Lazy loading de componentes
- ❌ Otimização de imagens com next/image
- ❌ Code splitting avançado
- ❌ Service Worker para cache

#### **Código**
- ❌ Tratamento de erros padronizado
- ❌ Componentização de páginas grandes (`cursos/[id]/page.tsx` tem 517 linhas)
- ❌ Estado global (Zustand/Redux) - atualmente usa localStorage
- ❌ Tipos TypeScript mais estritos (alguns `any` no código)
- ❌ Documentação de código (JSDoc)
- ❌ Variáveis de ambiente para magic numbers

#### **UI/UX**
- ❌ Sistema de feedback (toasts/notifications)
- ❌ Loading states consistentes
- ❌ Error states e error boundaries
- ❌ Animações e transições
- ❌ Auditoria de acessibilidade (a11y)
- ❌ Suporte a temas (dark/light mode toggle)
- ❌ Internacionalização (i18n)

#### **DevOps**
- ❌ CI/CD pipeline (GitHub Actions configurado mas não detalhado)
- ❌ Ambiente de staging
- ❌ Monitoramento de erros (Sentry)
- ❌ Backups automáticos do banco
- ❌ Health checks
- ❌ Deploy automatizado

---

### 5.5. 📋 RESUMO EXECUTIVO

**Estatísticas do Projeto:**
- ✅ **Concluído**: ~60% do core (autenticação, cursos, progresso, pagamentos, certificados)
- ⚠️ **Parcial**: ~15% (admin panel, cache, materiais, progresso no frontend)
- ❌ **Não Iniciado**: ~25% (avaliações, gamificação, múltiplos cursos, testes)

**Prioridades Sugeridas:**

**Alta Prioridade (Próximas Sprints):**
1. Conectar progresso do frontend com API
2. Implementar sistema de emails (credenciais pós-pagamento)
3. Completar painel administrativo básico
4. Adicionar validação de inputs (Zod)
5. Implementar sistema de feedback (toasts)

**Média Prioridade:**
6. Sistema de recuperação de senha
7. Edição de perfil
8. Sistema de materiais de apoio
9. Paginação na API
10. Testes unitários básicos

**Baixa Prioridade (Futuro):**
11. Sistema de avaliação com estrelas
12. Gamificação completa
13. Múltiplos cursos
14. PWA e mobile
15. Internacionalização

---

## 6\. Observações Importantes

### 6.1. Mudanças Técnicas Importantes
- **Migração de Banco de Dados**: O projeto foi migrado de MongoDB/Mongoose para PostgreSQL/Prisma. Isso afeta toda a camada de dados.
- **Pasta `src/models`**: Está vazia pois o projeto não usa mais Mongoose. Os schemas agora estão em `prisma/schema.prisma`.
- **Cache Redis**: Implementado mas não ativado em produção. Código está comentado nas rotas.

### 6.2. Arquivos de Configuração
- **`.env.local`**: Necessário criar manualmente (não está versionado por segurança)
- **`combined.log` e `error.log`**: Arquivos de log gerados automaticamente pelo Winston
- **Scripts .bat**: Scripts auxiliares para Windows (setup, seed, fix-videos, etc.)

### 6.3. Segurança
- Nunca commite o arquivo `.env.local` com credenciais reais
- A `JWT_SECRET` deve ser uma string longa e aleatória em produção
- As chaves do Mercado Pago devem ser configuradas para produção antes do deploy
- Redis não está sendo usado atualmente - pode ser removido das dependências se não for necessário

### 6.4. Desenvolvimento
- Use as rotas de desenvolvimento (`/api/dev/*`) apenas em ambiente local
- O endpoint de seed é protegido e requer autenticação de admin
- Há vários scripts JavaScript na raiz para tarefas específicas (cleanup, create modules, etc.)

---

## 7\. Contribuindo para o Projeto

### 7.1. Workflow de Desenvolvimento
1. Crie uma branch feature: `git checkout -b feature/nome-da-feature`
2. Faça suas alterações
3. Execute os testes (quando implementados)
4. Commit suas mudanças: `git commit -m "feat: descrição da feature"`
5. Push para o repositório: `git push origin feature/nome-da-feature`
6. Abra um Pull Request

### 7.2. Padrões de Código
- Use TypeScript para todos os novos arquivos
- Siga o padrão de nomenclatura do Next.js (App Router)
- Mantenha os componentes pequenos e reutilizáveis
- Documente funções complexas com JSDoc
- Use Prettier para formatação (configurar no futuro)

### 7.3. Commits
Siga o padrão Conventional Commits:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Formatação (sem mudança de código)
- `refactor`: Refatoração de código
- `test`: Adicionar ou modificar testes
- `chore`: Tarefas de manutenção

---

## 8\. Contato e Suporte

Para dúvidas sobre o projeto, entre em contato com a equipe AURUM.

**Última atualização do README:** 30 de Setembro de 2025
