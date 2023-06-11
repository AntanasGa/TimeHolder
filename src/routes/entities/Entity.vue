<template>
  <Modal :onCancel="onCancel">
    <div class="relative flex flex-col rounded-md drop-shadow-md backdrop-blur-sm bg-white p-2 gap-2">
      <div v-if="isWorking" class="absolute loadbar h-1 top-0 left-0 right-0 rounded-full"></div>
      <h1 class="font-bold text-2xl mb-2">{{ id < 0 ? "New entity" : `Edit entity ${entity.taskId.value}` }}</h1>
      <div class="flex flex-col gap-4 mb-4">
        <div class="flex gap-2">
          <SearchableSelect name="TaskIndex"
            title="Task"
            :selection="cache.task?.map(x => x.taskName)"
            :modelValue="cache.task?.findIndex((x) => x.id === entity.taskId.value) ?? -1"
            @update:modelValue="(v) => entity.taskId.value = cache.task?.[v ?? -1]?.id ?? -1" />
          <RouterLink :class="[
              'p-2 transition-all',
              typeof entity.taskId.value === 'undefined' || entity.taskId.value === -1
                ? 'absolute w-0 opacity-0 pointer-events-none'
                : 'static w-9 opacity-100',
            ]"
            :to="entity.taskId.value > -1 ? {name: 'Task', params: { id: entity.taskId.value } } : {}"
          ><LinkIcon class="w-5 h-5" /></RouterLink>

        </div>
        <div class="flex gap-2">
          <StyledInput v-model="startDateDate" type="date" name="StartDate" title="Start date" keepUp />
          <StyledInput v-model="startDateTime" type="time" name="StartTime" title="Start time" keepUp />
        </div>
        <div class="flex gap-2">
          <StyledInput v-model="endDateDate" type="date" name="EndDate" title="End date" keepUp />
          <StyledInput v-model="endDateTime" type="time" name="EndTime" title="End time" keepUp />
        </div>
        <StyledInput v-model="entity.comment!.value" type="area" name="Comment" title="Comment" />
      </div>
      <div class="flex gap-2">
            <StyledButton :class="[
              'col flex-1',
              isDirty()
                ? 'text-white bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700'
                : 'text-inherit bg-zinc-50 hover:bg-zinc-100 active-bg-zinc-200',
              ].join(' ')"
              :disabled="!isDirty()"
              @click="() => isDirty() && toInitial()"
            >Reset</StyledButton>
            <StyledButton :class="[
              'col flex-1',
              isDirty()
                ? 'text-white bg-red-400 hover:bg-red-500 active:bg-red-600'
                : 'text-inherit bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200',
              ].join(' ')"
              :disabled="!isDirty()"
              @click="() => isDirty() && onSave()"
            >Save</StyledButton>
          </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { DBContext } from '@/components/DatabaseContext.vue';
import Modal from '@/components/Modal.vue'
import SearchableSelect from '@/components/formFunctions/SearchableSelect.vue';
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import StyledInput from '@/components/formFunctions/StyledInput.vue';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { IEntity, IndexedItem } from '@/stores/documents';
import { clearSeconds, useDateInputs } from '@/util/DateInputs';
import { FormResponse, RefObject, useForm } from '@/util/Form';
import { LinkIcon } from '@heroicons/vue/24/solid';
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
  [startDateDate, startDateTime] = useDateInputs(entity.startTime);

  const endd = 'id' in entity && entity.endTime?.value ? new Date(entity.endTime.value) : undefined;
  endd && clearSeconds(endd);
  entity.endTime!.value = endd?.valueOf();
  [endDateDate, endDateTime] = useDateInputs(entity.endTime!, false);
}

function onCancel() {
  const confirm = isDirty() ? window.confirm("There are unsaved changes, are you sure you want to leave") : true;
  if (!confirm) {
    return;
  }
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
    onCancel();
  } else {
    initializeForm(tmpTask);

  }
}
</script>
