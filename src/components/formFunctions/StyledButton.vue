<template>
  <button :class="['rounded-md w-full p-1 font-bold transition-all', props.class]" type="button" @click="(e) => emit('click', e)">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  class: String,
});

const emit = defineEmits<{
  (e: 'click', value: MouseEvent): void,
}>();
</script>
