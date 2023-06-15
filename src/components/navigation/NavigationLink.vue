<template>
  <li :class="[
    'p-3',
    'rounded-md',
    'group',
    'transition-colors',
    ...route.fullPath.startsWith(to) ? ['bg-red-200 dark:bg-red-900', 'hover:bg-red-400 dark:hover:bg-red-700'] : ['bg-white/30 dark:bg-white/0', 'hover:bg-red-500 dark:hover:bg-red-600'],
  ]">
    <RouterLink :to="to" :title="title">
      <slot className="h-12 w-12 relative translate-y-0 text-black-500 dark:text-stone-300 transition-popout group-hover:text-white group-hover:-translate-y-3"></slot>
      <span
        :class="[
          'text-xs',
          'text-center',
          'text-ellipsis',
          'overflow-hidden',
          'w-12',
          'font-bold',
          'transition-popout',
          'absolute',
          'opacity-0',
          'translate-y-1/4',
          'group-hover:opacity-100',
          'group-hover:-translate-y-1/4',
          'group-hover:text-white',
          ].join(' ')"
      >{{ title }}</span>
    </RouterLink>
  </li>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
const { title, to } = defineProps({
  title: String,
  to: {
    type: String,
    required: true,
  },
});
const route = useRoute();
</script>
