<template>
  <h1 class="font-bold text-6xl mb-10">Overview</h1>
  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    <RouterLink to="/tasks/new" class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex justify-between p-2 items-center group bg-gradient-to-r newButton from-red-600 via-red-300 to-red-600 bg-left-top hover:bg-center transition-all">
      <h2 class="font-bold text-4xl text-white">New</h2>
        <PlusIcon class="w-16 h-16 text-white"/>
    </RouterLink>
    <div v-for="item in taskList" :key="item.id" class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex justify-between p-2 items-center group border-red-500 border-l-0 hover:border-l-8 transition-all">
      <div class="flex flex-col gap-4">
        <h2 class="font-bold text-3xl">{{ item.taskName }}</h2>
        <a :href="item.taskLink" class="flex gap-1">To task <LinkIcon class="w-3 h-3" /></a>
      </div>
      <RouterLink :to="`/tasks/${item.id}`" class="rounded-full bg-black w-16 h-16 mr-2 group-hover:mr-0 group-hover:bg-gray-800 transition-all">
        <ArrowRightIcon class="w-full h-full text-white group-hover:text-red-500 transition-all" />
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