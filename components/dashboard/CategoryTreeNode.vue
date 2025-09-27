<script setup lang="ts">
import { computed } from 'vue'
import type { NavNode } from '@/stores/navigation'

defineOptions({ name: 'CategoryTreeNode' })

const props = defineProps<{
  node: NavNode
  selectedId: string
  level?: number
}>()

const emit = defineEmits<{ (e: 'select', id: string): void }>()

const isSelected = computed(() => props.selectedId === props.node.id)
const hasChildren = computed(() => Boolean(props.node.children && props.node.children.length))

const paddingStyle = computed(() => ({
  paddingLeft: `${(props.level ?? 0) * 0.75}rem`
}))

const selectNode = () => {
  emit('select', props.node.id)
}
</script>

<template>
  <li>
    <button
      class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition"
      :class="[
        isSelected
          ? 'bg-primary-100 font-semibold text-primary-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      ]"
      :style="paddingStyle"
      type="button"
      @click="selectNode"
    >
      <span>{{ node.label }}</span>
      <span v-if="hasChildren" class="text-xs text-slate-400">{{ node.children?.length }}</span>
    </button>
    <ul v-if="hasChildren" class="ml-1 border-l border-slate-200 pl-2">
      <CategoryTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="(level ?? 0) + 1"
        :selected-id="selectedId"
        @select="emit('select', $event)"
      />
    </ul>
  </li>
</template>
