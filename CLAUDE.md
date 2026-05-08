@AGENTS.md

# Kai Webber Portfolio — Claude Code Context

## Figma Design File
File key: 70zm4xmtPMABAo7e35zyYO
All sections are fully designed. Reference this file for exact colors,
spacing, typography, and layouts before writing any component.

## Design Tokens
```css
--bg:           #0d0d0f;
--surface:      #141417;
--surface-teal: #0f1e22;
--teal:         #61c1d8;
--teal-border:  rgba(97, 193, 216, 0.3);
--white:        #f0ede6;
--muted:        #888888;
--dim:          #444444;
--border:       rgba(255, 255, 255, 0.08);
--red:          #e64d4d;
--font:         Inter (400 Regular, 500 Medium, 600 Semi Bold);
--radius-tile:  12px;
--radius-card:  10px;
--radius-chip:  4px;
--radius-input: 6px;
--nav-height:   64px;
```

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (scroll animations, card expand interaction)
- Supabase (Phase 2 — DB, storage, auth)

## Project Structure phase 2
```
├── lib/
│   ├── data.ts                     ← abstraction layer (Phase 1: JSON, Phase 2: Supabase)
│   └── supabase.ts                 ← Phase 2
```

## TypeScript Types
```typescript
export interface Photo {
  id: string
  filename: string
  location: string        // "Shibuya, Tokyo"
  region: string          // "Japan" | "Italy" | "California"
  country: string         // "jpn" | "ita" | "usa"
  display_order: number
}

export interface Project {
  id: string
  title: string
  tag: string
  subtitle: string
  description: string
  chips: string[]
  link: string | null
  linkType: 'github' | 'doc' | null
  image: string
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  team: string | null
  location: string
  startDate: string
  endDate: string | null
  description: string
  type: 'work' | 'education'
}

export interface SkillGroup {
  category: string
  skills: string[]
  featured?: boolean
}
```

