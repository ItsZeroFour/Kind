# Kind Appliance Repair

Сайт [kindappliancerepair.com](https://kindappliancerepair.com) с админкой: тексты, цены, услуги, города, отзывы, заявки, интеграции.

**Стек:** Next.js 16, React 19, Tailwind 4, SQLite (`node:sqlite`). Node.js 22.13+.

## Запуск

```bash
npm ci
cp .env.example .env.local   # заполнить ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev                  # http://localhost:3000, админка на /admin
```

## Команды

| | |
|---|---|
| `npm run dev` | локальная разработка |
| `npm run build` / `npm start` | сборка и запуск |
| `npm run typecheck` | проверка типов |
| `npm run backup` | копия базы и фото в `backups/` |
| `npm run admin:user` | создать пользователя админки / сменить пароль |

## Структура

```
src/app/(site)    страницы сайта
src/app/admin     админка
src/app/api/lead  приём заявок
src/components    компоненты
src/content       модель контента и значения по умолчанию
src/lib           CRM, база, заявки, SEO
data/             база и загруженные фото (не в git)
deploy/           systemd и nginx
```

## Деплой

Подробно в [docs/DEPLOY.md](docs/DEPLOY.md). Коротко:

```bash
npm run backup
git pull && npm ci && npm run build
sudo systemctl restart kind
```

Тестовые заявки отправлять только с номером +1 503 730 7116: каждая заявка запускает SMS и звонок из CRM.
