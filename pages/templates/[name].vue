<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DOMPurify from 'isomorphic-dompurify'
import MarkdownIt from 'markdown-it'
import { useRoute } from 'vue-router'
import { useTemplateEditorStore } from '@/stores/templateEditor'
import { mergeTemplateValues } from '@/utils/templates'

const route = useRoute()
const templateStore = useTemplateEditorStore()
const parser = new MarkdownIt({ html: true, linkify: true, breaks: true })

const sanitize = (html: string) => DOMPurify.sanitize(html)

const templateName = computed(() => String(route.params.name || ''))

const asyncKey = computed(() => `template-${templateName.value}`)

const { data: templateData, pending, error, refresh } = await useAsyncData(
  asyncKey,
  () => $fetch<{ name: string; content: string; placeholders: string[] }>(`/api/templates/${templateName.value}`),
  { watch: [templateName] }
)

const templateContent = computed(() => templateData.value?.content || '')
const placeholders = computed(() => templateData.value?.placeholders || [])

watch(
  placeholders,
  (keys) => {
    templateStore.syncPlaceholders(keys)
  },
  { immediate: true }
)

const highlightHtml = computed(() => {
  if (!templateContent.value) {
    return ''
  }
  const replacements: Record<string, string> = {}
  placeholders.value.forEach((key) => {
    replacements[key] = `<span class="inline-flex items-center rounded-full border border-dashed border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">${key}</span>`
  })
  const highlighted = mergeTemplateValues(templateContent.value, replacements)
  return sanitize(parser.render(highlighted))
})

const previewVisible = ref(false)
const previewMarkdown = ref('')
const previewHtml = ref('')
const generating = ref(false)
const generationError = ref('')

const generatePreview = async () => {
  generationError.value = ''
  generating.value = true
  try {
    const merged = mergeTemplateValues(templateContent.value, templateStore.values)
    previewMarkdown.value = merged
    previewHtml.value = sanitize(parser.render(merged))
    previewVisible.value = true
  } catch (err: any) {
    generationError.value = err?.message || 'Unable to generate preview.'
  } finally {
    generating.value = false
  }
}

const downloadPdf = async () => {
  generationError.value = ''
  try {
    if (!previewVisible.value) {
      await generatePreview()
    }
    const response = await $fetch<{ pdfBase64: string }>(`/api/generate`, {
      method: 'POST',
      body: {
        name: templateName.value,
        values: templateStore.values,
        format: 'pdf'
      }
    })
    if (!response?.pdfBase64) {
      throw new Error('PDF generation failed.')
    }
    const binary = atob(response.pdfBase64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${templateName.value}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err: any) {
    generationError.value = err?.message || 'Unable to download PDF.'
  }
}

useHead(() => ({
  title: templateData.value?.name ? `${templateData.value.name} · Markdown Template` : 'Template Editor'
}))
</script>

<template>
  <div class="space-y-10">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-primary-600">Markdown Template Editor</p>
        <h1 class="mt-2 text-3xl font-bold text-slate-900">
          {{ templateData?.name || templateName }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-slate-600">
          Fill each placeholder using the Quill editors. Fixed Markdown sections stay read-only so you can focus on the
          variable content.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn bg-slate-900 hover:bg-slate-800" type="button" @click="templateStore.resetValues()">
          Reset fields
        </button>
        <button class="btn" type="button" :disabled="generating" @click="generatePreview">
          <span v-if="generating">Generating…</span>
          <span v-else>Generate Preview</span>
        </button>
      </div>
    </div>

    <div v-if="pending" class="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
      Loading template…
    </div>
    <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
      <p class="font-semibold">{{ error.statusMessage || 'Unable to load template.' }}</p>
      <p class="mt-2 text-xs">
        <button class="text-primary-600 hover:underline" type="button" @click="refresh">Try again</button>
      </p>
    </div>
    <div v-else class="grid gap-8 lg:grid-cols-2">
      <section class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-900">Template structure</h2>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {{ placeholders.length }} Placeholders
            </span>
          </header>
          <div class="mt-4 prose prose-slate max-w-none text-sm" v-html="highlightHtml" />
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-900">Preview</h2>
            <span v-if="previewVisible" class="text-xs font-semibold text-slate-500">{{ templateStore.progress }}% complete</span>
          </header>

          <p v-if="!previewVisible" class="mt-4 text-sm text-slate-500">
            Generate a preview to merge your placeholder content back into the Markdown template.
          </p>
          <div v-else class="mt-4 space-y-4">
            <article class="prose prose-slate max-w-none" v-html="previewHtml" />
            <details class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <summary class="cursor-pointer font-semibold text-slate-700">View merged Markdown</summary>
              <pre class="mt-3 overflow-x-auto rounded bg-white p-3 text-xs text-slate-700">{{ previewMarkdown }}</pre>
            </details>
            <div class="flex flex-wrap items-center gap-3">
              <button class="btn" type="button" @click="downloadPdf">Download PDF</button>
            </div>
          </div>
          <p v-if="generationError" class="mt-3 text-sm text-red-500">{{ generationError }}</p>
        </div>
      </section>

      <aside class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <header class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-900">Placeholder editors</h2>
            <span class="text-xs font-semibold uppercase tracking-wider text-primary-600">
              {{ templateStore.filledCount }} / {{ placeholders.length }} filled
            </span>
          </header>
          <p class="mt-2 text-sm text-slate-500">
            Each field uses a Quill editor so you can apply rich formatting while keeping the template structure intact.
          </p>
          <div class="mt-6 space-y-6">
            <div
              v-for="placeholder in placeholders"
              :key="placeholder"
              class="rounded-xl border border-slate-100 bg-slate-50/80 p-4"
            >
              <TemplateEditorField
                v-model="templateStore.values[placeholder]"
                :placeholder-key="placeholder"
                :label="`Content for ${placeholder}`"
              />
            </div>
            <p v-if="!placeholders.length" class="text-sm text-slate-500">No placeholders detected in this template.</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
