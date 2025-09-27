import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import { extractPlaceholders } from '@/utils/templates'

export default defineEventHandler(async (event) => {
  const params = event.context.params || {}
  const name = String(params.name || '')

  if (!name || !/^[-\w]+$/.test(name)) {
    throw createError({ statusCode: 400, message: 'Invalid template name.' })
  }

  const { docTemplateDir } = useRuntimeConfig()
  const templateDir = resolve(process.cwd(), docTemplateDir || 'server/data/templates')
  const filePath = join(templateDir, `${name}.md`)

  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const placeholders = extractPlaceholders(content)

    return {
      name,
      content,
      placeholders
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw createError({ statusCode: 404, message: `Template “${name}” not found.` })
    }
    throw createError({ statusCode: 500, message: 'Unable to load template.', data: { cause: error?.message } })
  }
})
