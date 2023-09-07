<template>
  <div class="sticky flex flex-col top-0 w-full z-[1] bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="flex flex-col container mx-auto mb-10 mt-5 gap-4">
      <h1 class="font-bold text-6xl">Overview</h1>
      <div>
        <StyledButton :class="[
            'relative flex items-center gap-1 z-10',
            showFilters
              ? 'bg-red-200 dark:bg-red-700 hover:bg-red-300 dark:hover:bg-red-600'
              : 'bg-zinc-100 dark:bg-stone-900 hover:bg-zinc-200 dark:hover:bg-stone-700'
          ].join(' ')"
          @click="() => showFilters = !showFilters"
        >
          <h2 class="font-bold text-lg">Filters</h2>
          <ChevronDownIcon :class="['w-4 h-4 transition-all', showFilters ? 'scale-y-100' : '-scale-y-100']" />
        </StyledButton>
      </div>
      <div :class="[
          'flex flex-col w-inherit bg-stone-100 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-800 dark:to-stone-700 rounded-md transition-all gap-2',
          ...(showFilters ? ['px-4 pt-12 pb-4 h-full -translate-y-14'] : ['h-0 px-4 pt-0 pb-0 -translate-y-100 pointer-events-none opacity-0'])
        ]"
        @transitionend="(e) => (showFilters && (<HTMLDivElement>e.target).querySelector('input')?.focus())"
        ref="filtersEl"
      >
        <StyledInput name="TaskSearch" title="Search" v-model="search" />
      </div>
    </div>
  </div>
  <section class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
    <RouterLink :to="{ name: 'NewTask' }" class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex justify-between p-2 items-center group bg-gradient-to-r border-red-500 border-l-0 hover:border-l-8 newButton from-red-600 via-red-300 to-red-600 bg-left-top hover:bg-center transition-all">
      <h2 class="font-bold text-4xl text-white">New</h2>
        <PlusIcon class="w-16 h-16 text-white"/>
    </RouterLink>
    <div v-for="item in taskList" :key="item.id" class="rounded-md drop-shadow-md backdrop-blur-sm w-full dark:bg-stone-900 flex justify-between p-2 items-center group border-red-500 border-l-0 hover:border-l-8 transition-all">
      <div class="flex flex-col gap-4 shrink overflow-hidden">
        <h2 class="font-bold text-3xl whitespace-nowrap overflow-hidden text-ellipsis">{{ item.taskName }}</h2>
        <a :href="item.taskLink" class="flex gap-1">To task <LinkIcon class="w-3 h-3" /></a>
      </div>
      <RouterLink :to="{ name: 'Task', params: { id: item.id } }"
        class="rounded-full bg-black dark:bg-stone-700 w-16 h-16 mr-2 group-hover:mr-0 group-hover:bg-stone-800 transition-all shrink-0"
        title="Edit task"
        >
        <ArrowRightIcon class="w-full h-full text-white dark:text-black group-hover:text-red-500 transition-all" />
      </RouterLink>
    </div>
  </section>
  <RouterView />
</template>

<script setup lang="ts">
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { ArrowRightIcon, ChevronDownIcon, LinkIcon, PlusIcon } from '@/components/Icons/index';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { StyledButton, StyledInput } from '@/components/formFunctions';

const cache = useDBCacheStore();

const route = useRoute();

const filtersEl = ref<HTMLDivElement | null>(null);

const showFiltersInner = ref(false);
const showFilters = computed({
  get() {
    return showFiltersInner.value;
  },
  set(value) {
    if (!value && search.value.trim()) {
      return;
    }
    showFiltersInner.value = value;
  }
});
const search = ref("");

const taskList = computed(() => {
  if (!search.value.trim()) {
    return cache.task ?? [];
  }

  const lcSearch = search.value.toLocaleLowerCase()
  return cache.task?.filter(x => x.taskLink.toLocaleLowerCase().includes(lcSearch) || x.taskName.toLocaleLowerCase().includes(lcSearch)) ?? [];
});

const stopRouteWatch = watch(() => route.name,
() => {
  if (route.name !== 'Tasks') {
    window.removeEventListener("keydown", searchActivator);
  } else {
    window.addEventListener("keydown", searchActivator);
  }
});

function searchActivator(e: KeyboardEvent) {
  if (e.altKey || e.shiftKey || e.ctrlKey) {
    return;
  }
  if (e.key === 's') {
    if (!showFilters.value) {
      e.preventDefault();
      showFilters.value = true;
      return;
    } else {
      const inputEl = filtersEl.value?.querySelector("input");
      if (inputEl !== document.activeElement) {
        e.preventDefault();
        inputEl?.focus();
      }
      return;
    }
  }

  if (showFilters.value && e.key === 'Escape') {
    showFilters.value = false;
    return;
  }
}

onMounted(() => {
  if (route.name !== 'Tasks') {
    return;
  }
  window.addEventListener("keydown", searchActivator);
});

onUnmounted(() => {
  stopRouteWatch();
  window.removeEventListener("keydown", searchActivator);
});
</script>
