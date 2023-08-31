<template>
  <div></div>
</template>

<script setup lang="ts">
import { useMessagingStore } from '@/stores/MessagingStore';
import { onUnmounted } from 'vue';

const messaging = useMessagingStore();
messaging.loading = true;

onUnmounted(() => {
  messaging.loading = false;
})
</script>
