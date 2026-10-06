# Hitakari Marketplace AI

Internal AI marketplace dashboard for Telkomsel, built by PT Neural Technologies Indonesia. Covers API key management, budget management, role-based access, and usage/activity tracking, and other features or pages to be added later.

## Tech Stack

- React + Vite
- Tailwind CSS v4
- shadcn/ui (Base UI, Nova preset)
- Import alias: `@/*` → `./src/*`

## Figma → Code Workflow

When given a Figma link or frame reference:

1. Read the layout structure and design details directly from Figma (spacing, hierarchy, grouping, text content) — don't guess from memory.
2. Identify which parts of the layout map to which UI pieces (e.g. a card, a table, a form section).
3. Build each piece using the project's **existing shadcn/ui components** first (check `src/components/ui/`).
4. Only install a new shadcn component (`npx shadcn add <component>`) if nothing existing covers it.
5. Match the Figma values as-is (spacing, text, layout) — don't approximate or round to "close enough" Tailwind defaults.

## Component Rules

- **Reuse before installing new.** Always check `src/components/ui/` first before running an install command.
- Components are installed via the standard shadcn CLI — this generates the `.jsx` file automatically. No extra documentation step is needed for this part right now.

## Colors

- Use Tailwind CSS's default color tokens (e.g. `bg-blue-500`, `text-neutral-600`).
- Don't hardcode hex values in components.

## Typography

- **Poppins** is the main font across the project (via `@fontsource/poppins`, static weights 400/500/600, mapped to `--font-sans` in `src/index.css`). Use `font-sans`; don't hardcode font families in components.
- **Telkomsel Batik Sans** is a secondary brand font. Only use it when a Figma reference explicitly shows it; otherwise stay on Poppins.

## Icons

- **Lucide icons** — primary icon set, used by default across the project.
- **Google Material Symbols (Rounded style — Filled and Outline variants)** — secondary icon set, kept available for cases Lucide doesn't cover well.
- Don't mix in any other icon set beyond these two (e.g. Tabler, Heroicons).

## Out of Scope (for now)

- Component registry/documentation file — may be added later once the component set grows. Not needed at this stage.