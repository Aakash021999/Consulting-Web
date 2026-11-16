# Benzene Consulting

Static Astro site. Use Node.js 22 or newer.

- `npm ci` installs the pinned dependencies.
- `npm run dev` serves the site locally.
- `npm run build` writes the production site to `dist/`.
- `npm run preview` serves the production build locally.

Netlify builds the site using `netlify.toml`. The original campaign landing pages remain at their existing URLs under `public/`. Inquiry and newsletter opt-in requests use the existing Formspree endpoint. Newsletter opt-ins are marked separately for manual processing until a mailing-list provider is configured.
