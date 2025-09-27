<script setup lang="ts">
const { data: templates, pending } = useFetch('/api/templates')
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Document Templates</h1>
        <p class="mt-2 text-sm text-slate-500">Manage your DOCX templates and placeholders.</p>
      </div>
      <NuxtLink to="/templates/new" class="btn">Upload Template</NuxtLink>
    </div>

    <div class="grid gap-4">
      <div v-if="pending" class="card text-sm text-slate-500">Loading templates...</div>
      <div v-else-if="!templates || !templates.length" class="card text-sm text-slate-500">
        No templates yet. Upload your first template.
      </div>
      <div v-else v-for="template in templates" :key="template.id" class="card space-y-2">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-lg font-semibold text-slate-900">{{ template.name }}</p>
            <p class="text-xs uppercase tracking-wider text-slate-400">
              Uploaded {{ new Date(template.createdAt).toLocaleString() }}
            </p>
          </div>
          <div class="text-xs text-slate-500">{{ template.originalFilename }}</div>
        </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
