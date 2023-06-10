<template>
  <Modal :onCancel="onCancel">
    <div class="relative rounded-md drop-shadow-md backdrop-blur-sm bg-white p-2">
        <div v-if="isWorking" class="absolute loadbar h-1 top-0 left-0 right-0 rounded-full"></div>
        <h1 class="font-bold text-2xl mb-2">{{ id < 0 ? "New task" : `Edit task ${task.taskName.value}` }}</h1>
        <div class="flex flex-col gap-4 mb-4">
          <StyledInput v-model="task.taskName.value" :name="'taskName'" :title="'Task name'" />
          <StyledInput v-model="task.taskLink.value" :name="'taskLink'" :title="'Task link'" />
          <div class="flex gap-2">
            <StyledButton :class="[
              'col flex-1',
              isDirty()
                ? 'text-white bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700'
                : 'text-inherit bg-zinc-50 hover:bg-zinc-100 active-bg-zinc-200',
              ].join(' ')"
              @click="() => isDirty() && toInitial()"
            >Reset</StyledButton>
            <StyledButton :class="[
              'col flex-1',
              isDirty()
                ? 'text-white bg-red-400 hover:bg-red-500 active:bg-red-600'
                : 'text-inherit bg-zinc-50 hover:bg-zinc-100 active-bg-zinc-200',
              ].join(' ')"
              @click="() => isDirty() && onSave()"
            >Save</StyledButton>
          </div>
        </div>
        <a v-if="id > -1" class="flex gap-1" :href="task.taskLink.value" rel="noopener noreferrer" target="_blank">To task <LinkIcon class="w-3 h-3" /></a>
      </div>
  </Modal>
</template>

<script setup lang="ts">
import { DBContext } from '@/components/DatabaseContext.vue';
import Modal from '@/components/Modal.vue';
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import StyledInput from '@/components/formFunctions/StyledInput.vue';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { IEntity, ITask, IndexedItem } from '@/stores/documents';
import { useForm, FormResponse, RefObject } from '@/util/Form';
import { LinkIcon } from '@heroicons/vue/24/solid';
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();

const cache = useDBCacheStore();

const id = ref("id" in route.params ? +route.params.id : -1);
type newOrExistingTask = ITask | Omit<ITask, keyof IndexedItem>;
let task: RefObject<newOrExistingTask>;
let isDirty: FormResponse<newOrExistingTask>["isDirty"];
let reset: FormResponse<newOrExistingTask>["reset"];
let toInitial: FormResponse<newOrExistingTask>["toInitial"];

const entries = ref<IEntity[]>();

const isWorking = ref(false);

const taskActions = inject<DBContext["task"]>("task");

const initializeForm = (taskItem: newOrExistingTask) => {
  const form = useForm({...taskItem});
  task = form.values;
  isDirty = form.isDirty;
  reset = form.reset;
  toInitial = form.toInitial;
}

function onCancel() {
  console.log("on cancel triggered");
  const confirm = isDirty() ? window.confirm("There are unsaved changes, are you sure you want to leave") : true;
  if (!confirm) {
    return;
  }
  router.push('/tasks');  
}



function onSave() {
  isWorking.value = true;
  const values = {} as newOrExistingTask;
  let i: keyof newOrExistingTask;
  for (i in task) {
    values[i] = task[i].value;
  }
  if ('id' in values) {
    taskActions?.update(values.id, values).then((res) => {
      reset(res);
    })
    .finally(() => {
      isWorking.value = false;
    });
  } else {
    taskActions?.add(values).then((res) => {
      const taskRoute = `/tasks/${res.id}`;
      router.replace(taskRoute);
      reset(res);
      id.value = res.id;
    }).finally(() => {
      isWorking.value = false;
    })
  }
}

if (id.value < 0) {
  initializeForm({taskLink: "", taskName: ""});
} else {
  const tmpTask = cache.task?.find((x) => x.id === id.value);
  if (!tmpTask) {
    onCancel();
  } else {
    initializeForm(tmpTask);
    entries.value = cache.entity?.filter(x => x.taskId === id.value);
  }
}

</script>
