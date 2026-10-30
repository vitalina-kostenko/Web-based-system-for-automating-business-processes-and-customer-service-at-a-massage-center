# Архітектура (Feature-Sliced Design)

`app/` у корені — лише маршрути Next.js (тонкі обгортки). Шари FSD лежать у `src/`.
Імпорти йдуть тільки вниз: `app → views → widgets → features → entities → shared`.

```
app/                 маршрути Next.js (page, layout, route handlers)
proxy.ts             Clerk-проксі (активний лише з ключами)
src/
  app/               провайдери (теми, Clerk), глобальні стилі
  views/             сторінки (*.page.tsx) — аналог FSD "pages"
  widgets/           app-shell, landing, stats-grid, revenue-chart, appointments-list
  features/          auth, book-appointment, manage-appointment, manage-service, toggle-theme
  entities/          appointment (типи, слоти, запити), service
  shared/            ui, lib (db, auth, utils), config
```

## Іменування
`*.component.tsx`, `*.page.tsx`, `*.actions.ts` (server actions), `*.queries.ts`, `*.types.ts`, `*.util.ts`, `*.config.ts`, `*.service.ts`, `*.client.ts`, `*.schema.ts`.
Кожен блок UI < 500 рядків, дрібні частини — окремі компоненти. Коментарі в коді лише `// interface`, `// component`, `// page`, `// return`.

## Автентифікація
- **Better Auth** — email/пароль, сесії в БД, ролі (`client`/`admin`).
- **Clerk** — додатковий вхід (вмикається ключами в `.env.local`).
- `getSessionUser()` об'єднує обидва джерела; `requireUser/requireAdmin` захищають сторінки та server actions.

## Безпека
Хешування паролів і rate limit — Better Auth; zod-валідація всіх server actions; повторна серверна перевірка слота; перевірка ролі та власника запису; ізоляція даних за `user_id`.

## Алгоритм слотів
`entities/appointment/lib/slots.util.ts`: перебір кроків 30 хв у робочих годинах, відсікання слотів у минулому, за межами дня та тих, що перетинаються з зайнятими інтервалами майстра. Складність O(S·B).
