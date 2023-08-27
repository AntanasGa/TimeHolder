<template>
  <div class="relative w-full" ref="el">
    <StyledInput
      :title="title"
      :name="name"
      :type="active ? 'text' : 'button'"
      v-model="value"
      @click="(e: MouseEvent) => (active = true, onInputClick(e))"
      @focusin="(e: FocusEvent) => ((e.target as HTMLInputElement).click())"
    />
    <Transition name="option-activity">
      <template v-if="active">
        <div class="absolute left-0 right-0 top-full z-10 max-h-48 rounded-md drop-shadow-md backdrop-blur-sm bg-white/90 dark:bg-stone-800 p-1 overflow-y-auto">
          <template v-if="Object.keys(activeSelection || {}).length" >
            <StyledInput modelValue="None" :key="-1" type="button" @click="(_: MouseEvent) => (mv = -1, onFocusOut())" />
            <StyledInput v-for="(v, k) in activeSelection" :modelValue="v" :key="k" type="button" @click="(_: MouseEvent) => (mv = k, onFocusOut())" />
          </template>
          <p v-else >No items present</p>
        </div>
      </template>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import StyledInput from './StyledInput.vue';

const props = defineProps<{modelValue?: number, selection?: string[], title?: string, name?: string, className?: string}>();
const stopWatcher = watch(() => props.modelValue, () => requestAnimationFrame(() => value.value = props.selection?.[mv.value ?? -1] ?? ""));
const value = ref(("" + (props.selection?.[props.modelValue ?? -1] ?? "")) ?? "");
const el = ref<HTMLDivElement>();
const innerMv = ref(props.modelValue ?? -1);

function onInputClick(e: MouseEvent | FocusEvent) {
  (e.target as HTMLInputElement).focus();
  window.addEventListener("click", onFocusOut);
  window.addEventListener("focusin", onFocusOut);
}

function onFocusOut(e?: MouseEvent | FocusEvent) {
  if (!el.value) {
    return;
  }
  const target = e?.target as HTMLElement | undefined;
  if (!target || !el.value.contains(target)) {
    active.value = false;
    // eliminates ghosing \/
    requestAnimationFrame(() => value.value = props.selection?.[mv.value ?? -1] ?? "");
    window.removeEventListener("click", onFocusOut);
    window.removeEventListener("focusin", onFocusOut);
  }
}

onUnmounted(() => {
  window.removeEventListener("click", onFocusOut);
  window.removeEventListener("focusin", onFocusOut);
  stopWatcher();
});

const activeSelection = computed(() => props.selection?.map<[number, string]>((x, i) => [i, x])
  .filter(([_, v]) => v.toLowerCase().includes(value.value.toLowerCase()))
  .reduce((acc, [k, v]) => ({...acc, [k]: v}), {} as Record<number, string>));

const active = ref(false);

const emit = defineEmits<{ (e: 'update:modelValue', value: number | undefined): void }>();

const mv = computed({
  get() {
    return props.modelValue ?? innerMv.value;
  },
  set(v) {
    innerMv.value = +v;
    emit('update:modelValue', +v);
  }
})
</script>
<style>
.option-activity-leave-active,
.option-activity-enter-active {
  transition: all 0.10s ease-in;
}
.option-activity-leave-to,
.option-activity-enter-from {
  opacity: 0;
  transform: translateY(-2em) scaleY(0.5);
}
</style>
