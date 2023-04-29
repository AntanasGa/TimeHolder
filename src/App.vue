<template>
  <DatabaseContext>
    <template #default="{ accessable, busy }">
      <div class="relative top-0 inset-x-0 h-1 mb-1">
        <div v-if="busy" class="w-full h-full loadbar"></div>
      </div>
      <div class="container">
      <RouterView />
      </div>
      <Navigation />
      <div v-if="accessable" class="fixed inset-0">unavailable</div>
    </template>
  </DatabaseContext>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import DatabaseContext from '@/components/DatabaseContext.vue';
import Navigation from '@/components/Navigation.vue';
</script>
