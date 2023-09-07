<template>
  <div class="flex flex-col rounded-md drop-shadow-md backdrop-blur-sm bg-white dark:bg-stone-800 p-2 gap-2 max-w-[32rem]">
    <div class="flex justify-center -translate-y-3/4 h-32">
      <CrashCrate halfSize />
    </div>
    <div></div>
    <h1 class="text-2xl font-bold text-center">Woah,</h1>
    <p>looks like something happened to the storage...</p>
    <p class="text-xl font-medium my-4">How about we backup the data, just in case?</p>
    <p class="text-xl text-red-500 my-4" v-if="!!errorMsg.trim()">{{ errorMsg }}</p>
    <StyledButton class="col flex-1 text-white dark:text-black bg-zinc-900 dark:bg-stone-100 hover:bg-zinc-800 dark:hover:bg-stone-300 dark:active:bg-stone-200 active:bg-zinc-700"
      title="I'm fine if i have to start fresh"
      @click="() => selectedMenu = ModalConfirm.Exit"
    >
      I'm fine if i have to start fresh
    </StyledButton>
    <StyledButton class="col flex-1 text-white bg-red-400 hover:bg-red-500 active:bg-red-600 dark:bg-red-800 dark:hover:bg-red-600 dark:active:bg-red-700"
      title="Start an export"
      @click="OnProceed"
    >
      Start an export
    </StyledButton>
  </div>
  <Modal v-if="selectedMenu !== ModalConfirm.None" :onCancel="() => selectedMenu = ModalConfirm.None">
    <div class="relative flex flex-col rounded-md drop-shadow-md backdrop-blur-sm bg-white dark:bg-stone-800 p-2 gap-8 max-w-[18rem]">
      <h1 class="font-bold text-xl mb-2">Are you sure you want to leave without exporting?</h1>
      <h2 class="font-medium text-md mb-2">Proceeding may include loss of data</h2>
      <StyledButton class="col flex-1 text-white dark:text-black bg-zinc-900 dark:bg-stone-100 hover:bg-zinc-800 dark:hover:bg-stone-300 dark:active:bg-stone-200 active:bg-zinc-700"
          @click="() => selectedMenu = ModalConfirm.None"
        >No</StyledButton>
        <StyledButton class="col flex-1 text-white bg-red-400 hover:bg-red-500 active:bg-red-600 dark:bg-red-800 dark:hover:bg-red-600 dark:active:bg-red-700"
          @click="OnProceed"
        >Yes</StyledButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { StyledButton } from '@/components/formFunctions';
import CrashCrate from '@/components/Error/CrashCrate.vue';
import Modal from '../Modal.vue';
import { ModalConfirm } from '@/util/Form';
import { ref } from 'vue';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { useMessagingStore } from '@/stores/MessagingStore';
import { createCacheBlob, createFile } from '@/util/DataHandling';

const cache = useDBCacheStore();
const messaging = useMessagingStore();
const selectedMenu = ref<ModalConfirm>(ModalConfirm.None);
const errorMsg = ref('');

async function OnProceed() {
  errorMsg.value = '';
  messaging.loading = true;
  await new Promise(async (resolve, reject) => {
    if (selectedMenu.value === ModalConfirm.Exit) {
      return resolve(void 0);
    }

    const dataBlob = await createCacheBlob(cache.entireCache).catch(() => undefined);
    if (!dataBlob) {
      errorMsg.value = 'failed to fetch data from cache';
      return reject();
    }

    const resolved = await createFile(dataBlob)
    .then(() => true)
    .catch(() => (errorMsg.value = 'failed to push data to a file', false));
    resolved ? resolve(void 0) : reject();
  })
  .then(() => {
    window.location.href = '/';  
  });
  messaging.loading = false;
}

</script>
