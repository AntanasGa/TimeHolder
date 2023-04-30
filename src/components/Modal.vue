<template>
  <div class="fixed inset-0 z-[1] flex flex-col justify-center items-center">
    <div class="absolute left-0 top-0 w-screen h-screen backdrop-blur-sm backdrop-saturate-50 bg-black/40 z-[-1]" @click="props.onCancel"></div>
    <button type="button" class="w-8 h-8 fixed top-2 right-2 text-white" @click="props.onCancel">
      <XMarkIcon class="w-full h-full" />
    </button>
      <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{onCancel: () => void}>();
</script>
