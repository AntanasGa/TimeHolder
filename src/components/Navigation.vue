<template>
  <div class="fixed bottom-4 left-2/4 -translate-x-2/4">
    <nav class="rounded-md drop-shadow-md backdrop-blur-sm bg-white/30">
      <ul class="flex gap-4">
        <NavigationLink to="/" title="Home">
          <template #default="{ className }">
            <RectangleStackIcon :class="className" />
          </template>
        </NavigationLink>
        <NavigationLink to="/entries" title="Entries">
          <template #default="{ className }">
            <ListBulletIcon :class="className"/>
          </template>
        </NavigationLink>
        <NavigationLink to="/file" title="Import/Export">
          <template #default="{ className }">
            <ArrowsUpDownIcon :class="className"/>
          </template>
        </NavigationLink>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ListBulletIcon, RectangleStackIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
import NavigationLink from './navigation/NavigationLink.vue';
</script>
