export const PLACEHOLDER_PATTERN = /{{\s*([^{}|]+?)\s*}}/g

export interface TemplateSegment {
  type: 'text' | 'placeholder'
  value: string
  key?: string
}

const normalizeKey = (key: string) => key.replace(/\s+/g, ' ').trim()

export const extractPlaceholders = (markdown: string): string[] => {
  const keys = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = PLACEHOLDER_PATTERN.exec(markdown)) !== null) {
    const key = normalizeKey(match[1])
    if (key) {
      keys.add(key)
    }
  }
  return Array.from(keys)
}

export const splitTemplateSegments = (markdown: string): TemplateSegment[] => {
  const segments: TemplateSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = PLACEHOLDER_PATTERN.exec(markdown)) !== null) {
    const [placeholder, rawKey] = match
    const start = match.index
    if (start > lastIndex) {
      segments.push({ type: 'text', value: markdown.slice(lastIndex, start) })
    }
    const key = normalizeKey(rawKey)
    segments.push({ type: 'placeholder', value: placeholder, key })
    lastIndex = start + placeholder.length
  }
  if (lastIndex < markdown.length) {
    segments.push({ type: 'text', value: markdown.slice(lastIndex) })
  }
  return segments
}

export const mergeTemplateValues = (
  markdown: string,
  values: Record<string, string | undefined>
): string => {
  return markdown.replace(PLACEHOLDER_PATTERN, (_, rawKey: string) => {
    const key = normalizeKey(rawKey)
    const replacement = values[key]
    return typeof replacement === 'string' && replacement.length ? replacement : `{{${key}}}`
  })
}

export const createInitialValues = (placeholders: string[]): Record<string, string> => {
  return placeholders.reduce<Record<string, string>>((acc, key) => {
    acc[key] = ''
    return acc
  }, {})
}
