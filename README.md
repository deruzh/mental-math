# Тренажёр устного счёта

Локальный клиентский тренажёр устного счёта на Vite + React + TypeScript + Tailwind.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Деплой на GitHub Pages

```bash
npm run deploy
```

После этого в настройках репозитория установите источник GitHub Pages: ветка `gh-pages`, папка `/ (root)`.

## Добавление нового генератора

1. Создайте файл `src/generators/<name>.ts` с фабрикой, возвращающей `Generator`.
2. Зарегистрируйте его в `src/generators/registry.ts`.
3. Добавьте соответствующий урок в `src/lessons/index.ts`.

Других изменений не требуется.
