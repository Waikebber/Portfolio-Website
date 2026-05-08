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

## License

Code is MIT licensed.
All content, writing, and photography ©Kai Webber. All rights reserved.
