<template>
  <button :class="[
      'rounded-md w-full p-1 font-bold transition-all',
      props.class,
      ...disabled ? ['cursor-not-allowed'] : [],
    ]"
    type="button"
    @click="(e) => emit('click', e)"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  class: String,
  disabled: Boolean,
});

const emit = defineEmits<{
  (e: 'click', value: MouseEvent): void,
}>();
</script>
