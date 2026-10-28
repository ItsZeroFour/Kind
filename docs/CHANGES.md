# Доработки по ТЗ от 21.10.2026

Всё, что можно менять без кода, вынесено в админку. Значения по умолчанию взяты из ТЗ, поэтому после выкладки сайт сразу выглядит так, как описано в ТЗ, без ручной настройки.

## 1. Цена выезда $115

| Где | Что сделано | Где менять в админке |
|---|---|---|
| Плашки первого экрана, все страницы | «$115 service call» → **Diagnosis credited to repair** | Shared blocks → Trust badges → *Service call chip in the hero* |
| Подпись под кнопкой (короткая форма, /book, /contact) | **Service call credited toward the repair.** We quote before any work starts… | Booking form → Texts → *Service call line under the button* |
| Таблица «How the service call works», третья строка | **Diagnosis cost if you go ahead** | Shared blocks → Pricing block → *Calculation: last row* |

Цена $115 по-прежнему видна в блоке «How the service call works», в шаге 4 «How it works» и в карточках диагностики на /pricing. Настройка цены в Company & contacts не тронута.

Файлы: `src/components/sections/index.tsx`, `src/components/forms/LeadForm.tsx`, `src/content/model.ts`.

## 2. Ссылка «All pricing»

На страницах услуг ссылка «Full price list» заменена на **All pricing**. Текст ссылки меняется в Prices → Block on service pages → *Link to /pricing*.

Файл: `src/components/sections/pricing.tsx`.

## 3. Кнопки наборов обслуживания

- На /pricing кнопка «Book this service» ведёт на `/book?appliance=<название набора>&from=kit_pricing`, и форма открывается с уже выбранным набором.
- На страницах услуг (холодильник, посудомойка, стиралка, сушилка, обслуживание) под карточками наборов тоже есть такая кнопка.
- Наборы автоматически добавляются в список вариантов формы. Их названия берутся из категорий Maintenance в разделе Prices. Отключить это можно в Booking form → Maintenance kits.
- В заявке видно, что клиент пришёл с кнопки набора: «Maintenance kit button on /pricing».
- Текст кнопки меняется в Prices → *Button on maintenance kits*.

## 4. Страница /services/preventive-maintenance

- В Services у каждой услуги появилось поле **Page type**: Repair page или Maintenance page. Страница preventive-maintenance распознаётся как страница обслуживания автоматически.
- Для страниц обслуживания есть свой набор фраз: Site pages → *Maintenance page template*. Значения по умолчанию взяты из ТЗ:
  - Appliance care that prevents costly repairs
  - Book a maintenance visit
  - Choose your care kit
  - Ready to book your maintenance visit?
- Блок «How the service call works» на этой странице не показывается.
- Кнопка «Book online» и форма на этой странице больше не подставляют прибор «Other».

Файлы: `src/app/(site)/services/[slug]/page.tsx`, `src/components/sections/pricing.tsx`, `src/content/store.ts`.

## 5. Данные в заявке

Каждая заявка теперь несёт:
- **форму** понятными словами: «Home page, first screen form», «Service page form: /services/…», «City page form: …», «Booking page /book», «Contact page /contact», «Maintenance kit button on /pricing»;
- адрес страницы;
- прибор или набор (набор — отдельным полем);
- срочность, ZIP и комментарий;
- **источник**: Google Ads (с названием кампании), Meta ads, Microsoft Ads, UTM-метки, Google search (organic), ссылка с другого сайта, прямой заход;
- телефон в формате +1XXXXXXXXXX.

Куда уходят эти данные:
- **CRM / ИИ-агент.** В вебхук добавлен объект `summary` с понятными полями: form, page, appliance, kit, urgency, zip, comment, source, utm_*, gclid, fbclid. Полные данные, как и раньше, лежат в `lead`.
- **Email.** В письме появились строки Maintenance kit, Source, UTM и Form, а срочность вынесена в тему.
- **Admin → Leads.** В списке у каждой заявки строка «источник · форма». В карточке показаны набор, UTM и форма словами. В CSV добавлены колонки Source, UTM, gclid, fbclid и Form.

