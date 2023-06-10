<template>
    <div class="sticky flex flex-col top-0 w-full z-[1] bg-white/50 backdrop-blur-md">
    <div class="flex flex-col container mx-auto mb-10 mt-5 gap-4 flex-wrap">
      <h1 class="font-bold text-6xl">Entities</h1>
      <div class="flex flex-col">
        <div>
          <StyledButton :class="[
              'relative flex items-center gap-1 z-10',
              showFilters
                ? 'bg-red-200 hover:bg-red-300'
                : 'bg-zinc-100 hover:bg-zinc-200'
            ].join(' ')"
            @click="() => showFilters = !showFilters"
          >
          <h3 class="font-bold text-lg">Filters </h3>
          <ChevronDownIcon :class="['w-4 h-4 transition-all', showFilters ? 'scale-y-100' : '-scale-y-100']" />
        </StyledButton>
        </div>
        <div :class="['w-full bg-stone-100 rounded-md overflow-hidden transition-all', ...(showFilters ? ['px-4 pt-12 pb-4 h-full -translate-y-10'] : ['h-0 px-4 pt-0 pb-0 -translate-y-100 pointer-events-none opacity-0'])]">
        </div>
      </div>
    </div>
  </div>
  <section class="container mx-auto">
  </section>
  <RouterView />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const selectedTask = ref(route.query["taskId"]);
const showFilters = ref(typeof selectedTask.value !== 'undefined');
</script>
