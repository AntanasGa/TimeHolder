<template>
  <Modal :onCancel="() => (isDirty() ? (selectedMenu = ModalConfirm.Exit) : confirmProceed())">
    <div class="relative flex flex-col rounded-md drop-shadow-md backdrop-blur-sm bg-white dark:bg-stone-800 p-2 gap-2 max-w-[18rem]">
      <div v-if="isWorking" class="absolute loadbar h-1 top-0 left-0 right-0 rounded-full"></div>
      <div class="flex gap-2 justify-between">
        <h1 class="font-bold text-2xl mb-2">{{ id < 0 ? "New entity" : `Edit entity ${entity.taskId.value}` }}</h1>
        <Transition name="slide-in-right">
          <StyledButton v-if="id > -1" @click="() => selectedMenu = ModalConfirm.Delete" title="Remove entry">
            <TrashIcon class="w-6 h-6" title="delete entry" />
          </StyledButton>
        </Transition>
      </div>
      <div class="flex flex-col gap-4 mb-4 max-w-[inherit]">
        <div class="flex gap-2 flex-row max-w-[inherit]">
          <SearchableSelect name="EntryTaskIndex"
            title="Entry Task"
            default-value="No task selected"
            :selection="cache.task?.map(x => x.taskName)"
            :modelValue="cache.task?.findIndex((x) => x.id === entity.taskId.value) ?? -1"
            @update:modelValue="(v) => entity.taskId.value = cache.task?.[v ?? -1]?.id ?? -1"
            class="grow shring basis-0 min-w-0"
            keepUp
          />
          <Transition name="slide-in-right">
            <RouterLink v-if="entity.taskId.value > -1"
              class="p-2"
              :to="entity.taskId.value > -1 ? {name: 'Task', params: { id: entity.taskId.value } } : {}"
              title="Edit task"
            >
              <LinkIcon class="w-5 h-5" />
            </RouterLink>
          </Transition>
        </div>
        <div class="flex gap-2">
          <StyledInput v-model="startDateDate" type="date" name="StartDate" title="Start date" class="grow shrink basis-0 min-w-0" keepUp />
          <StyledInput v-model="startDateTime" type="time" name="StartTime" title="Start time" class="grow shrink basis-0 min-w-0" keepUp />
        </div>
        <div class="flex gap-2">
          <StyledInput v-model="endDateDate" type="date" name="EndDate" title="End date" class="grow shrink basis-0 min-w-0" keepUp  />
          <StyledInput v-model="endDateTime" type="time" name="EndTime" title="End time" class="grow shrink basis-0 min-w-0" keepUp />
        </div>
        <StyledInput v-model="entity.comment!.value" type="area" name="Comment" title="Comment" />
      </div>
      <div class="flex gap-2">
          <StyledButton :class="[
            'col flex-1',
            isDirty()
              ? 'text-white dark:text-black bg-zinc-900 dark:bg-stone-100 hover:bg-zinc-800 dark:hover:bg-stone-300 dark:active:bg-stone-200 active:bg-zinc-700'
              : 'text-inherit bg-zinc-50 dark:bg-stone-900 hover:bg-zinc-100 dark:hover:bg-stone-700 active:bg-zinc-200 dark:active:bg-stone-600',
            ].join(' ')"
            :disabled="!isDirty()"
            @click="() => isDirty() && toInitial()"
          >Reset</StyledButton>
          <StyledButton :class="[
            'col flex-1',
            isDirty()
              ? 'text-white bg-red-400 hover:bg-red-500 active:bg-red-600 dark:bg-red-800 dark:hover:bg-red-600 dark:active:bg-red-700'
              : 'text-inherit bg-zinc-50 dark:bg-stone-900 hover:bg-zinc-100 dark:hover:bg-stone-700 active:bg-zinc-200 dark:active:bg-stone-600',
            ].join(' ')"
            :disabled="!isDirty()"
            @click="() => isDirty() && onSave()"
          >Save</StyledButton>
        </div>
    </div>
    <Modal v-if="selectedMenu !== ModalConfirm.None" :onCancel="(() => (selectedMenu = ModalConfirm.None))">
      <div class="relative flex flex-col rounded-md drop-shadow-md backdrop-blur-sm bg-white dark:bg-stone-800 p-2 gap-8 max-w-[18rem]">
        <h1 class="font-bold text-xl mb-2">
          <template v-if="selectedMenu === ModalConfirm.Exit">There are unsaved changes, are you sure you want to leave</template>
          <template v-if="selectedMenu === ModalConfirm.Delete">Are you sure you want to remove this entry</template>
        </h1>
        <div class="flex flex-col gap-2">
          <StyledButton class="col flex-1 text-white dark:text-black bg-zinc-900 dark:bg-stone-100 hover:bg-zinc-800 dark:hover:bg-stone-300 dark:active:bg-stone-200 active:bg-zinc-700"
            @click="() => selectedMenu = ModalConfirm.None"
          >No</StyledButton>
          <StyledButton class="col flex-1 text-white bg-red-400 hover:bg-red-500 active:bg-red-600 dark:bg-red-800 dark:hover:bg-red-600 dark:active:bg-red-700"
            @click="confirmProceed"
          >Yes</StyledButton>
        </div>
      </div>
    </Modal>
  </Modal>
