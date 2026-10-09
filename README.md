# Jemina Garcia — Interactive Filmography

An editorial, responsive portfolio built with HTML, CSS and JavaScript. No build step, package install or paid service required.

## Preview

From this directory run `python3 -m http.server 8000`, then open http://localhost:8000.

## Publish on GitHub Pages

1. Create a repository on the intended GitHub account, named `portfolio` (or `<your-exact-username>.github.io` for a root site).
2. Upload the contents of this directory to the repository root on the `main` branch, including `.github/workflows/pages.yml` and `.nojekyll`. Keep the `assets` folder structure.
3. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
4. Run the **Deploy portfolio to GitHub Pages** workflow from the Actions tab if it has not already run. Its deployment output provides the live URL.

All asset paths are relative, so the site supports both a root domain and a `/portfolio/` project path.

## Update the portfolio

- `projects.js`: titles, roles, credits, descriptions, image selections and watch links. Array order controls gallery order; the first five entries are featured.
- `assets/`: extracted WebP stills, portrait and the browser-compatible Float MP4.
- `index.html`: biography, contact, current work and section text.
- `style.css`: responsive presentation and reduced-motion behavior.
- `app.js`: role filtering, featured-image selection, contact sheet, modal case studies and video players.

## Media and content notes

- Stills are extracted from the supplied portfolio PDF. The Flash Forward gallery uses images from its virtual-production section; original scene attribution can be refined if needed.
- Float is converted from the supplied MOV to H.264/AAC MP4. Audio begins only when the visitor presses play.
- Public YouTube players load only after clicking Watch film, with direct fallback links. Private Drive films and the password-protected Vimeo film use email screening requests. No private screening URLs or passwords are published.
- No fictional before/after assets, testimonials or hidden personal stories are included. Those can be added when source material is provided.
- No general reel was supplied, so no placeholder reel button is shown.
- Project overlays have keyboard focus handling and Escape-to-close support; filters and gallery controls work with touch and keyboard. Motion respects the visitor’s reduced-motion preference.
- The résumé is available only by request through an email link. Jemina approves requests personally before sharing a copy. The PDF is excluded from the public repository.