## Data Abstraction Layer (lib/data.ts)
ALL data fetching goes through this file. Never fetch directly from components.
Phase 1 reads from /data/*.json. Phase 2 swaps internals to Supabase — interface stays identical.

```typescript
// Phase 1 pattern:
export async function getPhotos(): Promise<Photo[]> {
  const data = await import('@/data/photos.json')
  return data.photos
}

// Phase 2 swap (only change the internals, never the signature):
// const { data } = await supabase.from('photos').select('*').order('display_order')
// return data
```

---

## Photo Data (21 photos)
```json
[
  { "filename": "ita_capri_tree.webp",               "location": "Capri, Italy",                        "region": "Italy",      "country": "ita", "display_order": 1  },
  { "filename": "ita_sorrento_cliff.webp",           "location": "Sorrento, Italy",                     "region": "Italy",      "country": "ita", "display_order": 2  },
  { "filename": "ita_vatican_clock.webp",            "location": "Vatican City",                        "region": "Italy",      "country": "ita", "display_order": 3  },
  { "filename": "ita_vatican_statue.webp",           "location": "Vatican City",                        "region": "Italy",      "country": "ita", "display_order": 4  },
  { "filename": "ita_villa_borghese.webp",           "location": "Villa Borghese, Rome",                "region": "Italy",      "country": "ita", "display_order": 5  },
  { "filename": "jpn_asakusa.webp",                  "location": "Senso-ji, Asakusa",                   "region": "Japan",      "country": "jpn", "display_order": 6  },
  { "filename": "jpn_dragon_roof.webp",              "location": "Nanzen-ji, Kyoto",                    "region": "Japan",      "country": "jpn", "display_order": 7  },
  { "filename": "jpn_harajuku.webp",                 "location": "Harajuku, Tokyo",                     "region": "Japan",      "country": "jpn", "display_order": 8  },
  { "filename": "jpn_kyoto_kiyomizu.webp",           "location": "Kiyomizudera, Kyoto",                 "region": "Japan",      "country": "jpn", "display_order": 9  },
  { "filename": "jpn_nanzenji.webp",                 "location": "Nanzen-ji, Kyoto",                    "region": "Japan",      "country": "jpn", "display_order": 10 },
  { "filename": "jpn_shibuya_night.webp",            "location": "Shibuya, Tokyo",                      "region": "Japan",      "country": "jpn", "display_order": 11 },
  { "filename": "jpn_shibuya_street.webp",           "location": "Shibuya, Tokyo",                      "region": "Japan",      "country": "jpn", "display_order": 12 },
  { "filename": "jpn_tenryuji_buddha.webp",          "location": "Tenryu-ji, Kyoto",                    "region": "Japan",      "country": "jpn", "display_order": 13 },
  { "filename": "jpn_tokyo_tower.webp",              "location": "Shibuya, Tokyo",                      "region": "Japan",      "country": "jpn", "display_order": 14 },
  { "filename": "usa_halfMoon_harbor.webp",          "location": "Pillar Point Harbor, Half Moon Bay",  "region": "California", "country": "usa", "display_order": 15 },
  { "filename": "usa_halfMoon_kayaks.webp",          "location": "Pillar Point Harbor, Half Moon Bay",  "region": "California", "country": "usa", "display_order": 16 },
  { "filename": "usa_halfMoon_miradaSurfBeach.webp", "location": "Mirada Surf Beach, Half Moon Bay",    "region": "California", "country": "usa", "display_order": 17 },
  { "filename": "usa_halfMoon_sail.webp",            "location": "Pillar Point Harbor, Half Moon Bay",  "region": "California", "country": "usa", "display_order": 18 },
  { "filename": "usa_halfMoon_surfersBeach.webp",    "location": "Surfers Beach, Half Moon Bay",        "region": "California", "country": "usa", "display_order": 19 },
  { "filename": "usa_montara_beach.webp",            "location": "Montara State Beach, Montara",        "region": "California", "country": "usa", "display_order": 20 },
  { "filename": "usa_montara_flower.webp",           "location": "Montara State Beach, Montara",        "region": "California", "country": "usa", "display_order": 21 }
]
```

## Experience Data (5 entries, reverse chronological)
```json
[
  {
    "id": "emoney-ogopogo",
    "role": "Associate Software Engineer",
    "company": "eMoney Advisor",
    "team": "Ogopogo Team",
    "location": "Radnor, PA",
    "startDate": "Mar 2026",
    "endDate": null,
    "description": "Full-stack premium features in C#, SQL, TypeScript, and React — analytics dashboards surfacing real-time client engagement metrics for advisor firms.",
    "type": "work"
  },
  {
    "id": "emoney-dataapi",
    "role": "Associate Software Engineer",
    "company": "eMoney Advisor",
    "team": "Data API Team",
    "location": "Radnor, PA",
    "startDate": "Sep 2025",
    "endDate": "Mar 2026",
    "description": "Owned two production API connectors end-to-end via HTTP, REST, and SOAP with OAuth/FDX. Built an in-house HTTP payload simulation tool for safe connector testing.",
    "type": "work"
  },
  {
    "id": "emoney-odin",
    "role": "Software Engineer Co-op",
    "company": "eMoney Advisor",
    "team": "Odin Team",
    "location": "Radnor, PA",
    "startDate": "Jan 2025",
    "endDate": "Aug 2025",
    "description": "Maintained C# data aggregation backend with RabbitMQ event-driven messaging. Piloted an Amazon Q proof-of-concept to automate internal workflows.",
    "type": "work"
  },
  {
    "id": "kostas",
    "role": "Data Scientist / Engineer Co-op",
    "company": "George Kostas Research Institute",
    "team": null,
    "location": "Burlington, MA",
    "startDate": "Jan 2023",
    "endDate": "Jun 2023",
    "description": "Neural network classification models in Python for multi-band satellite imagery and autonomous vehicle RGB/NRGB data.",
    "type": "work"
  },
  {
    "id": "neu",
    "role": "B.S. Computer Engineering & Computer Science",
    "company": "Northeastern University",
    "team": "Graduated Cum Laude",
    "location": "Boston, MA",
    "startDate": "Sep 2021",
    "endDate": "Aug 2025",
    "description": "Blended coursework in computer engineering and CS with 3 industry co-ops across ML research and software engineering.",
    "type": "education"
  }
]
```

## Projects Data (6 projects)
```json
[
  {
    "id": "rover",
    "title": "NU SEDS Mars Rover",
    "tag": "ROBOTICS",
    "subtitle": "Autonomous Navigation · SEDS Club",
    "description": "On Northeastern's SEDS rover team, I built out localization systems for autonomous navigation using RTK GPS and ZED stereo cameras. We competed at the Mars Society University Rover Challenge and placed in the top ten internationally.",
    "chips": ["Python", "RTK GPS", "ZED SDK", "ROS", "Localization"],
    "link": null,
    "linkType": null,
    "image": "rover.webp"
  },
  {
    "id": "ncaa",
    "title": "March Madness Predictor",
    "tag": "ML / PYTHON",
    "subtitle": "AI Class · Team Project",
    "description": "Built with a team of three for my Artificial Intelligence class — a machine learning tool that predicts NCAA tournament outcomes with a focus on identifying upsets. Used regression, neural networks, and Monte Carlo simulation on historical Kaggle data.",
    "chips": ["Python", "scikit-learn", "Monte Carlo", "Neural Networks"],
    "link": "https://github.com/Waikebber/CS-4100_MarchMadnessPredictor",
    "linkType": "github",
    "image": "march-madness.webp"
  },
  {
    "id": "unet",
    "title": "Image Classification Pipeline",
    "tag": "COMPUTER VISION",
    "subtitle": "Personal Project",
    "description": "Built a full pipeline for bird image segmentation — scraping data, labeling with the LabelBox API, automating mask generation at scale, and training a multi-class U-Net segmentation model. Prioritized end-to-end automation over one-off scripts.",
    "chips": ["PyTorch", "U-Net", "LabelBox", "Python"],
    "link": "https://github.com/Waikebber/Bird_Classifier",
    "linkType": "github",
    "image": "unet.webp"
  },
  {
    "id": "see",
    "title": "Assistive Device",
    "tag": "COMPUTER VISION",
    "subtitle": "Senior Capstone · Team Project",
    "description": "For my senior capstone, my team built a wearable system to help blind individuals navigate without a cane. I led the stereo vision module — obstacle detection and depth estimation using Python and Raspberry Pi cameras.",
    "chips": ["Stereovision", "C++", "Arduino", "Image Recognition"],
    "link": "https://drive.google.com/file/d/1EhjlG2TZQuKKzWXmu6aViNI0hB_jaIVP/view?usp=sharing",
    "linkType": "doc",
    "image": "stereovision.webp"
  },
  {
    "id": "ecg",
    "title": "ECG Signal Processor",
    "tag": "SIGNAL PROCESSING",
    "subtitle": "Circuits & Signals Class Project",
    "description": "Built an ECG signal processing system using an instrumentation amplifier, high-pass and low-pass filters, and a DAC to capture signals. Processed real-time data in MATLAB to compute BPM and display filtered results — hands-on across both the hardware circuit and software pipeline.",
    "chips": ["MATLAB", "Analog Design", "Signal Processing"],
    "link": "https://drive.google.com/file/d/1KOAOt0N7vxRpN-WjbBpYB8VZm4z5NxgU/view?usp=sharing",
    "linkType": "doc",
    "image": "ecg.webp"
  },
  {
    "id": "portfolio",
    "title": "This Portfolio",
    "tag": "NEXT.JS / REACT",
    "subtitle": "Personal Project",
    "description": "Rebuilt from scratch in Next.js, TypeScript, and Tailwind CSS. Scroll-snap navigation, bento grid layouts, and a dark-first design system. Designed in Figma before a single line of code was written.",
    "chips": ["Next.js", "TypeScript", "React", "Tailwind", "Figma"],
    "link": "https://github.com/Waikebber/Website",
    "linkType": "github",
    "image": "circuit.webp"
  }
]
```

## Skills Data
```json
[
  { "category": "Day-to-day", "skills": ["C#", "TypeScript", "React", "SQL"], "featured": true },
  { "category": "Languages",  "skills": ["Python", "Java", "C++", "C", "JavaScript"] },
  { "category": "Frontend",   "skills": ["Next.js", "Chakra UI", "Tailwind", "Figma", "Bootstrap"] },
  { "category": "APIs & Auth","skills": ["REST", "SOAP", "OAuth", "FDX", "HTTP"] },
  { "category": "ML",         "skills": ["scikit-learn", "PyTorch", "U-Net"] },
  { "category": "Tools",      "skills": ["Git", "Jira", "Postman", "Rider", "VS Code", "Octopus", "Visual Studio"] },
  { "category": "Hardware",   "skills": ["Arduino", "Embedded", "SolidWorks", "AutoCAD"] },
  { "category": "Geo / Data", "skills": ["QGIS", "Google Earth Engine", "MATLAB"] },
  { "category": "Infra",      "skills": ["Docker", "RabbitMQ"] }
]
```

---

## Nav
Sticky, 64px height, background #0d0d0f at 85% opacity, backdrop-filter blur.
"KW" logo left in teal, nav links right in muted gray.
Active section link highlights in teal — tracked via scroll position.
Links: Experience · Projects · Skills · Photography · Contact
Same nav used on photography page with "Photography" active.
Admin pages use a sidebar instead — no top nav.

---

## Section Designs

### Hero
- Eyebrow: "Software Engineer — San Francisco / New York" — teal, 12px, uppercase, wide letter-spacing
- Name: "Kai" (white, 96px) on one line, "Webber." (teal, 96px) on next line
- Subtitle: muted gray, 18px, max-width 520px, line-height 30px
- Two CTAs side by side: "View resume" (teal fill, dark text) + "Get in touch" (ghost, border only)
- Scroll indicator: short horizontal line + "scroll" text, bottom left
- Full 100vh, content left-aligned, vertically centered

### Experience ("So far...")
- Section label: "EXPERIENCE" in teal, 11px, wide letter-spacing
- Heading: "So far..." 40px, medium weight, white
- Two-column timeline layout: date + location left (dim gray), role/company/description right
- Company names in teal
- Horizontal dividers between entries (rgba white 6% opacity)
- 5 entries — see Experience Data above
- Education entry (Northeastern) uses same layout — role = degree, company = "Northeastern University — Graduated Cum Laude"

### Projects ("Things I've built")
- Section label: "PROJECTS" in teal
- Heading: "Things I've built"
- Bento grid, 6-column base, see Figma for exact grid template areas
- Mars Rover: featured 2×2 tile, teal border, surface-teal background
- All tiles: image as background (FILL), dark overlay, gradient fade to bottom, tag + title + description anchored to bottom-left

#### CARD EXPAND INTERACTION — CRITICAL
- Click tile → expands using Framer Motion layoutId to fill full bento area
- Sibling tiles slide off screen left/right (direction based on position relative to clicked tile)
- Use AnimatePresence for sibling exit animations
- Expanded state layout:
  - Full-bleed background: image at 12% opacity tint over dark surface
  - Strong bottom-to-solid gradient fade (dark surface color) covering bottom 65%
  - Content sits in the dark zone: tag → title → subtitle → divider → description → chips
  - Footer: "← back to projects" bottom-left (dim), link icon bottom-right
  - Link icon: GitHub icon (white) for github links, doc icon (white) for Google Drive links
  - No link icon for rover (no public repo)
- "← back to projects" collapses back to grid using same layoutId

### Skills ("What I've worked with")
- Section label: "SKILLS" in teal
- Heading: "What I've worked with"
- 6-column bento grid, 3 rows, 140px row height, 12px gap
- Day-to-day tile: 2×2 (cols 1-2, rows 1-2), teal border, surface-teal bg
  - 4 full-width column badges stacked: C#, TypeScript, React, SQL
  - Badges are teal-tinted with teal border, centered text
  - "daily" watermark text bottom-right, very low opacity teal
- Row 1 right: Languages (3col) + Infra (1col)
- Row 2 right: Frontend (2col) + APIs & Auth (2col)
- Row 3 full width: ML (1col) · Tools (2col) · Geo/Data (1col) · Hardware (2col)
- All non-featured tiles: surface background, teal category label (10px uppercase), tag pills

### Contact ("Let's talk")
- Section label: "CONTACT" in teal
- Heading: "Let's talk" — 40px, medium, white
- Subtitle: "Open to new opportunities, collabs, or a good conversation about tech, cameras, or Mars rovers." — muted, 15px
- 5 icon-only links in a row: Email · LinkedIn · GitHub · Instagram · Resume
- Icons are white (inverted from dark originals)
- No text labels — icons represent themselves
- Each icon is a clickable link

---

## Scroll Behavior
- Each section is exactly 100vh, scroll-snap mandatory on y axis
- Snap is NOT instant — requires deliberate scroll intent
- Custom JS/Framer Motion scroll handler: only snaps after user scrolls
  at least 18-22% of viewport height. Below threshold → springs back.
- Do NOT use pure CSS scroll-snap alone — it snaps too eagerly
- Use Framer Motion useScroll + useMotionValue for threshold logic

## Scroll Progress Indicator
- Fixed on right edge of screen, full viewport height
- Slim 2px wide vertical track
- Each section = equal segment of the track
- Active segment: #61c1d8 (teal fill)
- Inactive segments: rgba(255,255,255,0.1)
- Subtle — must not compete with content
- Hover: show section name as tooltip to the left of the indicator
- Click segment: jump to that section

---

## Photography Page (/photography)

### State 1 — Accordion View (default entry on page load)
- Full viewport photo, object-fit: contain (FIT, NOT fill) — must show whole image
- Dark background (#0d0d0f) fills the sides for portrait photos
- Radial vignette overlay
- Strong bottom gradient fade to dark
- Left/right arrow buttons (circular, ghost border) to navigate all 21 photos
- Bottom left: location label (muted, 13px) + region name (white, 32px medium)
- Bottom center: photo counter e.g. "7 / 21"
- Bottom: region dot indicators — Italy · Japan · California
  - Active region: 24px wide teal pill, inactive: 8px dim dot
- Top right: "See all" button (ghost) + "✕" close button
- "See all" → goes to Region Overview
- "✕" → goes back to portfolio home

### State 2 — Region Overview
- "Photography" title centered, 48px medium, white
- Subtitle: "Select a region to explore" — muted
- 3 region cards side by side: Italy (5 photos) · Japan (9 photos) · California (7 photos)
- Each card: 380px wide, 580px tall, border-radius 14px
  - Full-bleed hero photo (FILL scaling)
  - Bottom gradient fade
  - Region name (28px, white, bottom)
  - Sub-locations (12px, muted, bottom)
  - Photo count badge (top right corner, ghost border)
- Click card → enters State 3 for that region

### State 3 — Region Filtered View
- "← All regions" breadcrumb top left → back to State 2
- Region title (48px) + photo count (14px muted)
- 3-column masonry grid, 280px col width, 16px gap
- Each photo card: rounded 8px, location label bottom with gradient
- Click photo → enters State 1 (accordion) scoped to that region only
- Teal outline (2px) on selected/active photo

### Region hero photos:
- Italy hero: ita_vatican_statue.webp
- Japan hero: jpn_asakusa.webp
- California hero: usa_montara_beach.webp

### Default accordion entry photo: jpn_shibuya_night.webp

---

## Admin Panel (/admin)
Hidden route — not linked from anywhere public.
Exists at /admin but never appears in nav or sitemap.

### Pages:
- /admin → Login
- /admin/dashboard → Stats overview + quick actions
- /admin/resume → Upload/replace resume PDF
- /admin/photos → Browse & edit photos
- /admin/photos/upload → Upload new photo
- /admin/tabs → Guitar tabs (Phase 4 — last)

### Login (/admin)
- Centered card on dark background, no sidebar
- "KW" logo + "Admin Login" title + subtitle
- Email + password fields
- "Sign in" button (teal fill)
- Error state: red text below button
- "← Back to site" top-left corner (dim gray)

### Admin Sidebar (all pages except login)
- 220px wide, surface background
- Top: "KW" logo (teal) + "Admin" label (dim)
- Nav items: Dashboard · Resume · Photos · Guitar Tabs
- Active item: teal text + 3px teal left accent bar
- Bottom divider
- "← Back to site" (dim gray)
- "Sign out" (red) — below back to site

### Dashboard (/admin/dashboard)
- Stat cards: Photos (21) · Resume (1) · Guitar Tabs (0)
- Quick action rows: Upload new resume · Upload new photo · Browse & edit photos
- Each action row has title, subtitle, and → arrow in teal

### Resume (/admin/resume)
- Current resume card: filename + upload date + "View PDF" button
- Drag-and-drop zone (dashed teal border):
  - Upload icon + "Drop your PDF here" + "or click to browse files"
  - "PDF files only · Max 10MB"
  - "Browse files" button
- Selected file state: filename + size + ✕ remove
- "Upload & replace current resume" button (teal, full width)

### Browse & Edit Photos (/admin/photos)
- Filter dropdown: "All regions" top left
- "+ Upload photo" button top right → navigates to /admin/photos/upload
- 4-column photo grid, 180px height tiles
- Each tile: photo + location label bottom
- Click photo → slide-in edit panel from right (300px wide)
- Edit panel:
  - "Edit Photo" title + ✕ close
  - Photo preview (small thumbnail)
  - Filename (read-only)
  - Region dropdown (Italy | Japan | California)
  - Location dropdown (filtered to selected region)
  - "+ Add new location" link
  - "Save changes" button (teal)
  - "Delete photo" button (red border, red text)
  - "This action cannot be undone." warning

### Upload Photo (/admin/photos/upload)
- Two-column layout: drop zone left, form right
- Drop zone: upload icon + "Drop photo here" + "or click to browse"
  - Accepts .webp, .jpg, .png — max 20MB
  - Shows preview thumbnail when file selected
- Form fields:
  - Filename (auto-populated from file, editable)
  - Region (dropdown: Italy | Japan | California)
  - Location/city (dropdown of existing locations for selected region)
  - "+ Add new location" link — reveals text input for custom location
  - Display order (number input)
- "Upload photo" submit button (teal, full width of form column)

---

## Supabase DB Schema (Phase 2)
```sql
create table photos (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  location text not null,
  region text not null,
  country text not null,
  display_order integer default 0,
  created_at timestamp default now()
);

create table resume (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  url text not null,
  uploaded_at timestamp default now()
);

create table guitar_tabs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text not null,
  filename text not null,
  uploaded_at timestamp default now()
);
```

Storage buckets:
- `photos` — public
- `resume` — public
- `guitar-tabs` — private, signed URLs only (short expiry)

---

## Build Order (follow exactly, one step at a time)
1.  Foundation: types.ts, data/*.json, lib/data.ts, global CSS tokens
2.  Nav component (sticky, blur, active tracking)
3.  Hero section
4.  Experience section
5.  Projects section — bento grid layout first, then card expand interaction
6.  Skills section — bento grid with Day-to-day featured tile
7.  Contact section — icon-only links
8.  Scroll-snap layout + scroll progress indicator
9.  Photography page — all 3 states (accordion, region overview, region grid)
10. Admin login page + Next.js middleware (Supabase Auth)
11. Admin dashboard
12. Admin resume page
13. Admin browse & edit photos page
14. Admin upload photo page
15. Phase 2: Supabase migration (swap lib/data.ts internals)
16. Phase 3: Admin guitar tabs page + signed URL serving (LAST)