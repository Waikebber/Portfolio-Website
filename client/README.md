# Kai Webber — Portfolio Website (Client)

This is the client-side code for my personal portfolio website built with modern web technologies including **Next.js**, **TypeScript**, **Chakra UI v3**, and **Ark UI**. It is fully responsive, theme-aware, and designed for smooth scrolling and rich interactivity. The portfolio highlights my projects, skills, experience, and photography.

## Live Website
Visit the deployed site here: [kaiwebber.com](https://www.kaiwebber.com)

---

## Tech Stack

- **React** — UI library for component-driven development
- **Next.js** — App directory, routing, and server-side rendering
- **TypeScript** — Type-safe JavaScript
- **Chakra UI v3** — Component library with built-in dark mode and accessibility
- **Ark UI** — Headless, accessible UI primitives integrated with Chakra
- **Node.js** — JavaScript runtime (used for tooling and development)

---

## Installation & Development

To run the project locally:

1. Navigate into the client folder:
```cd Portfolio-Website/client```

2. Install dependencies:
```npm install```

3. Start the development server:
```npm run dev```

4. Check it out on localhost
[http://localhost:3000/](http://localhost:3000/)

---

## File Structure

```bash
client/
├── public/                     # Static assets and data
│   ├── assets/                 # Directory for images
|   └── data/                   # Directory for text data
├── src/
│   ├── app/                    # Next.js app directory (pages, layout)
│   ├── components/            # Reusable UI components (Navbar, Footer, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API and data loading services
│   ├── styles/                # Global styles (minimal, Chakra handles most)
│   └── types.ts               # Shared TypeScript types
├── .gitignore
├── next.config.js             # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

