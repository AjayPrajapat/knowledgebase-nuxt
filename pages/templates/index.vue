<script setup lang="ts">
const { data: templates, pending } = useFetch('/api/templates')
</script>

<template>
  <div class="space-y-8">
    <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Markdown Templates</h1>
        <p class="mt-2 text-sm text-slate-500">
          Templates are stored as Markdown files under <code>server/data/templates</code>. Click a template to start editing with
          Quill.
        </p>
      </div>
      <NuxtLink to="/templates/project_charter" class="btn">Open Project Charter</NuxtLink>
    </header>

    <div class="grid gap-4">
      <div v-if="pending" class="card text-sm text-slate-500">Loading templates…</div>
      <div v-else-if="!templates || !templates.length" class="card text-sm text-slate-500">
        No Markdown templates found. Add <code>.md</code> files to <code>server/data/templates</code> to get started.
      </div>
      <NuxtLink
        v-else
        v-for="template in templates"
        :key="template.slug"
        :to="`/templates/${template.slug}`"
        class="card flex flex-col gap-3 border border-slate-200 transition hover:border-primary-200 hover:shadow"
      >
        <div class="flex items-center justify-between">
          <p class="text-lg font-semibold text-slate-900">{{ template.name }}</p>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {{ new Date(template.updatedAt).toLocaleDateString() }}
          </span>
        </div>
        <p class="text-xs text-slate-500">Slug: {{ template.slug }}</p>
        <div>
          <p class="text-sm font-medium text-slate-700">Placeholders</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="field in template.placeholders"
              :key="field"
              class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
            >
              {{ field }}
            </span>
            <span v-if="!template.placeholders.length" class="text-xs text-slate-500">None detected</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
