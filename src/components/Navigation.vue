<template>
  <div class="fixed bottom-4 left-2/4 -translate-x-2/4">
    <nav class="rounded-md drop-shadow-md backdrop-blur-sm bg-white/50 dark:bg-white/10">
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
  </div>
</template>

<script setup lang="ts">
import { ListBulletIcon, RectangleStackIcon, Cog6ToothIcon } from '@heroicons/vue/24/solid';
import NavigationLink from './navigation/NavigationLink.vue';
</script>
