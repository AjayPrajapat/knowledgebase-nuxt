<template>
  <div class="min-h-screen">
    <header class="bg-white shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NuxtLink to="/" class="text-xl font-semibold text-slate-900">Knowledge Hub</NuxtLink>
        <nav class="flex items-center gap-4 text-sm font-medium text-slate-600">
          <NuxtLink to="/articles" class="hover:text-primary-600">Articles</NuxtLink>
          <NuxtLink to="/templates" class="hover:text-primary-600">Templates</NuxtLink>
          <NuxtLink to="/generate" class="hover:text-primary-600">Generate</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-6 py-10">
      <slot />
    </main>
  </div>
</template>
