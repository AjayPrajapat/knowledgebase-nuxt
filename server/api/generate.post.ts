import { promises as fs } from 'fs'
import { join, resolve } from 'path'
import MarkdownIt from 'markdown-it'
import PDFDocument from 'pdfkit'
import { JSDOM } from 'jsdom'
import { mergeTemplateValues } from '@/utils/templates'

const markdown = new MarkdownIt({ html: true, linkify: true, breaks: true })

const renderPdfFromMarkdown = async (content: string) => {
  const html = markdown.render(content)
  const dom = new JSDOM(html)
  const textContent = dom.window.document.body.textContent || ''
  const doc = new PDFDocument({ margin: 50 })
  const chunks: Buffer[] = []

  return await new Promise<Buffer>((resolvePdf, rejectPdf) => {
    doc.on('data', (chunk) => chunks.push(chunk as Buffer))
    doc.on('end', () => resolvePdf(Buffer.concat(chunks)))
    doc.on('error', (error) => rejectPdf(error))

    textContent.split(/\n+/).forEach((line) => {
      doc.text(line, { paragraphGap: 8 })
    })

    doc.end()
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = String(body.name || body.template || '')
  const format = String(body.format || 'markdown').toLowerCase()
  const values = typeof body.values === 'object' && body.values ? body.values : {}

  if (!name || !/^[-\w]+$/.test(name)) {
    throw createError({ statusCode: 400, message: 'Template name is required.' })
  }

  const { docTemplateDir } = useRuntimeConfig()
  const templateDir = resolve(process.cwd(), docTemplateDir || 'server/data/templates')
  const filePath = join(templateDir, `${name}.md`)

  let templateMarkdown = ''
  try {
    templateMarkdown = await fs.readFile(filePath, 'utf-8')
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw createError({ statusCode: 404, message: `Template “${name}” not found.` })
    }
    throw createError({ statusCode: 500, message: 'Unable to load template.' })
  }

  const mergedMarkdown = mergeTemplateValues(templateMarkdown, values)

  if (format === 'pdf') {
    const pdfBuffer = await renderPdfFromMarkdown(mergedMarkdown)
    return {
      format: 'pdf',
      markdown: mergedMarkdown,
      pdfBase64: pdfBuffer.toString('base64')
    }
  }

  return {
    format: 'markdown',
    markdown: mergedMarkdown
  }
})
