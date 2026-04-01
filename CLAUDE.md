# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

## Stack

- **Next.js 16.2.0** with App Router — see warning in AGENTS.md above
- **React 19**, **TypeScript 5**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- Path alias: `@/` → project root

## Architecture

App Router project. All routes live under `app/`. No `src/` directory. Global styles are in `app/globals.css` using Tailwind v4 directives.
