<template>
  <div class="fixed bottom-4 left-2/4 -translate-x-2/4">
    <nav class="rounded-md drop-shadow-md backdrop-blur-sm bg-white/30">
      <ul class="flex gap-4">
        <li class="p-3 rounded-md group bg-white/30 transition-colors hover:bg-red-500">
          <RouterLink to="/" title="Home">
            <RectangleStackIcon class="h-12 w-12 relative translate-y-0 text-black-500 transition-popout group-hover:text-white group-hover:-translate-y-3"/>
            <span class="text-xs font-bold transition-popout absolute opacity-0 translate-y-1/4 group-hover:opacity-100 group-hover:-translate-y-1/4 group-hover:text-white">Home</span>
          </RouterLink>
        </li>
        <li class="p-3 rounded-md group bg-white/30 transition-colors hover:bg-red-500">
          <RouterLink to="/entries" title="Entries">
            <ListBulletIcon class="h-12 w-12 relative translate-y-0 text-black-500 transition-popout group-hover:text-white group-hover:-translate-y-3"/>
            <span class="text-xs font-bold transition-popout absolute opacity-0 translate-y-1/4 group-hover:opacity-100 group-hover:-translate-y-2/4 group-hover:text-white">Entries</span>
          </RouterLink>
        </li>
        <li class="p-3 rounded-md group bg-white/30 transition-colors hover:bg-red-500">
          <RouterLink to="/file" title="Import/Export">
            <ArrowsUpDownIcon class="h-12 w-12 relative translate-y-0 text-black-500 transition-popout group-hover:text-white group-hover:-translate-y-3"/>
            <span class="text-xs font-bold transition-popout absolute opacity-0 translate-y-1/4 group-hover:opacity-100 group-hover:-translate-y-2/4 group-hover:text-white">Imp./Exp.</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ListBulletIcon, RectangleStackIcon, ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
</script>
