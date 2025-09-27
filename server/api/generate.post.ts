import { promises as fs, createWriteStream } from 'fs'
import { join } from 'path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import PDFDocument from 'pdfkit'
import { paths, readTemplates } from '../utils/storage'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const templateId = String(body.templateId || '')
  const format = body.format === 'docx' ? 'docx' : 'pdf'
  const fields = typeof body.fields === 'object' && body.fields ? body.fields : {}

  if (!templateId) {
    throw createError({ statusCode: 400, message: 'Template id is required.' })
  }

  const templates = await readTemplates()
  const template = templates.find((item) => item.id === templateId)
  if (!template) {
    throw createError({ statusCode: 404, message: 'Template not found.' })
  }

  await fs.mkdir(paths.generatedDir, { recursive: true })

  const buffer = await fs.readFile(template.filePath)
  const zip = new PizZip(buffer)
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

  try {
    doc.render(fields)
  } catch (err: any) {
    throw createError({ statusCode: 400, message: `Template rendering failed: ${err.message}` })
  }

  const id = crypto.randomUUID()
  let filename = ''
  if (format === 'docx') {
    filename = `${id}.docx`
    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' })
    await fs.writeFile(join(paths.generatedDir, filename), docxBuffer)
  } else {
    filename = `${id}.pdf`
    const pdfPath = join(paths.generatedDir, filename)
    const pdfDoc = new PDFDocument({ margin: 50 })
    const writeStream = createWriteStream(pdfPath)
    pdfDoc.pipe(writeStream)

    const text = doc.getFullText()
    text.split('\n').forEach((line) => {
      pdfDoc.text(line)
      pdfDoc.moveDown(0.3)
    })

    pdfDoc.end()
    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve())
      writeStream.on('error', (error) => reject(error))
    })
  }

  const url = `/generated/${filename}`
  return { url }
})
