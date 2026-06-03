# Fashion Inspiration Library

A lightweight full-stack web app for fashion designers to upload field-captured inspiration photos, automatically classify garments with multimodal AI, search/filter a visual library, and add designer annotations over time.

## Quick start

```bash
# Install dependencies
npm install
npm install --prefix app

# Optional: enable live classification (copy to app/.env.local)
cp .env.example app/.env.local
# Set OPENAI_API_KEY and/or ANTHROPIC_API_KEY in app/.env.local

# Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Library vs Evaluation

| View | URL | What you see |
| --- | --- | --- |
| **Library** | `/` (header **Library**) | Your working mood board: uploads stored in SQLite + `app/public/uploads/`. Filter, search, and add designer annotations. Click **Library** anytime to clear filters, close the detail panel, and scroll to the top. |
| **Evaluation** | `/eval` (header **Evaluation**) | The 66-image labeled test set with model predictions vs curator labels (`eval/results.json`). Images are served from `app/public/eval/` after sync (see below). |

Eval images are **not** in the Library automatically. To copy evaluated photos into the main Library with AI metadata from the eval run:

```bash
npm run eval:sync    # copy eval/downloaded → app/public/eval (for /eval page)
npm run eval:import  # optional: also insert into SQLite for the Library grid
```

Choose a **Classifier** on upload: **Mock** (no key), **OpenAI**, or **Claude**. Set the matching API key in `app/.env.local`.

## Repository layout

```
/app          Next.js web application (UI + API routes + SQLite persistence)
/eval         Labeled test set (66 images) and evaluation script
/tests        Unit, integration, and Playwright end-to-end tests
README.md     Setup, architecture, and evaluation notes
```

## Architecture

| Layer | Choice | Rationale |
| --- | --- | --- |
| UI | Next.js 15 + React | Fast PoC with server routes and a single deployable app |
| Storage | SQLite (`better-sqlite3`) | Zero-config local persistence for images + metadata |
| Files | `app/public/uploads/` | Simple local image storage for a day-scale exercise |
| Classification | OpenAI `gpt-4o-mini` or Claude `claude-haiku-4-5` (JSON output) | User-selectable vision providers |
| Mock mode | Filename/heuristic classifier | Keeps demo + CI usable without API keys |

### Core workflow

1. **Upload** — designer, optional location hint, capture timestamp, image file.
2. **Classify** — multimodal model returns natural-language description + structured attributes.
3. **Persist** — AI metadata and designer context stored in SQLite; image saved to disk.
4. **Browse** — responsive grid with dynamic filters derived from library contents.
5. **Annotate** — designer tags/notes stored separately and included in full-text search.

### API routes

- `GET /api/images` — list images with query-string filters
- `POST /api/images` — upload + classify
- `GET/PATCH /api/images/:id` — fetch image / update annotations
- `GET /api/filters` — dynamic filter options

### Assumptions (PoC)

- Single-user local deployment (no auth).
- Location/time context is inferred by AI unless the designer provides hints at upload.
- “Designer” is a free-text field on upload, not a full user account system.
- Dynamic filters are built from existing library values (empty library → empty filters).

## Testing

```bash
# Unit + integration tests
npm test

# End-to-end (starts dev server automatically)
npm run test:e2e
```

Coverage includes:

- **Unit** — parsing model JSON into structured attributes
- **Integration** — location, time, and full-text filter behavior
- **E2E** — upload → classify → filter flow in the browser

## Model evaluation

The labeled test set lives in `eval/labels.json` (**66** curated Pexels street-fashion images with manually defined expected attributes in `eval/curated-labels.ts`).

```bash
# Regenerate labels from curated source
npm run eval:labels

# Download eval images
npm run eval:download

# Expose eval images in the web app (Evaluation page)
npm run eval:sync

# Run evaluation with OpenAI or Claude (requires matching API key)
CLASSIFIER_PROVIDER=claude ANTHROPIC_API_KEY=sk-ant-... npm run eval
CLASSIFIER_PROVIDER=openai OPENAI_API_KEY=sk-... npm run eval

# Optional mock baseline for CI
EVAL_USE_MOCK=true npm run eval
```

### Evaluation summary (Claude)

Latest run: **`claude-sonnet-4-6`** on **65 / 66** images (`eval/results.json`, generated 2026-06-03). One image (`fashion-065`) failed JSON parsing and was skipped.

| Attribute | Accuracy | Correct / total |
| --- | --- | --- |
| Garment type | 1.5% | 1 / 65 |
| Style | 6.2% | 4 / 65 |
| Material | 3.1% | 2 / 65 |
| Occasion | 23.1% | 15 / 65 |
| Location (continent / country / city) | 33.8% | 22 / 65 |

**Takeaways**

- **Occasion** and **location** scored highest — the model often picks plausible scene or styling context even when garment labels disagree with the curator.
- **Garment type**, **style**, and **material** were weakest — strict string matching against curator labels on stock Pexels photos punishes valid synonyms (e.g. “jacket” vs “dress” when the model misreads the silhouette).
- Eval labels are manually defined; the vision model was not fine-tuned on this set.

Reproduce or refresh metrics:

```bash
npm run eval:download
CLASSIFIER_PROVIDER=claude npm run eval
```

Use `EVAL_USE_MOCK=true npm run eval` only for a key-free CI baseline (not representative of live model quality).

**With more time**, I would: capture GPS/EXIF at upload, add synonym-aware scoring, tune prompts per attribute, and cache classifications for reproducible eval runs.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `CLASSIFIER_PROVIDER` | Default provider: `openai`, `claude`, or `mock` |
| `OPENAI_API_KEY` | OpenAI multimodal classification |
| `OPENAI_MODEL` | Defaults to `gpt-4o-mini` |
| `ANTHROPIC_API_KEY` | Claude multimodal classification |
| `ANTHROPIC_MODEL` | Defaults to `claude-haiku-4-5` |
| `EVAL_USE_MOCK` | Force mock classifier during eval (`false` by default) |

## Limitations

- No multi-user auth or cloud storage
- Location inference is approximate unless provided at upload
- Eval labels are manually defined against open web images (not a bespoke studio shoot dataset)
- SQLite + local disk are not production-scale for large teams

## Next steps

- Bulk import from camera roll / shared folders
- Side-by-side comparison boards
- Attribute confidence scores and human correction loop
- Deploy backend storage to S3 + Postgres for team use
