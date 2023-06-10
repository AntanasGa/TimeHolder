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
  <div class="container mx-auto overflow-x-auto">
    <table class="w-full table-auto">
      <thead>
        <tr class="bg-zinc-200">
          <th>ID</th>
          <th>Task</th>
          <th>Comment</th>
          <th>Start</th>
          <th>End</th>
          <th>Diff</th>
          <th>Actions</th>
        </tr>
        <tr>
          <th colspan="7">
            <RouterLink :to="{ name: 'NewEntity' }" class="flex place-content-between m-1 rounded-md text-white drop-shadow-md backdrop-blur-sm p-2 items-center group bg-gradient-to-r newButton from-red-600 via-red-300 to-red-600 bg-left-top hover:bg-center transition-all">
              <span>New</span>
              <PlusIcon class="w-8 h-8 text-white"/>
            </RouterLink>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!mappedEntities || !mappedEntities.length">
          <td colspan="7" class="text-2xl text-center">No entities present</td>
        </tr>
        <tr v-else v-for="entity in mappedEntities" :key="entity.id">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td><PencilIcon class="h-4 w-4" /></td>
        </tr>
      </tbody>
    </table>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon, PencilIcon, PlusIcon } from '@heroicons/vue/24/solid';
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import { useRoute } from 'vue-router';
import { useDBCacheStore } from '@/stores/DBCacheStore';

const route = useRoute();
const selectedTask = ref(route.query["taskId"]);
const showFilters = ref(typeof selectedTask.value !== 'undefined');
const cache = useDBCacheStore();
const mappedEntities = cache.entitesWithTasks;
</script>
