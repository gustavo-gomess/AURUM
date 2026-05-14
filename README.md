# Aurum — Plataforma de educação financeira

Monorepo enxuto: na raiz existem atalhos npm que delegam para a aplicação principal em **`aurum-plataforma/`** (Next.js). Use este documento como ponto de entrada para ambientes locais, deploy e visão geral da arquitetura.

---

## O que o projeto faz

- **Área do aluno:** login com JWT, painel em `/dashboard`, consumo de aulas (Vimeo), progresso por módulo/aula, comentários por aula com respostas, notificações quando há retorno às dúvidas, seção de perguntas do próprio usuário.
- **Administração:** gestão de usuários, visão de perguntas, cadastro/edição de lives (conteúdo ao vivo).
- **Público:** landing, blog em `(public)/blog`, checkout de assinatura (AbacatePay), página de confirmação de presença em eventos.
- **Banco:** PostgreSQL modelado com **Prisma 7** (cliente com adapter **`pg`**).

---

## Requisitos

| Ferramenta | Notas |
|------------|--------|
| **Node.js** | Recomendado **20 LTS** ou superior (compatível com Next.js 16). |
| **npm** | Acompanha o Node. |
| **PostgreSQL** | Versão recente (15+); o projeto usa URL única em `DATABASE_URL`. |

---

## Estrutura do repositório

```
Aurum/
├── package.json              # Scripts de conveniência: dev/build na pasta da app
└── aurum-plataforma/       # Aplicação Next.js (código-fonte, Prisma, scripts PowerShell)
    ├── prisma/             # schema.prisma, migrations, seed.js
    ├── public/
    ├── src/
    │   ├── app/            # App Router (páginas, layouts, API routes)
    │   ├── components/
    │   └── lib/            # auth, database (Prisma), AbacatePay, cache em memória, etc.
    ├── .env.example        # Modelo de variáveis (copiar para .env)
    ├── iniciar-projeto.ps1 # Windows: PATH + checagens + npm run dev (porta padrão)
    └── iniciar-porta-3001.ps1  # Mesmo fluxo na porta 3001 (dois browsers / perfis)
```

Documentação complementar gerada pelo time (mais detalhada por arquivo) pode existir em `aurum-plataforma/DOCUMENTACAO-PLATAFORMA.md`.

---

## Primeiro uso (qualquer SO)

1. **Criar o banco** `aurum_plataforma` (ou outro nome, desde que coincida com a URL).

2. **Configurar ambiente**

   ```bash
   cd aurum-plataforma
   cp .env.example .env
   ```

   Ajuste `DATABASE_URL` e, se for usar pagamentos reais ou webhooks, as chaves **AbacatePay** e `NEXT_PUBLIC_BASE_URL` (URL pública da app — usada em `returnUrl` / `completionUrl` do checkout).

