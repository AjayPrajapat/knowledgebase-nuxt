import { IncomingForm } from 'formidable'
import type { Fields, File } from 'formidable'
import { promises as fs } from 'fs'
import { join } from 'path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { paths, readTemplates, writeTemplates, type TemplateMeta } from '../utils/storage'

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
  await fs.mkdir(paths.templateStorageDir, { recursive: true })

  const form = new IncomingForm({ multiples: false, keepExtensions: true })

  const { fields, file } = await new Promise<{
    fields: Fields
    file: File
  }>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) return reject(err)
      const uploaded = files.file
      if (!uploaded || Array.isArray(uploaded)) {
        return reject(createError({ statusCode: 400, message: 'Template file is required.' }))
      }
      resolve({ fields, file: uploaded })
    })
  })

  const name = String(fields.name || '').trim()
  const placeholderText = String(fields.placeholders || '')

  if (!name) {
    throw createError({ statusCode: 400, message: 'Template name is required.' })
  }

  if (!file.filepath || !file.originalFilename?.endsWith('.docx')) {
    throw createError({ statusCode: 400, message: 'Only .docx templates are supported.' })
  }

  const id = crypto.randomUUID()
  const destFilename = `${id}.docx`
  const destPath = join(paths.templateStorageDir, destFilename)
  await fs.copyFile(file.filepath, destPath)

  const buffer = await fs.readFile(destPath)
  const zip = new PizZip(buffer)
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
  const tagSet = new Set<string>()

  try {
    const tags = doc.getTags()
    Object.keys(tags || {}).forEach((tag) => tagSet.add(tag))
  } catch (err) {
    console.warn('Unable to parse template tags', err)
  }

  placeholderText
    .split(/[,\n]/)
    .map((field) => field.trim())
    .filter(Boolean)
    .forEach((field) => tagSet.add(field))

  const placeholders = Array.from(tagSet)

  const templates = await readTemplates()
  const template: TemplateMeta = {
    id,
    name,
    originalFilename: file.originalFilename || `${name}.docx`,
    filePath: destPath,
    placeholders,
    createdAt: new Date().toISOString()
  }

  templates.push(template)
  await writeTemplates(templates)

  return template
})
