import { readArticles } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Article id is required.' })
  }
  const articles = await readArticles()
  const article = articles.find((item) => item.id === id)
  if (!article) {
    throw createError({ statusCode: 404, message: 'Article not found.' })
  }
  return article
})
