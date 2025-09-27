import { promises as fs } from 'fs'
import { join, dirname } from 'path'

const dataDir = join(process.cwd(), 'server', 'data')
const articlesFile = join(dataDir, 'articles.json')
const templatesFile = join(dataDir, 'templates.json')

export interface Article {
  id: string
  title: string
  html: string
  delta: any
  categoryId?: string
  createdAt: string
}

export interface TemplateMeta {
  id: string
  name: string
  originalFilename: string
  filePath: string
  placeholders: string[]
  categoryId?: string
  createdAt: string
}

async function ensureFile(filePath: string, defaultValue: any) {
  try {
    await fs.access(filePath)
  } catch {
    await fs.mkdir(dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8')
  }
}

export async function readArticles(): Promise<Article[]> {
  await ensureFile(articlesFile, [])
  const data = await fs.readFile(articlesFile, 'utf-8')
  return JSON.parse(data)
}

export async function writeArticles(articles: Article[]): Promise<void> {
  await ensureFile(articlesFile, [])
  await fs.writeFile(articlesFile, JSON.stringify(articles, null, 2), 'utf-8')
}

export async function readTemplates(): Promise<TemplateMeta[]> {
  await ensureFile(templatesFile, [])
  const data = await fs.readFile(templatesFile, 'utf-8')
  return JSON.parse(data)
}

export async function writeTemplates(templates: TemplateMeta[]): Promise<void> {
  await ensureFile(templatesFile, [])
  await fs.writeFile(templatesFile, JSON.stringify(templates, null, 2), 'utf-8')
}

export const paths = {
  dataDir,
  articlesFile,
  templatesFile,
  templateStorageDir: join(dataDir, 'templates'),
  generatedDir: join(process.cwd(), 'public', 'generated'),
  uploadsDir: join(process.cwd(), 'public', 'uploads')
}
