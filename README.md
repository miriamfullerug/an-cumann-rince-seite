# An Cumann Rince Seite

A website for Irish set dancing (rince seit) featuring traditional set dances from across Ireland.

## Development

This site is built with [Eleventy](https://www.11ty.dev/) and uses Nunjucks templates.

### Setup

```bash
npm install
npm start
```

The site will be available at `http://localhost:8080` and will watch for changes.

### Building

```bash
npm run build
```

This generates the static site in the `docs/` directory.

### Base URL (seit.ie vs GitHub Pages)

The live site is served at the domain root (e.g. [seit.ie](https://seit.ie/)). The default build uses **no path prefix**, so asset and page URLs resolve to `/css/...`, `/sets/...`, etc.

To build for a GitHub Pages **project** site (under a subpath such as `/an-cumann-rince-seite/`), set the prefix when building:

```bash
ELEVENTY_PATH_PREFIX=/an-cumann-rince-seite npm run build
```

## Adding New Sets

To add a new set dance to the site:

1. **Create a new markdown file** in `src/sets/` with a URL-friendly name (e.g., `my-new-set.md`)

2. **Add frontmatter** at the top of the file with required metadata:
   ```yaml
   ---
   title: "Set Name (in Irish)"
   county: "County Name (in Irish)"
   totalBars: 544
   ---
   ```

   Required fields:
   - `title`: The name of the set in Irish (Gaeilge)
   - `county`: The county name in Irish (Gaeilge)
   - `totalBars`: Total number of bars in the set

3. **Add introductory text** (optional):
   ```markdown
   Déantar gach figiúr díreach i ndiaidh a chéile, gan sos eatarthu.
   ```

4. **Add figure sections** using this format:
   ```markdown
   ---

   **Figiúr 1 – Figure Name**
   *tune-type – 88 barra*
   @físeán: https://www.youtube.com/embed/VIDEO_ID?start=0&end=120

   **Barranna**
   - Step 1
   - Step 2

   **Taobhanna**
   - Step 1
   - Step 2
   ```

   Each figure should include:
   - A heading: `**Figiúr N – Name**`
   - Music info: `*tune-type – X barra*` (e.g., `*sleamhnáin – 88 barra*`)
   - Optional video: `@físeán: URL`
   - Instructions for "Barranna" (tops) and/or "Taobhanna" (sides)
   - Use `**Gach duine**` for instructions that apply to everyone
   - Use `**Fir**` or `**Mná**` for gender-specific instructions

5. **Separate figures** with `---` on its own line

6. **The file will automatically be processed** by Eleventy and will appear in the sets list at `/sets/`

### Example Set File Structure

```markdown
---
title: "Baile Bhuirne"
county: "Corcaigh"
totalBars: 544
---

Déantar gach figiúr díreach i ndiaidh a chéile, gan sos eatarthu.

---

**Figiúr 1 – Luascadh do pháirtí**
*sleamhnáin – 88 barra*
@físeán: https://www.youtube.com/embed/jc3WDwhQAo4?start=0&end=120

**Barranna**
- Timpeall an tí
- Cearnóg
- Luascadh
- Sleamhnán

**Taobhanna**
- Timpeall an tí
- Cearnóg
- Luascadh
- Sleamhnán
```

### Notes

- All content should be in Irish (Gaeilge)
- Set names and county names should be in Irish
- The site automatically generates the set page from the markdown file
- Videos are embedded using YouTube embed URLs
- The search feature will index sets by title and county
