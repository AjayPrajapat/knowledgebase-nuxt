<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold text-slate-900">Add a Markdown Template</h1>
      <p class="text-sm text-slate-600">
        To add a new template, create a <code>.md</code> file inside <code>server/data/templates</code>. Use double curly braces
        like <code v-pre>{{ProjectName}}</code> to mark placeholders. They will automatically appear as Quill editors when you
        open the template at <code>/templates/&lt;file-name&gt;</code>.
      </p>
    </header>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-900">Example</h2>
      <pre v-pre class="mt-4 overflow-x-auto rounded bg-slate-900/95 p-4 text-xs text-slate-100">
# {{ProjectName}}

## Overview
{{Overview}}

## Success Metrics
- {{MetricOne}}
- {{MetricTwo}}
      </pre>
      <p class="mt-4 text-sm text-slate-600">
        Save this as <code>server/data/templates/project_plan.md</code> then visit
        <NuxtLink to="/templates/project_plan" class="text-primary-600 hover:underline">/templates/project_plan</NuxtLink> to
        start editing.
      </p>
    </div>
  </div>
</template>
