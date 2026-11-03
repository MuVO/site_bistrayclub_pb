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

Это публичные значения, встраиваемые в статический сайт. Не храните здесь токены VK. Секреты функции должны оставаться только в окружении Yandex Cloud Function.

В **Settings → Pages → Build and deployment** выберите **GitHub Actions**. Workflow публикует собранный артефакт, а не содержимое исходной ветки.

## Локально

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Для локальной сборки задайте `PUBLIC_*` значения в окружении процесса или в игнорируемом `.env` (шаблон — `.env.example`). Не коммитьте реальные `.env`-файлы.
