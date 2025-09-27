<script setup lang="ts">
const { data: templates, pending } = useFetch('/api/templates')
const selectedTemplateId = ref('')
const placeholderValues = ref<Record<string, string>>({})
const format = ref<'docx' | 'pdf'>('pdf')
const resultLink = ref('')
const error = ref('')
const generating = ref(false)

watch(selectedTemplateId, (newId) => {
  resultLink.value = ''
  if (!newId) {
    placeholderValues.value = {}
    return
  }
  const template = templates.value?.find((t: any) => t.id === newId)
  if (template) {
    const values: Record<string, string> = {}
    template.placeholders.forEach((field: string) => {
      values[field] = ''
    })
    placeholderValues.value = values
  }
})

const generateDoc = async () => {
  error.value = ''
  resultLink.value = ''
  if (!selectedTemplateId.value) {
    error.value = 'Please select a template.'
    return
  }
  generating.value = true
  try {
    const res = await $fetch<{ url: string }>('/api/generate', {
      method: 'POST',
      body: {
        templateId: selectedTemplateId.value,
        format: format.value,
        fields: placeholderValues.value
      }
    })
    resultLink.value = res.url
  } catch (err: any) {
    error.value = err?.data?.message || 'Unable to generate document.'
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Generate Document</h1>
      <p class="mt-2 text-sm text-slate-500">Select a template, fill in placeholder data, and download the generated document.</p>
    </div>

    <div class="card space-y-6">
      <div>
        <label class="block text-sm font-medium text-slate-700">Template</label>
        <select
          v-model="selectedTemplateId"
          class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="" disabled>Select a template</option>
          <option v-for="template in templates" :key="template.id" :value="template.id">
            {{ template.name }}
          </option>
        </select>
        <p v-if="pending" class="mt-1 text-xs text-slate-400">Loading templates...</p>
      </div>

      <div v-if="selectedTemplateId" class="space-y-4">
        <h2 class="text-lg font-semibold text-slate-900">Placeholder Values</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="(value, key) in placeholderValues" :key="key">
            <label class="block text-sm font-medium text-slate-700">{{ key }}</label>
            <input
              v-model="placeholderValues[key]"
              type="text"
              class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Output Format</label>
        <div class="flex items-center gap-4 text-sm text-slate-600">
          <label class="inline-flex items-center gap-2">
            <input type="radio" value="pdf" v-model="format" /> PDF
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="radio" value="docx" v-model="format" /> DOCX
          </label>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button class="btn" :disabled="generating" @click="generateDoc">
          <span v-if="generating">Generating...</span>
          <span v-else>Generate Document</span>
        </button>
      </div>

      <div v-if="resultLink" class="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
        Document ready! <a :href="resultLink" target="_blank" class="underline">Download</a>
      </div>
    </div>
  </div>
</template>
