<script setup lang="ts">
import type Quill from 'quill'

const router = useRouter()
const { $quill } = useNuxtApp()
const form = reactive({
  title: '',
  html: '',
  delta: null as any
})
const saving = ref(false)
const error = ref('')
const editor = ref<HTMLDivElement | null>(null)
let quill: Quill | null = null

const initEditor = () => {
  if (!editor.value || quill) return
  const QuillConstructor = $quill()
  quill = new QuillConstructor(editor.value, {
    theme: 'snow',
    placeholder: 'Write your knowledge article...',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ header: [1, 2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: async () => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.click()
            input.onchange = async () => {
              if (!input.files || !input.files[0]) return
              const file = input.files[0]
              const body = new FormData()
              body.append('file', file)
              try {
                const res = await $fetch<{ url: string }>('/api/uploads', {
                  method: 'POST',
                  body
                })
                const range = quill?.getSelection(true)
                if (range && res.url) {
                  quill?.insertEmbed(range.index, 'image', res.url)
                }
              } catch (uploadError) {
                console.error(uploadError)
              }
            }
          }
        }
      }
    }
  })

  quill.on('text-change', () => {
    form.html = editor.value?.querySelector('.ql-editor')?.innerHTML || ''
    form.delta = quill?.getContents()
  })
}

onMounted(() => {
  initEditor()
})

const submit = async () => {
  error.value = ''
  if (!form.title.trim()) {
    error.value = 'Title is required.'
    return
  }
  if (!form.html.trim()) {
    error.value = 'Content is required.'
    return
  }
  saving.value = true
  try {
    await $fetch('/api/articles', {
      method: 'POST',
      body: {
        title: form.title,
        html: form.html,
        delta: form.delta
      }
    })
    router.push('/articles')
  } catch (err: any) {
    error.value = err?.data?.message || 'Failed to save article.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Create Article</h1>
        <p class="mt-2 text-sm text-slate-500">Share knowledge with your team.</p>
      </div>
      <NuxtLink to="/articles" class="text-sm text-slate-500 hover:text-primary-600">Back to list</NuxtLink>
    </div>

    <div class="card space-y-6">
      <div>
        <label class="block text-sm font-medium text-slate-700">Title</label>
        <input
          v-model="form.title"
          type="text"
          class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700">Content</label>
        <div ref="editor" class="mt-2 min-h-[320px] rounded-md border border-slate-200 bg-white"></div>
      </div>

      <div class="flex items-center justify-between">
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button class="btn" :disabled="saving" @click="submit">
          <span v-if="saving">Saving...</span>
          <span v-else>Save Article</span>
        </button>
      </div>
    </div>
  </div>
</template>
