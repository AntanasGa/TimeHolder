<template>
  <DatabaseContext>
    <template #default="{ accessable, busy }">
      <template v-if="accessable">
      <div class="relative top-0 inset-x-0 h-1 mb-1">
        <div v-if="busy" class="w-full h-full loadbar"></div>
      </div>
      <div class="container">
      <RouterView />
      </div>
      <Navigation />
      </template>
      <div v-else class="fixed flex flex-col inset-0 bg-red-500 text-white justify-center items-center gap-2">
        <NoSymbolIcon class="h-64 w-64"/>
        <h1 class="text-5xl">Unavailable</h1>
        <p>Could not load in database</p>
      </div>
      <ToastBar />
    </template>
  </DatabaseContext>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import DatabaseContext from '@/components/DatabaseContext.vue';
import Navigation from '@/components/Navigation.vue';
import { NoSymbolIcon } from '@heroicons/vue/24/solid';
import ToastBar from './components/ToastBar.vue';
</script>
