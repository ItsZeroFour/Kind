# Как развернуть и обновить сайт

Сайт — приложение Next.js 16 (Node.js 22.13 или новее). Тексты, цены, заявки и пользователи админки хранятся в базе SQLite в папке `data/`, загруженные фото — в `data/uploads/`. Эту папку нужно бэкапить, в git её нет.

## Что лежит в репозитории

- `src/` — код сайта и админки (`/admin`).
- `deploy/kind.service` — служба systemd. `deploy/nginx.conf` — nginx перед приложением.
- `scripts/admin-user.mjs` — создать пользователя админки или сменить ему пароль. `scripts/backup.mjs` — резервная копия базы и фото.
- `.env.example` — список настроек сервера, без значений.
- `docs/CHANGES.md` — что сделано по ТЗ от 21.10.2026.

## Первая установка на сервер (Ubuntu)

```bash
# 1. Node.js 22+ и nginx
sudo apt install -y nginx
# Node.js 22: https://nodejs.org (или nvm)

# 2. Код
sudo mkdir -p /var/www/kind && sudo chown $USER /var/www/kind
git clone https://github.com/ItsZeroFour/Kind.git /var/www/kind
cd /var/www/kind
npm ci

# 3. Настройки: скопировать и заполнить
cp .env.example .env.production.local
nano .env.production.local     # ADMIN_EMAIL, ADMIN_PASSWORD, LEAD_WEBHOOK_URL и т.д.

# 4. Сборка и запуск
npm run build
sudo useradd --system kind 2>/dev/null; sudo chown -R kind /var/www/kind
sudo cp deploy/kind.service /etc/systemd/system/kind.service
sudo systemctl daemon-reload && sudo systemctl enable --now kind

# 5. nginx + HTTPS
sudo cp deploy/nginx.conf /etc/nginx/sites-available/kind
sudo ln -s /etc/nginx/sites-available/kind /etc/nginx/sites-enabled/kind
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d kindappliancerepair.com -d www.kindappliancerepair.com
```

Логи: `journalctl -u kind -f`.

## Обновление

```bash
cd /var/www/kind
npm run backup                 # копия базы и фото в backups/
git pull
npm ci
npm run build
sudo systemctl restart kind
```

Если сборка упала, сайт продолжает работать на старой версии, пока службу не перезапустили.

## Перенос на другой сервер

Скопируйте папку `data/` (или свежую копию из `backups/`) и файл `.env.production.local`, затем выполните шаги первой установки.

## Настройки сервера (.env.production.local)

| Переменная | Зачем |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Адрес сайта для canonical, sitemap и разметки: `https://kindappliancerepair.com` |
| `DATA_DIR` | Папка с базой и фото, по умолчанию `./data` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Вход в /admin. При смене пароль обновляется при следующем запуске |
| `ADMIN_TIMEZONE` | Часовой пояс в списке заявок |
| `LEAD_WEBHOOK_URL` | Webhook CRM (ProsBuddy). Удобнее задать в админке: Integrations → CRM, админка главнее. Повторы при сбоях идут сами, пока сервер запущен |
| `RESEND_API_KEY`, `LEAD_FROM_EMAIL` | Необязательно: копии заявок на email через Resend. Все заявки и так хранятся в Admin → Leads |
| `NEXT_PUBLIC_GTM_ID` и другие `NEXT_PUBLIC_*` | Запасные значения для аналитики. Всё это можно задать и в админке, админка главнее |

Ключи и пароли хранятся только на сервере, в git их не кладите.

## Доступы, которые должны быть у владельца

- Репозиторий GitHub (роль Owner или Admin).
- Сервер (SSH) и регистратор домена.
- Админка /admin: свой пользователь (`npm run admin:user`).
- Google Search Console, Google Business Profile, сервис отзывов, сервис чата.
