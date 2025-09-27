import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useTemplateEditorStore = defineStore('template-editor', () => {
  const placeholders = ref<string[]>([])
  const values = reactive<Record<string, string>>({})

  const syncPlaceholders = (keys: string[]) => {
    placeholders.value = keys
    const seen = new Set(keys)

    Object.keys(values).forEach((key) => {
      if (!seen.has(key)) {
        delete values[key]
      }
    })

    keys.forEach((key) => {
      if (!(key in values)) {
        values[key] = ''
      }
    })
  }

  const updateValue = (key: string, value: string) => {
    if (!(key in values)) {
      values[key] = ''
    }
    values[key] = value
  }

  const resetValues = () => {
    placeholders.value.forEach((key) => {
      values[key] = ''
    })
  }

  const filledCount = computed(() =>
    placeholders.value.reduce((count, key) => (values[key]?.trim().length ? count + 1 : count), 0)
  )

  const progress = computed(() => {
    if (!placeholders.value.length) {
      return 0
    }
    return Math.round((filledCount.value / placeholders.value.length) * 100)
  })

  return {
    placeholders,
    values,
    syncPlaceholders,
    updateValue,
    resetValues,
    filledCount,
    progress
  }
})
