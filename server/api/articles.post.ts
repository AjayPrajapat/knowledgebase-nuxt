import { readArticles, writeArticles, type Article } from '../utils/storage'
import { JSDOM } from 'jsdom'
import createDOMPurify from 'isomorphic-dompurify'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const title = String(body.title || '').trim()
  const html = String(body.html || '')
  const delta = body.delta
  const categoryId = String(body.categoryId || 'knowledge').trim() || 'knowledge'

  if (!title || !html) {
    throw createError({ statusCode: 400, message: 'Title and content are required.' })
  }

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window as any)
  const sanitizedHtml = DOMPurify.sanitize(html)

  const articles = await readArticles()
  const article: Article = {
    id: crypto.randomUUID(),
    title,
    html: sanitizedHtml,
    delta,
    categoryId,
    createdAt: new Date().toISOString()
  }

  articles.push(article)
  await writeArticles(articles)

  return article
})
