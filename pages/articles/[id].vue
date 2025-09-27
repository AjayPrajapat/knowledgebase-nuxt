<script setup lang="ts">
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

const route = useRoute()
const { data: article, pending, error, refresh } = useFetch(`/api/articles/${route.params.id}`)
const navigation = useNavigationStore()

const categoryLabel = computed(() => navigation.findById(article.value?.categoryId)?.label || 'Knowledge')
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink to="/articles" class="text-sm text-slate-500 hover:text-primary-600">← Back to Articles</NuxtLink>
        <h1 class="mt-3 text-3xl font-bold text-slate-900">{{ article?.title }}</h1>
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
            {{ categoryLabel }}
          </span>
          <p class="text-xs uppercase tracking-wider text-slate-400">
            Created {{ article ? new Date(article.createdAt).toLocaleString() : '' }}
          </p>
        </div>
      </div>
    </div>

    <div class="card">
      <div v-if="pending" class="text-sm text-slate-500">Loading article...</div>
      <div v-else-if="error" class="text-sm text-red-500">Unable to load article.</div>
      <article v-else class="prose max-w-none" v-html="article?.html"></article>
    </div>
  </div>
</template>
