# Markdown Template Editor with Quill

Nuxt 3 starter kit for composing Markdown-based document templates with placeholder fields powered by Quill rich-text editors.

## Stack

- **Nuxt 3** with file-based routing
- **Tailwind CSS** + `@tailwindcss/typography` for styling and Markdown output
- **Pinia** store that tracks placeholder progress while you edit
- **Quill** rich-text editors (client-only plugin)
- **Markdown-It** to render the merged Markdown output
- **PDFKit** example endpoint for exporting Markdown previews as PDFs

## Getting Started

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:3000`.

## Template Workflow

1. **Create Markdown templates** – add `.md` files to `server/data/templates/` and use double curly braces like `{{ProjectName}}` to mark placeholders.
2. **Browse available templates** – visit `/templates` to see detected placeholders and open a template.
3. **Fill placeholders** – open `/templates/<template-name>` to load the template. Read-only Markdown stays visible while each placeholder gets a Quill editor.
4. **Generate previews** – click “Generate Preview” to merge your values back into Markdown, view the rendered output, and download a PDF sample via the `/api/generate` endpoint.

## Key Files

- `server/data/templates/project_charter.md` – example template with rich placeholders.
- `server/api/templates.get.ts` – lists Markdown templates plus detected placeholder keys.
- `server/api/templates/[name].get.ts` – loads a specific template and returns raw Markdown.
- `server/api/generate.post.ts` – merges filled values and optionally returns a PDF (base64 encoded).
- `utils/templates.ts` – helper utilities to parse placeholders, split segments, and merge values.
- `plugins/quill.client.ts` – registers the Quill editor client-side.
- `components/TemplateEditorField.client.vue` – wrapper component that exposes a Quill editor with a `v-model` binding.
- `pages/templates/[name].vue` – main editor experience with preview pane and PDF export.

## Adding New Templates

You can scaffold new templates straight from the UI by following the instructions at `/templates/new`, or manually create a file:

```md
# {{ProjectName}}

## Overview
{{Overview}}
```

Save it as `server/data/templates/project_plan.md`, then open `http://localhost:3000/templates/project_plan` to populate the placeholders.

## API Reference

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/templates` | GET | Lists Markdown templates, detected placeholders, and metadata. |
| `/api/templates/:name` | GET | Returns the Markdown content and placeholders for a template. |
| `/api/generate` | POST | Accepts `{ name, values, format }` and returns merged Markdown plus an optional PDF payload. |

## PDF Example

The `/api/generate` endpoint uses PDFKit to render plain text from the merged Markdown as a simple proof-of-concept export. You can replace this logic with a more advanced renderer if needed.

Happy templating! 🎉