Комментарий в короткой форме: в Booking form → Texts можно включить необязательное поле «What's going on?» (*Comment field in the short form*). По умолчанию оно выключено, чтобы не менять первый экран.

Файлы: `src/lib/lead-labels.ts` (новый), `src/lib/leads.ts`, `src/lib/lead-dispatch.ts`, `src/lib/lead-store.ts`, `src/app/api/lead/route.ts`, `src/app/admin/(panel)/leads/*`, `src/app/admin/api/leads/route.ts`.

## 6. Чат: ответ на вопрос

Сделано: Integrations → **Chat widget**. Туда вставляется код виджета из любого сервиса, и он появляется на всех страницах. Виджет грузится после загрузки страницы, поэтому не тормозит первый экран.

Варианты:

| Вариант | Как заявки попадают в CRM | Комментарий |
|---|---|---|
| Чат Housecall Pro / ProsBuddy | Сразу в Housecall Pro | Лучший вариант, если CRM — Housecall Pro: ничего не надо связывать |
| Виджет вашего ИИ-агента (если у поставщика есть веб-чат) | Через того же агента | Один «мозг» и для звонков, и для чата |
| Универсальные чаты (Tidio, Crisp и т.п.) | Через Zapier или вебхук | Дополнительная подписка и настройка связки |

Цены зависят от тарифа выбранного сервиса, их нужно уточнить у поставщика.

На телефоне нижняя панель «Call / Book now» остаётся на месте. Если кнопка чата её перекрывает, поднимите кнопку в настройках самого чата (bottom offset / mobile position). Надёжно сдвинуть чужой виджет снаружи нельзя.

## 7. Отзывы из Google

- Integrations → **Reviews widget**: вставьте код Trustindex, Elfsight и т.п. Виджет появится в блоке «What customers say» на главной, на страницах услуг и городов и на /reviews.
- Пока нет ни отзывов, ни кода виджета:
  - блок скрыт;
  - пункт Reviews убран из меню и подвала;
  - /reviews без вступления и закрыта от индексации (noindex);
  - /reviews убрана из sitemap.

  Как только отзывы появляются, всё показывается автоматически.
- Разметка review / aggregateRating не добавлялась.
- Скрыть отдельный отзыв можно в кабинете самого виджета: в Trustindex и Elfsight это есть, дублировать модерацию на сайте не нужно.
- Из вставленного кода берутся только `<script src="https://…">` и `<div>` с атрибутами. Встроенные скрипты и обработчики вроде `onerror` отбрасываются.
- Отзывы-заглушки удалены и из значений по умолчанию, поэтому сброс раздела Reviews их не вернёт.

**Рекомендация.** Trustindex (есть бесплатный тариф) или Elfsight (платный, тарифы уточните на их сайте). Это быстрее и дешевле, чем подключать Google Places API, который отдаёт максимум 5 отзывов и требует ключ с оплатой.

## 8. Фото фоном первого экрана

- Logo & photos → **Home page first screen background**: отдельные фото для компьютера и телефона, переключатель и сила затемнения в процентах (по умолчанию 60 и 70).
- Если поля пустые, используются файлы `public/images/hero/kind-hero-desktop.webp` и `kind-hero-mobile.webp`. **Этих файлов сейчас нет в репозитории** (см. «Нужно от владельца»).
- Затемнение сделано градиентом: со стороны текста темнее, со стороны собаки светлее. Форма полупрозрачная (90%) с размытием фона.
- Контраст. За текстом затемнение не опускается ниже 88% при любой настройке. Даже над белым участком фото это даёт 4.7:1 для оранжевой надписи над заголовком и 5.2:1 для серого текста, то есть выше порога WCAG AA (4.5:1). Подзаголовок над фото сделан белым. Сторона с собакой следует настройке.
- Пока фото нет, первый экран выглядит как раньше.

