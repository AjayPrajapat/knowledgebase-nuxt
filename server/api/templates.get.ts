import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import { extractPlaceholders } from '@/utils/templates'

const titleize = (input: string) =>
  input
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

export default defineEventHandler(async () => {
  const { docTemplateDir } = useRuntimeConfig()
  const templateDir = resolve(process.cwd(), docTemplateDir || 'server/data/templates')

  await fs.mkdir(templateDir, { recursive: true })
  const files = await fs.readdir(templateDir)
  const markdownFiles = files.filter((file) => file.toLowerCase().endsWith('.md'))

  const templates = await Promise.all(
    markdownFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/i, '')
      const filePath = join(templateDir, filename)
      const [stat, content] = await Promise.all([fs.stat(filePath), fs.readFile(filePath, 'utf-8')])
      const placeholders = extractPlaceholders(content)

      return {
        name: titleize(slug),
        slug,
        placeholders,
        updatedAt: stat.mtime.toISOString(),
        size: stat.size
      }
    })
  )

  return templates.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
})
