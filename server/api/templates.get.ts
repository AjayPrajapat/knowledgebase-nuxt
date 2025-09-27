import { readTemplates } from '../utils/storage'

export default defineEventHandler(async () => {
  const templates = await readTemplates()
  return templates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
