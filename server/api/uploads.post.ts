import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { join } from 'path'
import { paths } from '../utils/storage'

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
  await fs.mkdir(paths.uploadsDir, { recursive: true })

  const form = new IncomingForm({ multiples: false, keepExtensions: true })

  const file = await new Promise<import('formidable').File>((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) return reject(err)
      const uploaded = files.file
      if (!uploaded || Array.isArray(uploaded)) {
        return reject(createError({ statusCode: 400, message: 'No file uploaded.' }))
      }
      resolve(uploaded)
    })
  })

  if (!file.filepath) {
    throw createError({ statusCode: 500, message: 'Failed to process upload.' })
  }

  const fileExt = file.originalFilename?.split('.').pop() || 'png'
  const filename = `${crypto.randomUUID()}.${fileExt}`
  const destPath = join(paths.uploadsDir, filename)
  await fs.copyFile(file.filepath, destPath)

  const url = `/uploads/${filename}`
  return { url }
})
