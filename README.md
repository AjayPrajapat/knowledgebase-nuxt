# Master Documentation & Template Management Platform

Nuxt 3 starter kit for managing master knowledge articles, DOCX templates, and automated PDF/DOCX generation.

## Stack

- **Nuxt 3** with file-based routing
- **Tailwind CSS** + `@tailwindcss/typography`
- **Pinia** store for navigation tree & category metadata
- **Quill** rich text editor for knowledge articles
- **Docxtemplater** + **pdfkit** for template merging
- **isomorphic-dompurify** for server-side sanitization

## Getting Started

```bash
npm install
npm run dev
```

The app boots on `http://localhost:3000`.

## Core Flows

1. **Capture Knowledge** – navigate to `/articles/new`, select a category, and compose rich content with image uploads.
2. **Onboard Templates** – go to `/templates/new`, upload a `.docx`, define placeholders, and map it to a category.
3. **Generate Documents** – open `/generate`, choose a template, fill in placeholder data, and download DOCX/PDF outputs.

## Data Persistence

- `server/data/articles.json` – metadata + sanitized HTML + Quill Delta
- `server/data/templates.json` – template registry & detected placeholder tags
- `server/data/templates/` – uploaded `.docx` files
- `public/uploads/` – rich text editor image uploads
- `public/generated/` – generated PDF/DOCX files returned by `/api/generate`

## API Surface (`/server/api`)

- `articles.get.ts` / `articles.post.ts` – list and create knowledge articles (with sanitization)
- `articles/[id].get.ts` – fetch single article
- `uploads.post.ts` – Quill image uploads saved under `/public/uploads`
- `templates.get.ts` / `templates.post.ts` – manage template metadata and parse placeholders
- `generate.post.ts` – merge templates with Docxtemplater, stream to PDFKit, and expose download links

## Dashboard Overview

The root dashboard provides:

- Tree navigation across 10 master categories with brand/product subfolders
- Right-hand intel panel summarizing articles and templates per category
- Quick action shortcuts for adding articles, templates, and generating documents

This repository is ready for extension—add authentication, external storage, or additional automations as needed.
