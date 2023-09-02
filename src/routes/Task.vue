<template>
  <Modal :onCancel="() => isDirty() ? (selectedMenu = ModalConfirm.Exit) : confirmProceed()">
    <div class="relative flex flex-col rounded-md drop-shadow-md backdrop-blur-sm bg-white dark:bg-stone-800 p-2 gap-2 max-w-[18rem]">
        <div v-if="isWorking" class="absolute loadbar h-1 top-0 left-0 right-0 rounded-full"></div>
        <h1 class="font-bold text-2xl mb-2 text-ellipsis overflow-hidden max-w-xs whitespace-nowrap">{{ id < 0 ? "New task" : `Edit task ${task.taskName.value}` }}</h1>
        <div class="flex flex-col gap-4 mb-4">
          <StyledInput v-model="task.taskName.value" :name="'taskName'" :title="'Task name'" className="text-ellipsis" />
          <div class="flex gap-2 items-center">
            <StyledInput v-model="task.taskLink.value" :name="'taskLink'" :title="'Task link'" class="grow w-full" className="text-ellipsis" />
            <Transition name="slide-in-right">
              <a v-if="id !== -1"
                class="p-2 shrink"
                :href="id > -1 ? task.taskLink.value : ''"
                rel="noopener noreferrer"
                target="_blank"
                title="Task registration link (external)"
              >
                <LinkIcon class="w-5 h-5" />
              </a>
            </Transition>
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
        <div v-if="id > -1" class="flex justify-between">
          <RouterLink class="flex gap-1" :to="{name: 'Entities', query: { taskId: id }}" title="View entries with filtered task">Entries <LinkIcon class="w-3 h-3" /></RouterLink>
          <RouterLink class="flex gap-1" :to="{name: 'NewEntity', query: { taskId: id } }" title="Create entry for task">Register Time <LinkIcon class="w-3 h-3" /></RouterLink>
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
import Modal from '@/components/Modal.vue';
import { StyledButton, StyledInput } from '@/components/formFunctions/index';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { IEntity, ITask, IndexedItem } from '@/stores/documents';
import { useForm, FormResponse, RefObject, ModalConfirm } from '@/util/Form';
import { LinkIcon } from '@/components/Icons/index';
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
const selectedMenu = ref<ModalConfirm>(ModalConfirm.None);

const isWorking = ref(false);

const taskActions = inject<DBContext["task"]>("task");

const initializeForm = (taskItem: newOrExistingTask) => {
  const form = useForm({...taskItem});
  task = form.values;
  isDirty = form.isDirty;
  reset = form.reset;
  toInitial = form.toInitial;
}

function confirmProceed() {
  selectedMenu.value = ModalConfirm.None;
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
    confirmProceed();
  } else {
    initializeForm(tmpTask);
    entries.value = cache.entity?.filter(x => x.taskId === id.value);
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