3. **Instalar dependências e aplicar schema**

   ```bash
   npm install
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Dados de curso (módulos e aulas)**

   ```bash
   npm run seed
   ```

5. **Usuários de desenvolvimento**

   - Opção A — chamada HTTP: `POST /api/dev/create-users` (sem body).
   - Opção B — interface: abra `/setup` no navegador e execute o assistente (cria usuários, opcionalmente reseta e semeia usando token de admin).

   Credenciais criadas por **`/api/dev/create-users`** (ver código em `src/app/api/dev/create-users/route.ts`):

   | Perfil | E-mail | Senha |
   |--------|--------|--------|
   | Admin | `admin@aurum.com.br` | `admin123` |
   | Estudante | `estudante@teste.com` | `student123` |

6. **Subir o servidor de desenvolvimento**

   Na raiz do repositório:

   ```bash
   npm run dev
   ```

   Ou diretamente em `aurum-plataforma`:

   ```bash
   npm run dev
   ```

   O `package.json` da app usa **`next dev --turbopack`**. A porta padrão é **3000**; use `-p 3001` ou o script `iniciar-porta-3001.ps1` se precisar de duas instâncias.

---

## Windows: scripts PowerShell

- **`aurum-plataforma/iniciar-projeto.ps1`:** define PATH comum para Node e PostgreSQL 17, garante `DATABASE_URL` se não houver `.env`, copia `.env.example` → `.env` na primeira vez, sobe `npm run dev`.
- **`aurum-plataforma/iniciar-porta-3001.ps1`:** igual na prática, com `PORT=3001` e `npm run dev -- -p 3001`.

> Os scripts exibem credenciais antigas (`joao@estudante.com`) em algumas mensagens; a fonte de verdade para seeds de usuário é o endpoint **`create-users`** acima.

---

## Variáveis de ambiente

Todas as variáveis esperadas estão documentadas em **`aurum-plataforma/.env.example`**. Resumo:

| Variável | Obrigatório | Uso |
|----------|-------------|-----|
| `DATABASE_URL` | Sim | Conexão PostgreSQL para o Prisma. |
| `JWT_SECRET` | Opcional em dev | Assinatura dos JWT; em produção deve ser forte e estável. |
| `ABACATEPAY_API_KEY` | Para checkout | Integração AbacatePay (billing / assinatura). |
| `ABACATEPAY_WEBHOOK_SECRET` | Recomendado em prod | Validação de webhooks. |
| `ABACATEPAY_SUBSCRIPTION_PRODUCT_ID` | Se usar plano recorrente no fluxo v2 | ID do produto de assinatura no painel AbacatePay. |
| `NEXT_PUBLIC_BASE_URL` | Sim em fluxos de pagamento | Base para URLs de retorno e sucesso do checkout. |

Não há **NextAuth** nem **Redis** ativo no código atual: o módulo `src/lib/cache.ts` expõe uma interface compatível com Redis, mas a implementação é **em memória** (útil para desenvolvimento).

---

## Scripts npm

### Raiz (`Aurum/package.json`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | `cd aurum-plataforma && npm run dev` |
| `npm run build` | `cd aurum-plataforma && npm run build` |

### App (`aurum-plataforma/package.json`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Next.js com Turbopack (desenvolvimento). |
| `npm run build` | `prisma generate` + `next build`. |
| `npm run start` | Servidor de produção após build. |
| `npm run lint` | ESLint (Next). |
| `npm run seed` | Executa `prisma/seed.js` (curso, módulos, aulas). |
| `npm run migrate` | `prisma migrate deploy`. |
| `npm run postinstall` | `prisma generate` (útil em CI/hosting). |
| `npm run vercel-build` | Fluxo típico Vercel: generate + migrate deploy + build. |

---

## Conteúdo pedagógico no seed

O `prisma/seed.js` cria um curso principal (`id` fixo `aurum-course-id`), **cinco módulos** (mentalidade, dinheiro/bancos, dívidas/orçamento, renda fixa, renda variável) e **64 aulas** com IDs de vídeo Vimeo de exemplo. Ajuste títulos e `vimeoVideoId` no seed conforme o catálogo real.

**Lives** são entidades separadas (`model Live`); o cadastro é feito pela área admin (`/admin/lives`), não pelo seed do curso.

---

## Autenticação e autorização

- Login e registro em **`/api/auth/login`** e **`/api/auth/register`**; sessão no cliente via **JWT** armazenado (ex.: `localStorage`) e enviado no header **`Authorization: Bearer <token>`**.
- Senhas com **bcryptjs** (ver `src/lib/auth.ts`).
- Rotas admin no front (`/admin/*`) dependem de checagem no cliente; APIs sensíveis validam token e papel **`ADMIN`** individualmente.

---

## Rotas da API (referência)

Prefixo: `/api`. Autenticação: header `Authorization: Bearer …` quando indicado.

**Auth**

- `POST /api/auth/login` — corpo JSON: `email`, `password`.
- `POST /api/auth/register`
- `GET /api/auth/me` — usuário atual.

**Cursos, módulos e aulas**

- `GET /api/courses`, `GET /api/courses/[id]`
- `GET /api/modules`, `GET /api/modules/[id]`
- `GET /api/lessons`, `GET /api/lessons/[id]`

**Progresso**

- `GET /api/progress/[courseId]` — matrícula e progresso (cache em memória por ~30s no servidor).
- `POST /api/progress/update` — corpo: `courseId`, `moduleIndex`, `lessonIndex`, `completed`.

**Comentários e dúvidas**

- `GET/POST /api/lessons/[id]/comments`
- `GET /api/comments/my-questions` — perguntas do usuário logado.

**Notificações** (lista apenas não lidas no `GET`)

- `GET /api/notifications`
- `PUT /api/notifications` — corpo: `notificationId` (marca uma como lida).
- `DELETE /api/notifications` — marca todas como lidas.

**Usuários (admin)**

- `GET /api/users` — lista (admin).
- `GET /api/users/[id]`, `DELETE /api/users/[id]` — detalhe e exclusão (admin; não permite apagar a si mesmo).
- `PUT /api/users/profile` — atualizar perfil (e opcionalmente senha) do usuário autenticado.

**Lives**

- `GET /api/lives` — listagem (query `status` opcional).
- `POST /api/lives` — criar live (admin, Bearer).
- `GET /api/lives/[id]` — detalhe (público).
- `PUT /api/lives/[id]` — atualizar (admin).
- `DELETE /api/lives/[id]` — remover (admin).

**Pagamentos (AbacatePay)**

- `POST /api/payment/checkout` — inicia cobrança (PIX ou cartão conforme corpo).
- `POST /api/payment/webhook` — webhook do provedor.
- `GET /api/payment/status/[id]` — consulta de status.

**Desenvolvimento (não usar em produção exposta)**

- `POST /api/dev/create-users` — admin + estudante de teste.
- `POST /api/dev/reset-db` — requer Bearer de **admin** (apaga dados conforme implementação).
- `POST /api/dev/seed` — re-semear via API com token de admin.

**Outros**

- `POST /api/evento-presenca` — registro de presença em evento (fluxo público da landing).

---

## Frontend: navegação principal (logado)

Definido em `src/components/navigation.tsx`:

- **Home** → `/dashboard`
- **Aulas** → `/cursos/aurum-course-id` (ID do curso seed)
- **Live** → `/lives`
- Menu **Administração:** usuários, perguntas, lives.

Existem também páginas públicas (`/`, blog, checkout), login em `/login` e setup em `/setup`.

---

## Componente de certificado

Existe **`CertificateTemplate.tsx`** para exibição/layout de certificado na interface. **Não** há rotas dedicadas em `src/app/api/certificates/` no estado atual do repositório; qualquer fluxo de emissão em PDF ou download deve ser tratado como evolução da aplicação ou confirmado no código antes de documentar endpoints.

---

## Banco de dados e Prisma

- Schema: `aurum-plataforma/prisma/schema.prisma` (usuários, curso, módulos, aulas, matrículas, progresso, comentários, notificações, lives, assinaturas AbacatePay).
- Cliente singleton com adapter PostgreSQL: `src/lib/database.ts`.
- Nova migração local: `npx prisma migrate dev --nome_descritivo`.
- Apenas aplicar migrações existentes (CI/prod): `npx prisma migrate deploy`.

Se o schema estiver inconsistente com o banco apenas em ambiente de experimentação, **não** use `db push` em produção sem critério; prefira migrações versionadas.

---

## Build de produção

```bash
cd aurum-plataforma
npm install
npm run build
npm run start
```

Garanta `DATABASE_URL` e segredos corretos no ambiente. Em Vercel ou similar, use o script `vercel-build` ou replique `prisma generate` + `migrate deploy` + `next build`.

---

## Solução de problemas

| Sintoma | O que verificar |
|---------|------------------|
| Erro ao conectar no PostgreSQL | Serviço do banco ativo, `DATABASE_URL`, firewall/porta. |
| Prisma Client desatualizado | `npx prisma generate` após puxar alterações no schema. |
| Migrações falhando | Backup; `migrate deploy` na ordem; evitar editar migrações já aplicadas. |
| Login inválido após reset | Executar de novo `POST /api/dev/create-users` ou fluxo `/setup`. |
| JWT inválido entre ambientes | Mesmo `JWT_SECRET` usado na geração e na verificação. |
| Vídeos Vimeo não reproduzem | Privacidade do vídeo no Vimeo (“embed anywhere” / domínios permitidos). |
| Cache estranho em dev | Apagar pasta `.next` e subir de novo o `npm run dev`. |

---

## Segurança (checklist rápido)

- Trocar **`JWT_SECRET`** e chaves de pagamento em produção.
- Não expor publicamente rotas **`/api/dev/*`** em produção (proteger por rede, feature flag ou remoção do build).
- Revisar CORS e origens confiáveis se a API for consumida por outro domínio.
- Manter dependências atualizadas (`npm audit`).

---

## Licença e suporte

Todos os direitos reservados © 2026 Aurum / AURUM Academy (conforme política da organização).

Para dúvidas sobre código, prefira issues no repositório ou documentação interna do time.

---

## Referências externas

- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [AbacatePay](https://docs.abacatepay.com/) (conforme uso no SDK `abacatepay-nodejs-sdk`)
- [Vimeo — privacidade e embed](https://help.vimeo.com/)
