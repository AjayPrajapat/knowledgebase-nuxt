<script setup lang="ts">
import type { NavNode } from '@/stores/navigation'

const props = defineProps<{
  tree: NavNode[]
  selectedId: string
}>()

const emit = defineEmits<{ (e: 'select', id: string): void }>()
</script>

<template>
  <nav class="space-y-3">
    <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Master Categories</h2>
    <ul class="space-y-1">
      <CategoryTreeNode
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :selected-id="selectedId"
        @select="emit('select', $event)"
      />
    </ul>
  </nav>
</template>
