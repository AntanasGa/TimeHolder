<template>
  <div class="sticky flex top-0 w-full bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="container mx-auto mb-10 mt-5">
    </div>
  </div>
  <section class="container mx-auto mt-28">
    <div>
      <div :class="['w-64 mx-auto transition-all', didMount ? 'translate-y-10 scale-125' : '-translate-y-full scale-70']">
        <div class="relative">
          <div :class="[
            'absolute transition-all duration-500',
            didMount
              ? '-translate-x-1/2 top-0 left-0 scale-1'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0'
            ]"
            >
            <CogIcon class="w-16 h-16 animate-spin"/>
          </div>
          <div :class="[
            'absolute transition-all duration-500',
            didMount
              ? 'top-0 right-0 translate-x-0 translate-y-0 scale-1 '
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0'
            ]"
            >
              <Cog6ToothIcon class="w-24 h-24 animate-spin"/>
          </div>
          <div :class="[
            'absolute transition-all duration-500',
            didMount
              ? 'left-0 top-3/4 translate-x-0 translate-y-0 scale-1 animate-bounce'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0'
            ]"
          >
            <AtSymbolIcon class="w-14 h-14 stroke-2"/>
          </div>
          <div class="w-64 h-64">
            <CubeTransparentIcon :class="['absolute w-64 h-64 animate-pulse top-0', didMount ? 'opacity-1' : 'opacity-0']" />
            <CubeIcon :class="['absolutew-64 h-64 transition-all top-0 stroke-white stroke-2 fill-white', didMount ? 'opacity-0' : 'opacity-1']" />
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-20">
        <h1 class="font-black text-4xl">Sorry, I didn't quite get that</h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AtSymbolIcon, Cog6ToothIcon, CogIcon, CubeIcon, CubeTransparentIcon } from '@heroicons/vue/24/solid';
import { onMounted, ref } from 'vue';

const didMount = ref(false);

onMounted(() => {
  setTimeout(() => {
    didMount.value = true;
  }, 200);
})
</script>
