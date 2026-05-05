@AGENTS.md

# Kai Webber Portfolio — Claude Code Context

## Project Overview
Personal portfolio website being rebuilt from scratch. Dark, minimal aesthetic.
Scroll-snap single page with a separate photography page.

## Figma Design File
File key: 70zm4xmtPMABAo7e35zyYO
All sections are designed. Reference this for exact colors, spacing, and layouts.

## Design Tokens
- Background: #0d0d0f
- Surface: #141417
- Surface teal: #0f1e22
- Accent / Teal: #61c1d8
- White: #f0ede6
- Muted: #888888
- Border: rgba(255,255,255,0.08)
- Teal border: rgba(97,193,216,0.3)
- Font: Inter (Regular 400, Medium 500)
- Border radius: 12px tiles, 4px chips, 10px photo cards

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (scroll animations, card expand interaction)
- Supabase (Phase 2 — DB, storage, auth)

## Site Structure
Single scroll-snap portfolio page:
1. Hero — large type, "Kai / Webber." in teal, CTA buttons
2. Experience ("So far...") — two-column timeline, 5 entries
3. Projects ("Things I've built") — bento grid, 6 tiles, card expand interaction
4. Skills ("What I've worked with") — bento grid, Day-to-day featured tile
5. Contact ("Let's talk") — icon-only links

Separate page: /photography

## Scroll Behavior
Scroll-snap mandatory on y axis. Each section is 100vh.
Nav is fixed/sticky, 64px height, blur backdrop.
Sections animate in on scroll using Framer Motion (translateY + opacity).

## Projects — Card Expand Interaction
Click a project tile → it expands to fill the full bento area.
Other tiles slide off screen left/right based on position.
Expanded state shows: tag, title, subtitle, divider, description, chips, back button, link icon.
Uses Framer Motion layoutId for the expansion animation.
Image is a subtle full-bleed background tint (~12% opacity) with a bottom-to-solid fade gradient.

## Photography Page (/photography)
Three states:
1. Accordion view — single full-viewport photo, left/right navigation, FIT scaling (not fill), location label, "See all" + close buttons, region dot indicators
2. Region overview — 3 cards (Italy · Japan · California) with hero photo, region name, sub-locations, photo count
3. Region filtered view — masonry grid of that region's photos, breadcrumb nav, click photo enters accordion scoped to that region

## Photo Data (21 photos)
[paste the full photo list with filenames and locations here]

## Experience Data
[paste all 5 experience entries here]

## Projects Data
[paste all 6 projects with descriptions, chips, links, link types here]

## Skills Data
Day-to-day: C#, TypeScript, React, SQL
Languages: Python, Java, C++, C, JavaScript
Frontend: Next.js, Chakra UI, Tailwind, Figma, Bootstrap
APIs & Auth: REST, SOAP, OAuth, FDX, HTTP
ML: scikit-learn, PyTorch, U-Net
Tools: Git, Jira, Postman, Rider, VS Code, Octopus, Visual Studio
Hardware: Arduino, Embedded, SolidWorks, AutoCAD
Geo/Data: QGIS, Google Earth Engine, MATLAB
Infra: Docker, RabbitMQ

## Data Abstraction Layer
All data fetching goes through /lib/data.ts.
Phase 1: reads from /data/*.json static files.
Phase 2: swap internals to Supabase — interface stays identical.
Never fetch directly from components.

## Phase 1 (current)
Static JSON data, photos in /public/assets/photography/.
No backend. Deploy to Vercel.

## Phase 2 (next)
Migrate to Supabase. Tables: photos, resume, guitar_tabs.
Supabase project already created at [your project URL].

## Phase 3
/admin hidden route behind Supabase Auth.
Upload photos, swap resume, manage guitar tabs.
Guitar tabs served via signed URLs (private).
