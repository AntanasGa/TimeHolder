<template>
  <div class="sticky flex top-0 w-full z-[1] bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="container mx-auto mb-10 mt-5">
      <h1 class="font-bold text-6xl">Settings</h1>
    </div>
  </div>
  <section class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
    <div class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex flex-col gap-2 p-2 items-center transition-all">
      <h2 class="font-bold text-3xl">Theme</h2>
      <ThemeSelector />
    </div>
    <div class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex flex-col gap-2 p-2 items-center group transition-all">
      <h2 class="font-bold text-3xl">Import</h2>
      <div class="flex flex-col items-center gap-2">
        <div class="flex gap-2">
          <input type="checkbox" id="overrideDBSelector" v-model="overwrite">
          <label for="overrideDBSelector">Overwrite database</label>
        </div>
        <StyledButton title="Import data from local file" class="bg-zinc-100 dark:bg-stone-800 hover:bg-zinc-200 dark:hover:bg-stone-700" @click="() => initImportData()">
        <ArrowUpTrayIcon class="w-16 h-16" />
        </StyledButton>
      </div>
    </div>
    <div class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex flex-col gap-2 p-2 items-center group transition-all">
      <h2 class="font-bold text-3xl">Export</h2>
      <div>
        <StyledButton title="Export data to local file" class="bg-zinc-100 dark:bg-stone-800 hover:bg-zinc-200 dark:hover:bg-stone-700" @click="() => exportData()">
          <ArrowDownTrayIcon class="w-16 h-16" />
        </StyledButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ThemeSelector from '@/components/ThemeSelector.vue';
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { useIndexedDbStore } from '@/stores/IndexedDbStore';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/solid';
import { ref } from 'vue';
import { CacheTypes } from '@/stores/documents';

const cache = useDBCacheStore();
const db = useIndexedDbStore();

const overwrite = ref(false);

function exportData() {
  const prevBusy = !!db.busy;
  db.busy = true;
  const fileData = new Blob([JSON.stringify({ entity: cache.entity, task: cache.task })], { type: 'text/plain' });

  const downloadEl = document.createElement('a');
  downloadEl.download = `task-export-${new Date().valueOf()}.json`;
  downloadEl.href = URL.createObjectURL(fileData);
  downloadEl.click();
  requestAnimationFrame(() => (downloadEl.remove(), db.busy = prevBusy));
}

const uploadEl = ref<HTMLInputElement | undefined>();

function initImportData() {
  
  uploadEl.value = document.createElement('input');
  uploadEl.value.type = "file";
  uploadEl.value.accept = "application/json";
  uploadEl.value.onchange = async function () {
    await onFileUpload(uploadEl.value);
    uploadEl.value && (uploadEl.value.onchange = null);
    uploadEl.value?.remove();
  };
  uploadEl.value.showPicker();
}

async function onFileUpload(e: HTMLInputElement | undefined) {
  const prevBusy = !!db.busy;
  db.busy = true;
  await new Promise(async (resolve, reject) => {
    if (e?.files?.length !== 1 || e.files?.[0].type != 'application/json') {
      return reject();
    }

    const file = e.files[0];
    let imports: Partial<CacheTypes> | null = null;

    try {
      imports = JSON.parse(await file.text());
    } catch (e) {
      return reject();
    }

    if (imports === null) {
      return reject();
    }

    const requiredKeys: (keyof CacheTypes)[] = ['entity', 'task'];
    if (Object.keys(imports).length !== requiredKeys.length || !Object.keys(imports).every((x) => (requiredKeys as string[]).includes(x))) {
      console.log('preflight failed');
      return reject();
    }

    console.log('oreflight success');

    resolve(undefined);
  })
  .catch(() => {})
  .finally(() => db.busy = prevBusy);
}

</script>
