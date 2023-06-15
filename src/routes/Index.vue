<template>
  <div class="sticky flex top-0 w-full z-[1] bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="container mx-auto mb-10 mt-5">
      <h1 class="font-bold text-6xl">Overview</h1>
    </div>
  </div>
  <section class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
    <RouterLink :to="{ name: 'NewTask' }" class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex justify-between p-2 items-center group bg-gradient-to-r border-red-500 border-l-0 hover:border-l-8 newButton from-red-600 via-red-300 to-red-600 bg-left-top hover:bg-center transition-all">
      <h2 class="font-bold text-4xl text-white">New</h2>
        <PlusIcon class="w-16 h-16 text-white"/>
    </RouterLink>
    <div v-for="item in taskList" :key="item.id" class="rounded-md drop-shadow-md backdrop-blur-sm w-full dark:bg-stone-900 flex justify-between p-2 items-center group border-red-500 border-l-0 hover:border-l-8 transition-all">
      <div class="flex flex-col gap-4">
        <h2 class="font-bold text-3xl">{{ item.taskName }}</h2>
        <a :href="item.taskLink" class="flex gap-1">To task <LinkIcon class="w-3 h-3" /></a>
      </div>
      <RouterLink :to="{ name: 'Task', params: { id: item.id } }" class="rounded-full bg-black dark:bg-stone-700 w-16 h-16 mr-2 group-hover:mr-0 group-hover:bg-stone-800 transition-all">
        <ArrowRightIcon class="w-full h-full text-white dark:text-black group-hover:text-red-500 transition-all" />
      </RouterLink>
    </div>
  </section>
  <RouterView />
</template>

<script setup lang="ts">
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { ArrowRightIcon, LinkIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { onUnmounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

const cache = useDBCacheStore();

const taskList = ref(cache.task);
const stopCacheWatch = watch(cache, (state) => {
  taskList.value = state.task;
});

onUnmounted(() => {
  stopCacheWatch();
});
</script>
