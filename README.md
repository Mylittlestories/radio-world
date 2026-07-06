# Radio World

A mobile-first progressive web app for browsing and streaming thousands of radio stations from every country and city around the world.

## Live app

https://mylittlestories.github.io/radio-world/

## Features

- Browse stations by country and city/region
- Search stations by name, genre, or location
- Stream stations directly in the browser
- Save favorites (requires free account)
- Dark, easy-on-the-eyes UI optimized for phones
- Works as a PWA on Android and iPhone

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Radio Browser API (free global radio directory)
- Supabase Auth + Database for favorites

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Demo account

- Email: `demo@radioworld.app`
- Password: `password123`

## Deploy

The `docs/` folder contains the static production build. GitHub Pages is configured to serve from `/docs` on the `main` branch.

To rebuild:

```bash
npm run build
```

This updates the `docs/` folder. Commit and push to redeploy GitHub Pages.
