<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'

const { data: articles, pending } = useFetch('/api/articles')
const navigation = useNavigationStore()

const resolveCategoryLabel = (categoryId?: string | null) => {
  return navigation.findById(categoryId)?.label || 'Knowledge'
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Knowledge Articles</h1>
        <p class="mt-2 text-sm text-slate-500">Browse your internal knowledge base.</p>
      </div>
      <NuxtLink to="/articles/new" class="btn">New Article</NuxtLink>
    </div>

    <div class="grid gap-4">
      <div v-if="pending" class="card text-sm text-slate-500">Loading articles...</div>
      <div v-else-if="!articles || !articles.length" class="card text-sm text-slate-500">
        No articles yet. Create your first one.
      </div>
      <div
        v-else
        v-for="article in articles"
        :key="article.id"
        class="card flex flex-col gap-2"
      >
        <NuxtLink :to="`/articles/${article.id}`" class="text-lg font-semibold text-slate-900">
          {{ article.title }}
        </NuxtLink>
        <span class="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {{ resolveCategoryLabel(article.categoryId) }}
        </span>
        <span class="text-xs uppercase tracking-wide text-slate-400">
          {{ new Date(article.createdAt).toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>
