# Calma — вебсистема масажного центру

Кваліфікаційна робота: автоматизація бізнес-процесів та обслуговування клієнтів масажного центру.
Next.js · TypeScript · Tailwind · Drizzle (libSQL) · Better Auth · Clerk · FSD.

## Запуск
```bash
npm install
cp .env.example .env.local   # вказати BETTER_AUTH_SECRET
npm run db:push
npm run db:seed
npm run dev
```
Clerk необов'язковий: додайте `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` і `CLERK_SECRET_KEY`.
Тестові акаунти — у `scripts/seed.ts`.

## Скрипти
`dev`, `build`, `lint`, `test`, `db:push`, `db:seed`.

## Документація
`docs/REPORT_PLAN.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/SCREENSHOTS.md`.

## Git-процес
`main` — стабільна гілка; нові функції — `feature/<назва>`, виправлення — `fix/<назва>`; злиття через pull request.