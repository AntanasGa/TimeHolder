<template>
  <div class="sticky flex top-0 w-full z-[1] bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="container mx-auto mb-10 mt-5">
      <h1 class="font-bold text-6xl">Settings</h1>
    </div>
  </div>
  <section class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
    <div class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex flex-col gap-2 p-2 items-center transition-all">
      <h2 class="font-bold text-3xl">Theme</h2>
      <ThemeSelector />
    </div>
    <div class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex flex-col gap-2 p-2 items-center group transition-all">
      <h2 class="font-bold text-3xl">Import</h2>
      <div></div>
    </div>
    <div class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex flex-col gap-2 p-2 items-center group transition-all">
      <h2 class="font-bold text-3xl">Export</h2>
      <div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ThemeSelector from '@/components/ThemeSelector.vue';


</script>
