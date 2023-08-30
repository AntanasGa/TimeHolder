<template>
  <div class="fixed inset-0 z-[1] flex flex-col justify-center items-center">
    <div class="absolute left-0 top-0 w-screen h-screen backdrop-blur-sm backdrop-saturate-50 bg-black/40 z-[-1]" @mousedown="props.onCancel"></div>
    <button type="button" class="w-8 h-8 fixed top-2 right-2 text-white" @mousedown="props.onCancel">
      <XMarkIcon class="w-full h-full" />
    </button>
      <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { useModalQueStore } from '@/stores/ModalCueStore';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps<{onCancel: () => void}>();
const modalQue = useModalQueStore();
const itemId = ref(modalQue.generate);
modalQue.push(itemId.value);

function keyboardCancel(e: KeyboardEvent) {
  if (e.key !== "Escape" || e.shiftKey || e.ctrlKey || !modalQue.isCurrent(itemId.value)) {
    return;
  }
  props.onCancel();
} 

onMounted(() => {
  window.addEventListener("keyup", keyboardCancel)
});

onBeforeUnmount(() => {
  window.removeEventListener("keyup", keyboardCancel);
  modalQue.yank(itemId.value);
});
</script>
