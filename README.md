# Kai Webber — Personal Portfolio Website

Welcome to the source code for my personal portfolio. A dark-first, scroll-snap single-page site with a photography gallery and a hidden admin panel for content management.

**Live:** [www.kaiwebber.com](https://www.kaiwebber.com)

---

## Project Structure

```
app/
├──page.tsx
├──photography/        # Photography gallery (region overview, grid, accordion viewer)
├──admin/              # Hidden admin panel (login, dashboard, photos, resume)
└──api/                # Server-side API routes (photos, resume)
components/
├──admin/
├──experience/
├──photography/
├──projects/
├──sections/
└──skills/
hooks/                # Custom React hooks (admin state, photo upload, auth)
lib/                  # Supabase clients, data helpers, storage utils
supabase/             # Database schema and migrations
```

---

## Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Animations** — Framer Motion
- **Database & Storage** — Supabase (PostgreSQL + object storage)
- **Auth** — Supabase Auth with MFA (TOTP)
- **Design** — Figma

---

## Local Development

```bash
npm install
```

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## License

Code is MIT licensed.
All content, writing, and photography ©Kai Webber. All rights reserved.
