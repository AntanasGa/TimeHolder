<template>
  <div class="container">
  <RouterView />
  </div>
  <Navigation />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navigation from '@/components/Navigation.vue';
import { useIndexedDbStore } from '@/stores/IndexedDbStore';

const db = useIndexedDbStore();
db.initialize().then((res) => {
  console.log(res);
})
</script>
