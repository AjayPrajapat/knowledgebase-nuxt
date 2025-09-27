<script setup lang="ts">
const router = useRouter()
if (process.client) {
  router.replace('/articles')
}
</script>

<template>
  <div class="flex items-center justify-center py-20">
    <p class="text-lg text-slate-600">Redirecting to articles...</p>
  </div>
</template>