Файлы: `src/components/sections/HeroBackground.tsx` (новый), `src/app/(site)/page.tsx`.

## 9. Редиректы 301

- Integrations → **Redirects (301)**: список «откуда → куда», который можно менять без кода.
- По умолчанию там есть /service-areas/aloha → /service-areas/beaverton и /service-areas/cornelius → /service-areas/forest-grove.
- UTM-метки при перенаправлении сохраняются.
- Aloha и Cornelius убраны из городов по умолчанию.

Файлы: `src/proxy.ts`, `src/lib/redirects.ts` (новые).

## 10. Google Search Console

- Поле для кода подтверждения уже было: Integrations → *Google Search Console verification*. Мета-тег выводится, когда поле заполнено.
- Сайт отвечает на адресе без www (www перенаправляется хостингом), но canonical, sitemap и JSON-LD указывали на www. Исправлено: все адреса теперь `https://kindappliancerepair.com/...`.
- Карту сайта для Search Console нужно отправлять по адресу **https://kindappliancerepair.com/sitemap.xml**, а не www, как было в ТЗ.

## 11. Передача кода

См. `docs/DEPLOY.md` и `.env.example`.

## Нужно от владельца

1. **Фото первого экрана.** Загрузите kind-hero-desktop и kind-hero-mobile в Logo & photos → Home page first screen background или положите .webp-файлы в `public/images/hero/`. В репозитории их нет.
2. **Email для заявок.** Integrations → Lead emails. Отправка работает только при `RESEND_API_KEY` на сервере.
3. **Отзывы.** Создайте виджет в Trustindex (или аналоге), подключите Google Business Profile и вставьте код в Integrations → Reviews widget. Скрытие отдельных отзывов — в кабинете виджета.
4. **Чат.** Выберите вариант из пункта 6 и вставьте код в Integrations → Chat widget.
5. **Search Console.** Подтвердите сайт как ресурс-домен (DNS-запись у регистратора) или вставьте код в Integrations. Отправьте https://kindappliancerepair.com/sitemap.xml.
6. **Адрес сайта.** Если на сервере задан `NEXT_PUBLIC_SITE_URL` с www, это уже не важно: www отбрасывается в коде. Но лучше поправить значение на `https://kindappliancerepair.com`.

## Найдено и исправлено попутно

- **Сборка на новой базе.** На новой базе параллельные процессы сборки одновременно создавали админа из `.env` и падали с ошибкой «UNIQUE constraint failed». Та же гонка возможна при смене `ADMIN_EMAIL`. Исправлено в `src/lib/db.ts`.

## Проверено

- `npm run build` и `tsc` проходят без ошибок.
- Сквозная проверка на собранном сайте с отдельной тестовой базой и фейковым CRM-вебхуком. Использовался только номер +1 503 730 7116.
  - **Телефон.** 5037307116, 15037307116, (503) 730-7116, 503.730.7116, +1 503 730 7116 и 1-503-730-7116 приводятся к +15037307116. Номер 730-7116 и 11 цифр, начинающихся не с 1, отклоняются.
  - **Защита.** Бот, заполнивший скрытое поле-ловушку, получает «ok», но заявка не сохраняется и не отправляется. Запрос с чужого сайта получает 403. После 6 заявок с одного IP за 10 минут включается лимит (429).
  - **CRM.** Получает `summary` с набором, срочностью, комментарием, источником («Google Ads · campaign “care-kits”», «Meta ads») и названием формы.
  - **Админка.** Страницы Admin → Leads, карточка заявки и CSV открываются, новые разделы админки тоже.
  - **Сайт.** Отдельно проверены 301-редиректы (в том числе за nginx), скрытие и показ отзывов, страница обслуживания, наборы в форме и фон первого экрана.
- Визуально в браузере на живом телефоне не проверялось. Это стоит сделать после того, как появятся настоящие фото.
