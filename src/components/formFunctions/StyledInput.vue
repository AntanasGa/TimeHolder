<template>
  <div class="relative group pt-1" :title="title" :data-tf="JSON.stringify(props)">
    <input v-if="type !== 'area'"
      :type="type || 'text'"
      :class="['relative outline-none rounded-md w-full p-2 pl-4 peer/input text-left bg-zinc-50 dark:bg-stone-900 focus:bg-zinc-200 dark:focus:bg-stone-700 hover:bg-zinc-100 dark:hover:bg-stone-600', className]"
      :name="name"
      :id="name"
      v-model="value"
      @click="(e) => click?.(e)"
      @focusin="(e) => focusin?.(e)"
    />
    <textarea v-else
      :name="name"
      :id="name"
      class="relative outline-none rounded-md w-full p-2 pl-4 peer/input text-left bg-zinc-50 dark:bg-stone-900 focus:bg-zinc-200 dark:focus:bg-stone-700 hover:bg-zinc-100 dark:hover:bg-stone-600"
      v-model="value"
    ></textarea>
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
      ...(keepUp || value ? ['-translate-y-1/2 top-1 text-sm'] : ['tranlsate-y-1/2 top-3'])
    ]">
      {{ title }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{modelValue?: string, type?: string, title?: string, name?: string, className?: string, keepUp?: boolean, click?: (e?: MouseEvent) => void, focusin?: (e?: FocusEvent) => void}>();
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
