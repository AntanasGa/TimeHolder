<template>
  <div class="sticky flex top-0 w-full bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="container mx-auto mb-10 mt-5">
    </div>
  </div>
  <section class="container mx-auto mt-28">
    <div>
      <div class="flex justify-center">
        <CrashCrate />
      </div>
      <div class="flex justify-center mt-20">
        <h1 class="font-black text-4xl">Sorry, I didn't quite get that</h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CrashCrate from '@/components/Error/CrashCrate.vue';
import { onMounted, ref } from 'vue';

const didMount = ref(false);

onMounted(() => {
  setTimeout(() => {
    didMount.value = true;
  }, 200);
})
</script>
