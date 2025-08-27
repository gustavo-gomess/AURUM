Claro, aqui está uma análise detalhada e um README completo para o projeto AURUM.

# AURUM - Plataforma de Ensino

## 1\. Visão Geral do Projeto

AURUM é uma plataforma de ensino online (E-learning) construída com Next.js, MongoDB e outras tecnologias modernas. O projeto visa fornecer uma experiência robusta e escalável para administração de cursos, gerenciamento de usuários, acompanhamento de progresso e muito mais. A plataforma é projetada para ser conteinerizada com Docker, facilitando o deploy e a escalabilidade.

## 2\. Tecnologias Utilizadas

  - **Frontend:** Next.js (com React), Tailwind CSS
  - **Backend:** Next.js (API Routes), TypeScript
  - **Banco de Dados:** MongoDB com Mongoose
  - **Autenticação:** JWT (JSON Web Tokens) com bcrypt para hashing de senhas
  - **Cache:** Redis
  - **Pagamentos:** Mercado Pago
  - **Geração de PDF:** Puppeteer
  - **CI/CD:** GitHub Actions, Docker
  - **Logging:** Winston, Axiom
  - **Rate Limiting:** LRU Cache

## 3\. Como Iniciar e Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento local.

### 3.1. Pré-requisitos

  - Node.js (versão 20 ou superior)
  - npm, yarn, pnpm ou bun
  - MongoDB (pode ser uma instância local ou um serviço como o MongoDB Atlas)
  - Redis (pode ser uma instância local)
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
    # URL da sua instância do MongoDB
    MONGO_URI=mongodb://localhost:27017/aurum

    # Segredo para a geração de tokens JWT (use uma string longa e segura)
    JWT_SECRET=SEU_SEGREDO_SUPER_SECRETO

    # URL da sua instância do Redis
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

Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador para ver a aplicação em funcionamento.

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

### 4.2. Análise dos Models (Mongoose)

Os models definem a estrutura dos dados no MongoDB.

#### **User.ts**

  - **Interface `IUser`**: Define a estrutura de um documento de usuário.
  - **Schema `UserSchema`**:
      - `name`: `String`, obrigatório, máximo de 60 caracteres.
      - `email`: `String`, obrigatório, único e em minúsculas.
      - `password`: `String`, obrigatório, mínimo de 6 caracteres.
      - `role`: `String`, pode ser 'admin' ou 'student', com 'student' como padrão.
      - `courses`: Array de `ObjectId`s, referenciando o model `Course`. Armazena os cursos nos quais o usuário está matriculado.
  - **Timestamps**: Adiciona os campos `createdAt` e `updatedAt` automaticamente.

#### **Course.ts**

  - **Interface `ICourse`**: Define a estrutura de um documento de curso.
  - **Schema `CourseSchema`**:
      - `title`: `String`, obrigatório, máximo de 100 caracteres.
      - `description`: `String`, obrigatório.
      - `instructor`: `String`, obrigatório.
      - `price`: `Number`, obrigatório, não pode ser negativo.
      - `modules`: Array de `ObjectId`s, referenciando o model `Module`.

#### **Module.ts**

  - **Interface `IModule`**: Define a estrutura de um documento de módulo.
  - **Schema `ModuleSchema`**:
      - `title`: `String`, obrigatório, máximo de 100 caracteres.
      - `description`: `String`, opcional.
      - `lessons`: Array de um sub-schema `LessonSchema`, permitindo que as aulas sejam aninhadas diretamente no módulo.
      - `order`: `Number`, obrigatório, para definir a ordem dos módulos no curso.
      - `courseId`: `ObjectId`, obrigatório, referenciando o model `Course`.

#### **Lesson.ts**

  - **Interface `ILesson`**: Define a estrutura de um documento de aula.
  - **Schema `LessonSchema`**:
      - `title`: `String`, obrigatório, máximo de 100 caracteres.
      - `description`: `String`, opcional.
      - `vimeoVideoId`: `String`, obrigatório, para o ID do vídeo no Vimeo.
      - `order`: `Number`, obrigatório, para a ordem das aulas no módulo.
      - `tasks`: Array de `String`s, opcional.
      - `moduleId`: `ObjectId`, obrigatório, referenciando `Module`.
      - `courseId`: `ObjectId`, obrigatório, referenciando `Course`.

