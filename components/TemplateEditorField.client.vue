<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-3">
      <label class="text-sm font-semibold text-slate-700">
        {{ label }}
      </label>
      <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {{ placeholderKey }}
      </span>
    </div>
    <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div ref="editorRef" class="min-h-[160px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type QuillType from 'quill'

const props = defineProps<{
  modelValue: string
  placeholderKey: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLDivElement | null>(null)
let quill: QuillType | null = null

const { $quill } = useNuxtApp()

onMounted(() => {
  if (!editorRef.value || !$quill) {
    return
  }

  quill = new $quill(editorRef.value, {
    theme: 'snow',
    placeholder: props.label || props.placeholderKey,
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'blockquote', 'code-block'],
        ['clean']
      ]
    }
  })

  if (props.modelValue) {
    quill.clipboard.dangerouslyPasteHTML(props.modelValue)
  }

  quill.on('text-change', () => {
    if (!quill) return
    const html = quill.root.innerHTML
    emit('update:modelValue', html === '<p><br></p>' ? '' : html)
  })
})

watch(
  () => props.modelValue,
  (next) => {
    if (!quill) return
    const current = quill.root.innerHTML
    const normalized = next || ''
    if (normalized !== current) {
      const selection = quill.getSelection()
      quill.clipboard.dangerouslyPasteHTML(normalized)
      if (selection) {
        quill.setSelection(selection)
      }
    }
  }
)

onBeforeUnmount(() => {
  quill = null
})
</script>
