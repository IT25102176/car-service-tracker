# AutoServe - React Vite App

Converted from Next.js to React + Vite (JavaScript).

## Getting Started

```bash
npm install
npm run dev
```

## Key Changes from Next.js

- **Routing**: `next/link` → `react-router-dom` (`Link`, `useLocation`)
- **Entry point**: `src/main.jsx` with `BrowserRouter`
- **App shell**: `src/App.jsx` with `<Routes>` replacing `app/layout.tsx`
- **Pages**: `src/pages/` replacing `app/*/page.tsx`
- **TypeScript removed**: All `.tsx`/`.ts` → `.jsx`/`.js`
- **Next.js removed**: `'use client'`, `next/font`, `next/navigation`, `@vercel/analytics`
- **Tailwind**: `@tailwindcss/vite` plugin instead of PostCSS setup

## Project Structure

```
src/
├── main.jsx          # Entry point
├── App.jsx           # Routes + layout
├── index.css         # Global styles + Tailwind
├── lib/
│   ├── mockData.js   # Sample data
│   └── utils.js      # cn() utility
├── pages/            # Route pages
├── components/
│   ├── TopNav.jsx    # Navigation bar
│   ├── ui/           # Reusable UI components
│   ├── appointments/
│   ├── billing/
│   ├── maintenance/
│   ├── services/
│   ├── users/
│   └── vehicles/
```
