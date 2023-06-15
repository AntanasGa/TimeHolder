<template>
  <div class="grid grid-cols-3 gap-4">
        <StyledButton title="Light theme"
          :class="[ 'h-16 w-20 overflow-hidden group relative', 'hover:border-b-4', 'border-red-500', ...(theme === 'light' ? ['border-b-4'] : ['border-b-0'])].join(' ')"
          @click="() => setTheme('light')"
        >
          <div class="flex flex-col items-center group-hover:-translate-y-2 transition-all">
            <SunIcon class="w-16 h-16 group-hover:w-10 group-hover:h-10 transition-all" />
            <span>Light</span>
          </div>
        </StyledButton>
        <StyledButton title="Device theme"
          :class="[ 'h-16 w-20 overflow-hidden group relative', 'hover:border-b-4', 'border-red-500', ...(theme === 'device' ? ['border-b-4'] : ['border-b-0'])].join(' ')"
          @click="() => setTheme(undefined)"
        >
          <div class="flex flex-col items-center group-hover:-translate-y-2 transition-all">
            <ComputerDesktopIcon class="w-16 h-16 group-hover:w-10 group-hover:h-10 transition-all" />
            <span>Device</span>
          </div>
        </StyledButton>
        <StyledButton title="Dark theme"
          :class="[ 'h-16 w-20 overflow-hidden group relative', 'hover:border-b-4', 'border-red-500', ...(theme === 'dark' ? ['border-b-4'] : ['border-b-0'])].join(' ')"
          @click="() => setTheme('dark')"
        >
          <div class="flex flex-col items-center group-hover:-translate-y-2 transition-all">
            <MoonIcon class="w-16 h-16 group-hover:w-10 group-hover:h-10 transition-all" />
            <span>Dark</span>
          </div>
        </StyledButton>
      </div>
</template>

<script setup lang="ts">
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/solid';
import { onUnmounted, ref, watch } from 'vue';

function setTheme(update: Exclude<typeof theme["value"], 'device'> | undefined) {
  switch (update) {
    case 'dark':
    case 'light':
      localStorage.theme = update;
      break;
    default:
      delete localStorage.theme;
    }
    document.documentElement.className = update ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    theme.value = (localStorage.theme === 'dark' && 'dark') || ('theme' in localStorage && 'light') || 'device';
}

const theme = ref((localStorage.theme === 'dark' && 'dark') || ('theme' in localStorage && 'light') || 'device');

const unwatchTheme = watch(() => localStorage.theme as string | undefined, () => theme.value = (localStorage.theme === 'dark' && 'dark') || ('theme' in localStorage && 'light') || 'device');

onUnmounted(() => {
  unwatchTheme()
})
</script>
