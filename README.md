# Пейнтбол-клуб «Быстрай»

Статический сайт на Astro. GitHub Actions собирает `dist/` и публикует его в GitHub Pages при push в `main` или вручную через `workflow_dispatch`.

## Настройки GitHub Actions

Добавьте в **Settings → Secrets and variables → Actions → Variables**:

| Переменная | Назначение |
| --- | --- |
| `SITE_DOMAIN` | Домен GitHub Pages; workflow создаёт `public/CNAME` при сборке |
| `PHONE_NUMBER` | Телефон для сайта и ссылки `tel:` |
| `CLUB_ADDRESS` | Адрес/название площадки |
| `OPENING_HOURS` | Часы работы |
| `PRICE_PER_PLAYER` | Цена игры за участника, числом |
| `MIN_PLAYERS` | Минимум игроков, числом |
| `INCLUDED_BALLS` | Количество шаров в базовом пакете, числом |
| `CONTACT_FUNCTION_URL` | Публичный URL функции для формы; можно оставить пустым, пока сервис не настроен |
| `MAP_ADDRESS` | Адрес, показываемый рядом с картой (по умолчанию: Челябинск, Уфимский тракт, 122/3) |
| `MAP_LATITUDE`, `MAP_LONGITUDE` | Координаты точки клуба; по умолчанию координаты КСК «Быстрай» |
| `MAP_ZOOM`, `MAP_LAYER` | Масштаб и слой Яндекс.Карт (`map`, `sat` или `skl`) |
| `MAP_PREVIEW_WIDTH`, `MAP_PREVIEW_HEIGHT` | Размер статичного изображения карты в пикселях |
| `MAP_MARKER_COLOR` | Цвет маркера в формате `#RRGGBB` |

Это публичные значения, встраиваемые в статический сайт. Не храните здесь токены VK. Секреты функции должны оставаться только в окружении Yandex Cloud Function.

В **Settings → Pages → Build and deployment** выберите **GitHub Actions**. Workflow публикует собранный артефакт, а не содержимое исходной ветки.

## Локально

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Для локальной разработки уже создан игнорируемый `.env.local` с публичными настройками сайта и карты. Те же безопасные отображаемые значения имеют встроенные defaults, поэтому данные видны и без файла `.env`. URL рабочей функции заявок по умолчанию пустой, локальные проверки не отправляют реальные заявки. Чтобы настроить значения, скопируйте `.env.example` в `.env.local` и меняйте параметры карты там. Не коммитьте реальные `.env`-файлы.

## SEO

Главная страница выводит title/description, Open Graph и Twitter Card, canonical для production, `noindex` для dev и страницы 404, JSON-LD (`WebSite`, `WebPage`, `SportsActivityLocation`), а также `robots.txt` и sitemap при заданном `PUBLIC_SITE_DOMAIN`. Не добавляйте отзывы, рейтинги и другие структурированные данные, если их нельзя подтвердить реальным содержимым сайта.
