<template>
  <section aria-label="Toasts" title="Toasts" class="fixed top-2 right-2 flex flex-col gap-2 max-h-screen z-10">
    <div v-for="item in toastItems"
      :key="item.minId"
      @mouseenter="() => currentIndex = item.minId"
      @mouseleave="() => currentIndex = ''"
      :class="[
        'rounded-md',
        'drop-shadow-md',
        'backdrop-blur-sm',
        'gap-4',
        'w-96',
        'relative',
        getColor(item.status)
      ].join(' ')"
    >
    <div class="p-2 pb-3">
      <div class="flex justify-between font-bold">
        <h3 class="text-md">{{ item.title }}</h3>
        <button type="button" title="Close tost" @click="() => toastItems = toastItems.filter(x => x.minId !== item.minId)"><XMarkIcon class="w-6 h-6" /></button>
      </div>
      <p>{{ item.message }}</p>
    </div>
      <div :class="['w-full', 'h-1', 'absolute', '-translate-y-1', 'rounded-md', getColor(item.status)].join(' ')">
        <div :class="['h-full', getColor(item.status, 'progress')].join(' ')" :style="{ width: `${ item.timeout ? (item.timeout / item.max) : 0 }%` }"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IToast, ToastStatus, useMessagingStore } from '@/stores/MessagingStore';
import { onUnmounted, ref } from 'vue';
import { numberId } from '@/util/Id'
import { XMarkIcon } from '@/components/Icons/index';

const toasts = useMessagingStore();

const toastItems = ref<(IToast & { minId: string, max: number })[]>([]);

const currentIndex = ref("");

const UPDATE_INTERVAL = 25;
const MULTIPLIED_UPDATE_INTERVAL = UPDATE_INTERVAL * 100;
function onInterval() {
  const items = [...toastItems.value];
  toastItems.value = items.map((x) => ({...x, timeout: x.timeout - (currentIndex.value === x.minId ? 0 : MULTIPLIED_UPDATE_INTERVAL) })).filter(x => x.timeout > 1);
}

const interval = setInterval(onInterval, UPDATE_INTERVAL);

function onToast() {
  // * 100 accounts for the %
  toastItems.value = [...toastItems.value, ...toasts.toasts.map((x) => ({...x, minId: numberId(12), max: x.timeout, timeout: x.timeout * 100}))];
  toasts.toasts = [];
}

function getColor(status: ToastStatus, item: "background" | "progress" = "background") {
  switch (status) {
    case ToastStatus.Success: 
      return item === "background" ? "bg-green-300 dark:bg-green-800" : "bg-green-500 dark:bg-green-600";
    case ToastStatus.Warn:
      return item === "background" ? "bg-orange-300 dark:bg-orange-800" : "bg-orange-500 dark:bg-orange-600";
    case ToastStatus.Error:
      return item === "background" ? "bg-red-300 dark:bg-red-800" : "bg-red-500 dark:bg-red-600";
    default:
      return item === "background" ? "bg-zinc-100 dark:bg-stone-800" : "bg-zinc-400 dark:bg-stone-600";
  }
}


toasts.subscribe(onToast);
onUnmounted(() => {
  toasts.unsubscribe(onToast);
  clearInterval(interval);
});
</script>