</template>

<script setup lang="ts">
import { DBContext } from '@/components/DatabaseContext.vue';
import Modal from '@/components/Modal.vue'
import { SearchableSelect, StyledButton, StyledInput } from '@/components/formFunctions/index';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { IEntity, IndexedItem } from '@/stores/documents';
import { clearSeconds, useDateInputs } from '@/util/DateInputs';
import { FormResponse, RefObject, useForm, ModalConfirm } from '@/util/Form';
import { LinkIcon, TrashIcon } from '@/components/Icons/index';
import { WritableComputedRef, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const entityActions = inject<DBContext["entity"]>("entity");
const cache = useDBCacheStore();

const selectedTask = ref(isNaN(+(route.query["taskId"] ?? "-1")) ? -1 : +(route.query["taskId"] ?? "-1"));
const id = ref("id" in route.params ? +route.params.id : -1);

type newOrExistingEntity = IEntity | Omit<IEntity, keyof IndexedItem>

const isWorking = ref(false);

const selectedMenu = ref<ModalConfirm>(ModalConfirm.None);

let entity: RefObject<newOrExistingEntity>;
let isDirty: FormResponse<newOrExistingEntity>["isDirty"];
let reset: FormResponse<newOrExistingEntity>["reset"];
let toInitial: FormResponse<newOrExistingEntity>["toInitial"];
let startDateDate: WritableComputedRef<string>;
let startDateTime: WritableComputedRef<string>;
let endDateDate: WritableComputedRef<string>;
let endDateTime: WritableComputedRef<string>;

const initializeForm = (entityItem: newOrExistingEntity) => {
  const form = useForm({...entityItem});
  entity = form.values;
  isDirty = form.isDirty;
  reset = form.reset;
  toInitial = form.toInitial;

  const startd = 'id' in entity ? new Date(entity.startTime.value) : new Date();
  clearSeconds(startd);
  form.values.startTime.value = startd.valueOf();
  [startDateDate, startDateTime] = useDateInputs(entity.startTime, !('id' in entity));

  const endd = 'id' in entity && entity.endTime?.value ? new Date(entity.endTime.value) : undefined;
  endd && clearSeconds(endd);
  entity.endTime!.value = endd?.valueOf();
  [endDateDate, endDateTime] = useDateInputs(entity.endTime!, false);
}

function confirmProceed() {
  if (selectedMenu.value === ModalConfirm.Delete && id.value > -1 && "id" in entity) {
    entityActions?.remove(entity.id.value);
  }
  selectedMenu.value = ModalConfirm.None;
  router.push('/entities');
}

function onSave() {
  if (!entity || entity.taskId.value == -1) {
    return;
  }
  isWorking.value = true;
  const values = Object.entries(entity).reduce((acc, [k, v]) => ({...acc, [k]: v?.value}), {} as newOrExistingEntity);
  if ('id' in values) {
    entityActions?.update(values.id, values).then((res) => {
      reset(res);

    })
    .finally(() => {
      isWorking.value = false;
    });
  } else {
    entityActions?.add(values).then((res) => {
      router.replace({ name: "Entity", params: { id: res.id } });
      reset(res);
      id.value = res.id;
    }).finally(() => {
      isWorking.value = false;
    })
  }
}

if (id.value < 0) {
  const startDate = new Date();
  clearSeconds(startDate);
  initializeForm({taskId: selectedTask.value, comment: "", startTime: startDate.valueOf(), endTime: undefined});
} else {
  const tmpTask = cache.entity?.find((x) => x.id === id.value);
  if (!tmpTask) {
    confirmProceed();
  } else {
    initializeForm(tmpTask);
  }
}
</script>

<style>
.slide-in-right-leave-active,
.slide-in-right-enter-active {
  transition: all 0.10s ease-in;
}

.slide-in-right-leave-to,
.slide-in-right-enter-from {
  opacity: 0;
  transform: translateX(2em);
}
</style>
