<template>
  <div class="sticky flex top-0 w-full z-[1] bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="container mx-auto mb-10 mt-5">
      <h1 class="font-bold text-6xl">Settings</h1>
    </div>
  </div>
  <section class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
    <div class="rounded-md drop-shadow-md backdrop-blur-sm w-full flex flex-col gap-2 p-2 items-center transition-all">
      <h2 class="font-bold text-3xl">Theme</h2>
      <ThemeSelector class="mt-auto" />
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
      <div class="mt-auto">
        <StyledButton title="Export data to local file" class="bg-zinc-100 dark:bg-stone-800 hover:bg-zinc-200 dark:hover:bg-stone-700" @click="exportData">
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
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@/components/Icons/index';
import { inject, ref } from 'vue';
import { CacheTypes } from '@/stores/documents';
import { DBContext } from '@/components/DatabaseContext.vue';
import { ToastStatus, useMessagingStore } from '@/stores/MessagingStore';
import { createCacheBlob, createFile } from '@/util/DataHandling';

const cache = useDBCacheStore();
const db = useIndexedDbStore();
const toasts = useMessagingStore();

const taskActions = inject<DBContext["task"]>("task");
const entityActions = inject<DBContext["entity"]>("entity");

const overwrite = ref(false);

async function exportData() {
  toasts.loading = true;
  createFile(await createCacheBlob(cache.entireCache),
    `task-export-${new Date().valueOf()}.json`
  )
  .finally(() => toasts.loading = false);
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
    if (e?.files?.length !== 1 || e.files?.[0].type != 'application/json' || !entityActions || !taskActions) {
      return reject();
    }

    const baseToast = {title: "Import"};

    const file = e.files[0];
    let imports: Partial<CacheTypes> | null = null;

    try {
      imports = JSON.parse(await file.text());
    } catch (e) {
      toasts.addToast({
        ...baseToast,
        status: ToastStatus.Error,
        message: "Converting from JSON failed",
      });
      return reject();
    }

    if (!imports) {
      toasts.addToast({
        ...baseToast,
        status: ToastStatus.Error,
        message: "No data was present",
      });
      return reject();
    }

    const requiredKeys: (keyof CacheTypes)[] = ['entity', 'task'];
    if (Object.keys(imports).length !== requiredKeys.length
      || !Object.keys(imports).every((x) => (requiredKeys as string[]).includes(x))
    ) {
      console.log('preflight failed');
      toasts.addToast({
        ...baseToast,
        status: ToastStatus.Error,
        message: "Preflight checks have failed, check your file",
      })
      return reject();
    }
    db.busy = prevBusy;

    let anyFailed = false;
    
    let promises: Promise<void>[] = [];
    if (overwrite.value) {
      const entityIdList = cache.entity?.map(x => x.id) ?? [];
      for (const id of entityIdList) {
        promises.push(db.remove('entity', id)
          .catch(err => {
            console.error("remove entity", err, id);
            anyFailed = true;
          })
        );
      }
      await Promise.all(promises);

      promises = [];
      const taskIdList = cache.task?.map(x => x.id) ?? [];
      for (const id of taskIdList) {
        promises.push(db.remove('task', id)
          .catch(err => {
            console.error("remove task", err, id);
            anyFailed = true;
          })
        );
      }
      await Promise.all(promises);
      promises = [];
    } else {
      const taskMap: [number, number][] = [];
      let currentMax = cache.task?.reduce((max, cv) => max < cv.id ? cv.id : max, -1) ?? -1;
      if (currentMax > -1) {
        imports.task = imports.task?.sort((a, b) => a.id - b.id)
          .map(x => (currentMax++, taskMap.push([x.id, currentMax]), {...x, id: currentMax}))
          ?? [];
        
        currentMax = cache.entity?.reduce((max, cv) => max < cv.id ? cv.id : max, -1) ?? -1;
        if (currentMax > -1) {
          imports.entity = imports.entity?.sort((a, b) => a.id - b.id)
            .map(x => (currentMax++, {...x, id: currentMax}))
            ?? [];
        }
        const mapped: Record<number, number> = taskMap.reduce((acc, [k, v]) => ({...acc, [k]: v}), {});
        imports.entity = imports.entity?.map((x) => ({...x, taskId: mapped[x.taskId] ?? -1})).filter(({taskId}) => taskId > -1) ?? [];
      }
    }

    
    for (const task of imports.task ?? []) {
      promises.push(db.update('task', task)
        .catch(err => {
          console.error("update task", err, task);
          anyFailed = true;
        })
      );
    }
    await Promise.all(promises);

    promises = [];
    for (const entity of imports.entity ?? []) {
      promises.push(db.update('entity', entity)
        .catch(err => {
          console.error("update entity", err, entity);
          anyFailed = true;
        })
      );
    }
    await Promise.all(promises);

    cache.task = await (db.fetch('task')
      .catch(err => {
        console.error("fetch task", err);
        anyFailed = true;
        return [];
      })
    );
    
    cache.entity = await (db.fetch('entity').catch(err => {
      console.error("fetch entity", err);
      anyFailed = true;
      return [];
    }));

    toasts.addToast({
      ...baseToast,
      status: anyFailed ? ToastStatus.Warn : ToastStatus.Success,
      message: anyFailed ? "Some procedures failed, please check console for more details" : "All procedures completed successfully",
    });
    resolve(undefined);
  })
  .catch(() => {})
  .finally(() => db.busy = prevBusy);
}

</script>
