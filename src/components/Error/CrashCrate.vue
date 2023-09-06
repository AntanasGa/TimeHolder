<template>
  <div class="w-64 h-64 flex justify-center">
    <div :class="['mx-auto transition-all', didMount ? 'translate-y-10 scale-125' : '-translate-y-full scale-70']">
      <div class="relative">
        <div :class="[
          'absolute transition-all duration-500',
          didMount
            ? '-translate-x-1/2 top-0 left-0 scale-1'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0'
          ]"
          >
          <CogIcon :class="`${cogSize} animate-spin`"/>
        </div>
        <div :class="[
          'absolute transition-all duration-500',
          didMount
            ? 'top-0 right-0 translate-x-0 translate-y-0 scale-1 '
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0'
          ]"
          >
            <Cog6ToothIcon :class="`${cog6Size} animate-spin`"/>
        </div>
        <div :class="[
          'absolute transition-all duration-500',
          didMount
            ? 'left-0 top-3/4 translate-x-0 translate-y-0 scale-1 animate-bounce'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0'
          ]"
        >
          <AtSymbolIcon :class="`${AtSize} stroke-2`"/>
        </div>
        <div :class="cubeSize">
          <CubeTransparentIcon :class="['absolute animate-pulse top-0', cubeSize, didMount ? 'opacity-1' : 'opacity-0']" />
          <CubeIcon :class="['absolute transition-all top-0 stroke-white stroke-2 fill-white', didMount ? 'opacity-0' : 'opacity-1']" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { AtSymbolIcon, Cog6ToothIcon, CogIcon, CubeIcon, CubeTransparentIcon } from '@/components/Icons/index';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{halfSize?: boolean}>();
const cogSize = computed(() => !!props.halfSize ? 'w-8 h-8' : 'w-16 h-16');
const cog6Size = computed(() => !!props.halfSize ? 'w-12 h-12' : 'w-24 h-24');
const AtSize = computed(() => !!props.halfSize ? 'w-7 h-7' : 'w-14 w-14');
const cubeSize = computed(() => !!props.halfSize ? 'w-32 h-32' : 'w-64 h-64');

const didMount = ref(false);

onMounted(() => {
  setTimeout(() => {
    didMount.value = true;
  }, 200);
})
</script>
