<template>
  <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md drop-shadow-md backdrop-blur-sm bg-white/50 dark:bg-white/10">
    <ul class="flex gap-4">
      <NavigationLink to="/tasks" title="Home">
        <template #default="{ className }">
          <RectangleStackIcon :class="className" />
        </template>
      </NavigationLink>
      <NavigationLink to="/entities" title="Entries">
        <template #default="{ className }">
          <ListBulletIcon :class="className"/>
        </template>
      </NavigationLink>
      <NavigationLink to="/settings" title="Settings">
        <template #default="{ className }">
          <Cog6ToothIcon :class="className"/>
        </template>
      </NavigationLink>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ListBulletIcon, RectangleStackIcon, Cog6ToothIcon } from '@/components/Icons/index';
import NavigationLink from './navigation/NavigationLink.vue';
</script>
