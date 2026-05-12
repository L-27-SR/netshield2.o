# Project Report — NetShield (frontend)

Generated: 2026-05-11

## **Overview**

- **Project name**: `frontend` (library / showcase)
- **Purpose**: An interactive Svelte-based frontend showcasing a Graph Neural Network (GNN) intrusion-detection demo, research visualizations, analytics and a network simulation playground.
- **Primary UI**: Svelte (+ SvelteKit routes used as a showcase app)

## **How to run**

- Install dependencies:

```bash
npm install
```

- Start dev server:

```bash
npm run dev
```

- Build for production:

```bash
npm run build
```

- Helpful checks:

```bash
npm run check       # svelte-check TypeScript checks
npm run preview     # preview production build
```

## **Tech stack & tooling**

- Framework: **Svelte** / **SvelteKit** (Svelte v5 in peer/dev deps)
- Bundler / dev-server: **Vite**
- CSS: **TailwindCSS** (tailwind plugin present but config file currently empty)
- TypeScript: enabled (see `tsconfig.json`)
- Linting/packaging: `publint`, `@sveltejs/package`, `svelte-check`

DevDependencies (high-level): listed in [package.json](package.json)

## **Top-level scripts**

- `dev`: runs the Vite dev server
- `build`: builds with Vite and runs `prepack`
- `preview`: preview build
- `check`: runs `svelte-check` with TypeScript config

## **Repository layout**

- `src/`
  - `routes/` — SvelteKit pages used for the site/showcase
    - `+page.svelte` — Home / hero + features
    - `research/+page.svelte` — Research visualizations (images, charts)
    - `analytics/+page.svelte` — Analytics page
    - `simulation/+page.svelte` — Interactive simulation UI ([src/routes/simulation/+page.svelte](src/routes/simulation/+page.svelte))
    - `simulation/[type]/+page.svelte` — simulation variants
  - `lib/` — app libraries and components
    - `components/` — UI components
      - `ImageCard.svelte` ([src/lib/components/ImageCard.svelte](src/lib/components/ImageCard.svelte))
      - `Ml.svelte`, `NetworkVisualization.svelte`, `SimulationControls.svelte`
    - `particles.ts` / `particles.js` — canvas particle effects
    - `DetectionEngine.ts` — core detection logic (client-side demo)
    - `simulation-store.ts` / `stores/` — state management for simulation
  - `assets/images/` — research and demo images (many PNGs)

## **Key files**

- Config
  - [svelte.config.js](svelte.config.js) — uses `vitePreprocess`, tries to load `@sveltejs/adapter-auto` with safe fallback
  - [vite.config.ts](vite.config.ts) — registers `@tailwindcss/vite` and `sveltekit` plugin; defines alias `$assets -> ./src/assets`
  - [tsconfig.json](tsconfig.json) — extends `.svelte-kit/tsconfig.json`, strict mode

- Entry / pages
  - [src/routes/+page.svelte](src/routes/+page.svelte) — landing page and hero
  - [src/routes/research/+page.svelte](src/routes/research/+page.svelte) — research gallery and charts
  - [src/routes/simulation/+page.svelte](src/routes/simulation/+page.svelte) — interactive simulator

## **Assets**

- Images are stored under `src/assets/images/`. Notable files:
  - `GATUAccuracyUGRAPH.png`, `GATUConfusionUmatrix.png`
  - `GCNNUAccuracyUGraph.png`, `GCNUConfusionUMatrix.png`
  - `GCNUROCUCurve .png` (note: trailing space in filename)

## **Observed issues & notes**

- Image import resolution errors can occur due to filename mismatches or unexpected whitespace. Example found earlier where imports referenced a different name (fixed in this session). Check filenames for trailing spaces and exact-casing: `GCNUROCUCurve .png` contains an extra space before `.png` which can cause Vite to fail resolving imports.
- `tailwind.config.js` is present but currently empty — Tailwind may still work via PostCSS but you likely want theme/config settings there.
- `package.json` exposes packaging-oriented scripts (`prepack`, `svelte-package`, `publint`) indicating this repo doubles as a library + showcase. Review `svelte` and `types` entries if you intend to publish a library.
- No `license` field in `package.json`; repo README is generic scaffold content — may want to update with project-specific setup and license.
- The `svelte.config.js` uses dynamic `await import('@sveltejs/adapter-auto')` with a fallback — safe for local dev but pick a proper adapter for your target deployment (e.g., `adapter-static`, `adapter-node`, or an edge adapter).
- The attached repository metadata shows current branch `master` while default branch is `main` — confirm your git flow to avoid accidental pushes to the wrong branch.

## **Recommendations**

- Normalize asset filenames: remove trailing spaces, use consistent naming (lowercase or PascalCase consistently). Run a script to detect whitespace in filenames.
- Populate `tailwind.config.js` with project colors and safelist if needed.
- Add `LICENSE` and update `package.json` with `license` and `repository` fields.
- Add a small `CONTRIBUTING.md` and `DEVELOPMENT.md` with run/build instructions and expected Node version.
- Consider adding automated tests or a basic Playwright/Cypress smoke test for key routes.
- If publishing the package, ensure `svelte`/`types` exports point to build outputs and `files`/`sideEffects` are correct.

## **Where to look next**

- Fix remaining image naming issues in `src/routes/research/+page.svelte` (we already corrected one incorrect import)
- Review `tailwind.config.js` and commit a minimal configuration
- Decide on a SvelteKit adapter for deployment and update `svelte.config.js`

---

Report generated from local workspace at `c:/Users/Sukruti/Downloads/frontend` on 2026-05-11.
