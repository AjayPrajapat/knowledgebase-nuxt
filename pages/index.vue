<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { NavNode } from '@/stores/navigation'
import { useNavigationStore } from '@/stores/navigation'

const navigation = useNavigationStore()
const { tree, selectedCategory, selectedCategoryId, defaultCategoryId } = storeToRefs(navigation)

const { data: articlesData, pending: articlesPending } = await useAsyncData('dashboard-articles', () =>
  $fetch('/api/articles')
)

const { data: templatesData, pending: templatesPending } = await useAsyncData('dashboard-templates', () =>
  $fetch('/api/templates')
)

const collectIds = (node?: NavNode | null): string[] => {
  if (!node) return []
  const childIds = node.children?.flatMap((child) => collectIds(child)) || []
  return [node.id, ...childIds]
}

const selectedIds = computed(() => {
  const ids = collectIds(selectedCategory.value)
  return ids.length ? ids : [defaultCategoryId.value]
})

const matchesCategory = (candidate?: string | null) => {
  const categoryId = candidate && candidate.length ? candidate : defaultCategoryId.value
  return selectedIds.value.includes(categoryId)
}

const filteredArticles = computed(() =>
  (articlesData.value || []).filter((article: any) => matchesCategory(article.categoryId)).slice(0, 5)
)

const filteredTemplates = computed(() =>
  (templatesData.value || []).filter((template: any) => matchesCategory(template.categoryId)).slice(0, 5)
)

const handleSelect = (id: string) => {
  navigation.setSelectedCategory(id)
}

useHead({
  title: 'Master Documentation & Template Management Platform'
})
</script>

<template>
  <div class="space-y-8">
    <header class="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-widest text-primary-600">Master Operations Hub</p>
        <h1 class="text-3xl font-bold text-slate-900">Documentation & Template Command Center</h1>
        <p class="max-w-3xl text-sm text-slate-600">
          Navigate your ten master documentation categories, curate knowledge articles, and operationalize delivery templates
          for every brand and product initiative.
        </p>
      </div>
      <div class="flex gap-3 text-sm font-medium">
        <NuxtLink to="/articles/new" class="btn">New Article</NuxtLink>
        <NuxtLink to="/templates/new" class="btn bg-slate-900 hover:bg-slate-800">Upload Template</NuxtLink>
      </div>
    </header>

    <div class="grid gap-8 lg:grid-cols-12">
      <aside class="lg:col-span-4 xl:col-span-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <CategoryTree :tree="tree" :selected-id="selectedCategoryId" @select="handleSelect" />
        </div>
      </aside>

      <section class="lg:col-span-8 xl:col-span-9">
        <div class="space-y-6">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Currently Exploring</p>
                <h2 class="text-2xl font-semibold text-slate-900">{{ selectedCategory?.label }}</h2>
                <p class="max-w-3xl text-sm text-slate-600">{{ selectedCategory?.description }}</p>
              </div>
              <div class="rounded-lg bg-primary-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-primary-600">
                {{ filteredArticles.length }} Articles · {{ filteredTemplates.length }} Templates
              </div>
            </div>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-slate-900">Knowledge Articles</h3>
                <NuxtLink to="/articles" class="text-xs font-semibold uppercase tracking-wider text-primary-600">View All</NuxtLink>
              </div>
              <p class="mt-2 text-sm text-slate-500">
                Latest insights and operating guidance curated for this category.
              </p>
              <div class="mt-4 space-y-4">
                <div v-if="articlesPending" class="text-sm text-slate-500">Loading articles…</div>
                <div v-else-if="!filteredArticles.length" class="text-sm text-slate-500">
                  No articles filed here yet. Create one to get started.
                </div>
                <article v-else v-for="article in filteredArticles" :key="article.id" class="rounded-lg border border-slate-100 p-4">
                  <NuxtLink :to="`/articles/${article.id}`" class="block text-base font-semibold text-slate-900">
                    {{ article.title }}
                  </NuxtLink>
                  <p class="mt-2 text-xs uppercase tracking-wider text-slate-400">
                    {{ new Date(article.createdAt).toLocaleString() }}
                  </p>
                </article>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-slate-900">Automation Templates</h3>
                <NuxtLink to="/templates" class="text-xs font-semibold uppercase tracking-wider text-primary-600">View All</NuxtLink>
              </div>
              <p class="mt-2 text-sm text-slate-500">
                Operational templates, mail merge kits and delivery packs for rapid reuse.
              </p>
              <div class="mt-4 space-y-4">
                <div v-if="templatesPending" class="text-sm text-slate-500">Loading templates…</div>
                <div v-else-if="!filteredTemplates.length" class="text-sm text-slate-500">
                  No templates aligned to this node. Upload one to power automation.
                </div>
                <div v-else v-for="template in filteredTemplates" :key="template.id" class="rounded-lg border border-slate-100 p-4">
                  <p class="text-base font-semibold text-slate-900">{{ template.name }}</p>
                  <p class="mt-2 text-xs uppercase tracking-wider text-slate-400">
                    Placeholders: {{ template.placeholders.join(', ') || '—' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <NuxtLink to="/articles/new" class="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 p-5 text-sm text-primary-700 transition hover:border-primary-300 hover:bg-primary-100">
              <p class="font-semibold">Capture a Knowledge Article</p>
              <p class="mt-2 text-xs text-primary-600">Log key learnings, SOPs and best practices for your team.</p>
            </NuxtLink>
            <NuxtLink to="/templates/new" class="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-700 transition hover:border-primary-300 hover:bg-primary-50/40">
              <p class="font-semibold">Upload a DOCX Template</p>
              <p class="mt-2 text-xs text-slate-500">Detect placeholders and keep delivery assets centralized.</p>
            </NuxtLink>
            <NuxtLink to="/generate" class="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-700 transition hover:border-primary-300 hover:bg-primary-50/40">
              <p class="font-semibold">Generate Docs Instantly</p>
              <p class="mt-2 text-xs text-slate-500">Merge data and download polished PDF/DOCX packages.</p>
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