#### **Enrollment.ts**

  - **Interface `IEnrollment` e `IProgress`**: Define a matrícula e o progresso do aluno.
  - **Schema `EnrollmentSchema`**:
      - `user`: `ObjectId`, obrigatório, referenciando `User`.
      - `course`: `ObjectId`, obrigatório, referenciando `Course`.
      - `progress`: Array de `ProgressSchema`, armazenando o status de cada aula (concluída ou não).
      - `enrolledAt`: `Date`, data da matrícula.
      - `completedAt`: `Date`, data de conclusão do curso.
  - **Índice**: Um índice único em `user` e `course` para evitar matrículas duplicadas.

#### **Comment.ts**

  - **Interface `IComment`**: Estrutura para os comentários nas aulas.
  - **Schema `CommentSchema`**:
      - `userId`: `ObjectId`, referenciando `User`.
      - `lessonId`: `ObjectId`, referenciando `Lesson`.
      - `content`: `String`, o texto do comentário.
      - `parentId`: `ObjectId`, opcional, para respostas a outros comentários.
      - `answeredBy`: `ObjectId`, opcional, para a resposta do administrador.
      - `answerContent`: `String`, opcional, o conteúdo da resposta.

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
  - **`cache.ts`**: Configura a conexão com o Redis, que é usado para cachear dados de cursos e reduzir a carga no banco de dados.
  - **`logger.ts`**: Implementa o logging com Winston, configurado para salvar logs em arquivos e no console durante o desenvolvimento.
  - **`mongodb.ts`**: Gerencia a conexão com o MongoDB, utilizando um padrão de cache para evitar múltiplas conexões em ambientes serverless.
  - **`rateLimit.ts`**: Fornece um middleware de limitação de requisições para proteger a API contra ataques de força bruta, especialmente nos endpoints de login e registro.

## 5\. Próximos Passos e Melhorias (O que precisa ser feito)

Esta seção pode ser usada para guiar novos desenvolvedores sobre as tarefas pendentes e áreas para melhoria.

### 5.1. Funcionalidades a Implementar

  - **Recuperação de Senha**: Implementar um fluxo de "Esqueci minha senha" com envio de email e token de reset.
  - **Edição de Perfil**: Permitir que os usuários editem suas informações de perfil (nome, senha).
  - **Paginação na API**: Adicionar paginação nos endpoints que retornam listas (ex: `GET /api/users`, `GET /api/courses`).
  - **Upload de Arquivos**: Criar uma funcionalidade para que os instrutores possam fazer upload de materiais de apoio para as aulas.
  - **Notificações por Email**:
      - Enviar email de boas-vindas no registro.
      - Enviar email com credenciais temporárias após a compra (conforme `// TODO` no webhook do Mercado Pago).
      - Notificar administradores sobre novos comentários.
  - **Testes**: Escrever testes unitários e de integração para a API e componentes frontend. O `package.json` possui um script `test`, mas não há testes configurados.

### 5.2. Melhorias de Código e Arquitetura

  - **Validação de Entrada (API)**: Utilizar uma biblioteca como Zod ou Joi para validar os corpos das requisições na API, tornando o código mais robusto e seguro.
  - **Tratamento de Erros**: Padronizar e melhorar o tratamento de erros na API e no frontend para fornecer feedback mais claro ao usuário.
  - **Variáveis de Ambiente**: Mover todas as strings "mágicas" e configurações (como `expiresIn` do JWT) para variáveis de ambiente.
  - **Componentização**: Refatorar páginas grandes como `cursos/[id]/page.tsx` e `admin/dashboard/page.tsx` em componentes menores e mais gerenciáveis.
  - **Estado Global**: Para aplicações mais complexas, considerar o uso de uma biblioteca de gerenciamento de estado como Zustand ou Redux Toolkit para compartilhar o estado do usuário entre as páginas.
  - **Segurança**: Revisar as permissões de acesso em todas as rotas da API para garantir que apenas os usuários autorizados possam executar determinadas ações. O `middleware.ts` atual protege apenas rotas `/admin` e `/api/admin`. Outras rotas que exigem autenticação devem ser protegidas também.

### 5.3. Melhorias de UI/UX

  - **Responsividade**: Garantir que todas as páginas sejam totalmente responsivas para dispositivos móveis.
  - **Feedback ao Usuário**: Adicionar toasts ou notificações para ações como "Progresso salvo com sucesso" ou "Comentário enviado".
  - **Acessibilidade (a11y)**: Realizar uma auditoria de acessibilidade para garantir que a plataforma seja utilizável por todos.
