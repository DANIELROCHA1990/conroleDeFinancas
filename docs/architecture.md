# Arquitetura proposta

## Direcao geral

- `src/app`: rotas, layouts e endpoints.
- `src/features`: modulos por dominio com componentes, services, hooks e validacoes locais.
- `src/components`: UI e layouts reutilizaveis.
- `src/lib`: clientes externos, seguranca, utilitarios, validadores compartilhados e PDF.
- `supabase/migrations`: schema SQL, RLS, indices, triggers e policies.

## Regras de separacao

- UI nao calcula regras financeiras criticas.
- Services concentram calculos de saldo, limite, previsao e parcelamento.
- Supabase fica isolado em `src/lib/supabase`.
- Campos privados como `notes_encrypted` e `private_notes_encrypted` devem ser cifrados server-side com AES-GCM usando `APP_ENCRYPTION_KEY`.
- `proxy.ts` faz redirecionamento inicial, mas a autorizacao real continua em `requireUser()` para evitar depender so de middleware/proxy.

## Fases de entrega

1. Fundacao Next.js + Tailwind + testes.
2. Schema Supabase + RLS.
3. Auth e rotas protegidas.
4. Layout desktop/mobile.
5. Modulos financeiros.
6. Relatorios, PDF e endurecimento de seguranca.
