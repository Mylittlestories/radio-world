# Radio World

A mobile-first progressive web app for browsing and streaming thousands of radio stations from every country, city, and genre around the world. Now also packaged for Android via Capacitor.

## Live web app

https://mylittlestories.github.io/radio-world/

## Features

- Browse stations by country and city/region
- Search stations by name, genre, or location with load-more pagination
- Stream stations directly in the browser
- Save favorites (requires free account)
- Explore trending, most-played, top-voted, and genre collections
- Rich station metadata: codec, bitrate, language, votes, play count, last check status, homepage link
- Accurate station icons with favicon + homepage fallback + generated initials
- Dark, easy-on-the-eyes UI optimized for phones
- Works as a PWA on Android and iPhone
- Android APK build via GitHub Actions

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Radio Browser API (free global radio directory)
- Supabase Auth + Database for favorites
- Capacitor for Android native wrapper

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Demo account

- Email: `demo@radioworld.app`
- Password: `password123`

## Build Android APK

The `android/` folder contains a Capacitor Android project.

### Option 1: GitHub Actions (easiest)

1. Go to your repo on GitHub: `https://github.com/Mylittlestories/radio-world`
2. Add these secrets under **Settings → Secrets and variables → Actions**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_AUTH_PROXY`
   
   You can find the values in the built `docs/assets/index-*.js` file, or in the original `.env`.
3. Go to **Actions → Build Android APK** and click **Run workflow**.
4. When the workflow finishes, download the APK artifact named `radio-world-debug-apk`.

### Option 2: Android Studio

1. Open the `android/` folder in Android Studio.
2. Sync Gradle and build.
3. Choose **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

## Deploy web updates

The `docs/` folder contains the static production build. GitHub Pages is configured to serve from `/docs` on the `main` branch.

To rebuild after changes:

```bash
npm run build
```

This updates the `docs/` folder. Commit and push to redeploy GitHub Pages.
