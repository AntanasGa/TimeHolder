<template>
  <div class="relative group pt-1" title="foo">
    <input
      :type="type || 'text'"
      class="relative outline-none rounded-md w-full bg-zinc-50 focus:bg-zinc-200 p-2 pl-4 peer/input hover:bg-zinc-100"
      :name="name"
      :id="name"
      v-model="value"
    />
    <label :for="name"
    :class="[
      'pointer-events-none',
      'absolute',
      'text-md',
      'left-4',
      'transition-all',
      'peer-focus/input:-translate-y-1/2',
      'peer-focus/input:text-sm',
      'peer-focus/input:top-1',
      'peer-focus/input:left',
      ...(value ? ['-translate-y-1/2 top-1 text-sm'] : ['tranlsate-y-1/2 top-3'])
    ]">
      {{ title }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
  type: String,
  title: String,
  name: String,
});
const emit = defineEmits<{ (e: 'update:modelValue', value: string | undefined): void }>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
})
</script>
