<script setup lang="ts">
const router = useRouter()
const form = reactive({
  name: '',
  placeholders: ''
})
const file = ref<File | null>(null)
const error = ref('')
const saving = ref(false)

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
  }
}

const submit = async () => {
  error.value = ''
  if (!form.name.trim()) {
    error.value = 'Template name is required.'
    return
  }
  if (!file.value) {
    error.value = 'Please select a .docx file to upload.'
    return
  }
  saving.value = true
  const body = new FormData()
  body.append('name', form.name)
  body.append('placeholders', form.placeholders)
  body.append('file', file.value)
  try {
    await $fetch('/api/templates', {
      method: 'POST',
      body
    })
    router.push('/templates')
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to upload template.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Upload Template</h1>
        <p class="mt-2 text-sm text-slate-500">Upload DOCX templates and define available placeholders.</p>
      </div>
      <NuxtLink to="/templates" class="text-sm text-slate-500 hover:text-primary-600">Back to list</NuxtLink>
    </div>

    <div class="card space-y-6">
      <div>
        <label class="block text-sm font-medium text-slate-700">Template Name</label>
        <input
          v-model="form.name"
          type="text"
          class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700">DOCX File</label>
        <input
          type="file"
          accept=".docx"
          class="mt-1 w-full text-sm"
          @change="onFileChange"
        />
        <p class="mt-1 text-xs text-slate-400">Only .docx files are supported.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700">Placeholder Fields</label>
        <textarea
          v-model="form.placeholders"
          rows="4"
          class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Enter placeholders separated by commas, e.g. first_name, last_name, company"
        ></textarea>
      </div>

      <div class="flex items-center justify-between">
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button class="btn" :disabled="saving" @click="submit">
          <span v-if="saving">Uploading...</span>
          <span v-else>Save Template</span>
        </button>
      </div>
    </div>
  </div>
</template>
