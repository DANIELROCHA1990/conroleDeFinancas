# Controle de Financas

Aplicacao `Next.js 16` com `App Router`, `TypeScript` estrito, `Supabase`, `Tailwind CSS`, `Zod`, `Recharts`, `jsPDF` e testes com `Vitest`.

## Arquitetura

O projeto foi organizado por dominios em `src/features`, UI compartilhada em `src/components`, integracoes em `src/lib` e schema SQL em `supabase/migrations`.

Referencias principais:

- [docs/architecture.md](/d:/Daniel/Projetos/controleDeFinancas/docs/architecture.md)
- [supabase/migrations/20260613090000_initial_schema.sql](/d:/Daniel/Projetos/controleDeFinancas/supabase/migrations/20260613090000_initial_schema.sql)

## Stack

- Next.js 16.2.9
- React 19.2.4
- Tailwind CSS 4
- Supabase Auth + PostgreSQL
- Zod + React Hook Form
- Recharts
- jsPDF
- Vitest

## Ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
APP_ENCRYPTION_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` e `APP_ENCRYPTION_KEY` devem permanecer exclusivamente no server-side.

## Rodando localmente

```bash
npm install
npm run dev
```

## Banco e RLS

1. Crie um projeto no Supabase.
2. Rode a migration em `supabase/migrations`.
3. Ative Auth por e-mail/senha.
4. Confirme que todas as tabelas sensiveis estao com RLS ativa e policies por `auth.uid()`.

## Checklist tecnico

- Funcional agora:
- login e logout reais com Supabase Auth
- rotas protegidas
- CRUD real de categorias
- CRUD real de entradas
- CRUD real de despesas
- CRUD real de contas fixas
- CRUD real de reservas com aportes e retiradas
- CRUD real de cartoes
- compras parceladas com geracao automatica de parcelas
- relatorios consolidados com dados reais
- PDF consolidado do dashboard
- dashboard consumindo dados reais de categorias, entradas, despesas, reservas, cartoes e contas fixas

- Ainda pendente para concluir totalmente o escopo do `prompt_2.md`:
- faturas completas de cartao (`credit_card_bills`) e baixa/pagamento de fatura
- CRUD real de limites, notificacoes e lembretes
- relatorios com filtros reais completos por periodo, categoria e cartao
- PDF vinculado ao filtro ativo do relatorio
- eliminacao dos mocks remanescentes fora dos modulos agora funcionalizados

## Deploy na Vercel

1. Importe o repositorio na Vercel.
2. Configure as variaveis do `.env.example`.
3. Defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` como publicas.
4. Defina `SUPABASE_SERVICE_ROLE_KEY` e `APP_ENCRYPTION_KEY` apenas como server env vars.
5. Execute `npm run build`.

## Testes

```bash
npm run test
npm run lint
npm run typecheck
```
