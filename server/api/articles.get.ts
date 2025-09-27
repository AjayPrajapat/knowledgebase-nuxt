import { readArticles } from '../utils/storage'

export default defineEventHandler(async () => {
  const articles = await readArticles()
  return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
