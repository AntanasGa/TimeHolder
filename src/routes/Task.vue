<template>
  <Modal :onCancel="onCancel">
    <div class="rounded-md drop-shadow-md backdrop-blur-sm bg-white p-2">
      <h1 class="bold text-2xl">{{ id < 0 ? "New task" : `Edit task ${task.taskName.value}` }}</h1>
      <input type="string" v-model="task.taskName.value">
      <input type="string" v-model="task.taskLink.value">
      <a v-if="id > -1" class="flex gap-1" :href="task.taskLink.value">To task <LinkIcon class="w-3 h-3" /></a>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { DBContext } from '@/components/DatabaseContext.vue';
import Modal from '@/components/Modal.vue';
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

let task: RefObject<ITask | Omit<ITask, keyof IndexedItem>>;
let isDirty: FormResponse<ITask | Omit<ITask, keyof IndexedItem>>["isDirty"];
let reset: FormResponse<ITask | Omit<ITask, keyof IndexedItem>>["reset"];

const entries = ref<IEntity[]>();

const taskActions = inject<DBContext["task"]>("task");

const initializeForm = (taskItem: ITask | Omit<ITask, keyof IndexedItem>) => {
  const form = useForm({...taskItem});
  task = form.values;
  isDirty = form.isDirty;
  reset = form.isDirty;
}

function onCancel() {
  router.push('/tasks');  
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
