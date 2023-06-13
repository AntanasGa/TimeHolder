<template>
    <div class="sticky flex flex-col top-0 w-full z-[1] bg-white/50 backdrop-blur-md">
    <div class="flex flex-col container mx-auto mb-10 mt-5 gap-4 flex-wrap">
      <h1 class="font-bold text-6xl">Entities</h1>
      <div class="flex flex-col">
        <div>
          <StyledButton :class="[
              'relative flex items-center gap-1 z-10',
              showFilters
                ? 'bg-red-200 hover:bg-red-300'
                : 'bg-zinc-100 hover:bg-zinc-200'
            ].join(' ')"
            @click="() => showFilters = !showFilters"
          >
          <h3 class="font-bold text-lg">Filters</h3>
          <ChevronDownIcon :class="['w-4 h-4 transition-all', showFilters ? 'scale-y-100' : '-scale-y-100']" />
        </StyledButton>
        </div>
        <div :class="[
          'flex flex-col w-full bg-stone-100 rounded-md transition-all gap-2',
          ...(showFilters ? ['px-4 pt-12 pb-4 h-full -translate-y-10'] : ['h-0 px-4 pt-0 pb-0 -translate-y-100 pointer-events-none opacity-0'])
        ]">
          <SearchableSelect name="TaskIndex"
            title="Task"
            :selection="cache.task?.map(x => x.taskName)"
            :modelValue="cache.task?.findIndex((x) => x.id === selectedTask) ?? -1"
            @update:modelValue="(v) => selectedTask = cache.task?.[v ?? -1]?.id ?? -1" />
            <div class="flex flex-nowrap w-full justify-around gap-2">
              <StyledInput type="date" title="Start date" class="w-full" name="FilterStartDateDate" v-model="startDateDate" keepUp />
              <StyledInput type="time" title="Start time" class="w-full" name="FilterStartDateTime" v-model="startDateTime" keepUp />
              <StyledButton class="bg-zinc-50 hover:bg-zinc-100" @click="() => (startDate = undefined, router.replace({ query: getQuery() }))"><XMarkIcon class="w-8 h-8" /></StyledButton>
            </div>
            <div class="flex flex-nowrap w-full justify-around gap-2">
              <StyledInput type="date" title="End Date" class="w-full" name="FilterEndDateDate" v-model="endDateDate" keepUp />
              <StyledInput type="time" title="End Date" class="w-full" name="FilterEndDateTime" v-model="endDateTime" keepUp />
              <StyledButton class="bg-zinc-50 hover:bg-zinc-100" @click="() => (endDate = undefined, router.replace({ query: getQuery() }))"><XMarkIcon class="w-8 h-8" /></StyledButton>
            </div>
            <div class="flex gap-2">
              <input type="checkbox" id="groupTasksSelector" v-model="groupBy" @change="() => router.replace({ query: getQuery() })">
              <label for="groupTasksSelector">Group by task</label>
            </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto overflow-x-auto">
    <table class="w-full table-auto">
      <thead>
        <tr class="bg-zinc-200">
          <th>ID</th>
          <th>Task</th>
          <th>Comment</th>
          <th>Start</th>
          <th>End</th>
          <th>Diff</th>
          <th>Actions</th>
        </tr>
        <tr>
          <th colspan="7">
            <RouterLink :to="{ name: 'NewEntity' }" class="flex place-content-between m-1 rounded-md text-white drop-shadow-md backdrop-blur-sm p-2 items-center group bg-gradient-to-r newButton from-red-600 via-red-300 to-red-600 bg-left-top hover:bg-center transition-all">
              <span>New</span>
              <PlusIcon class="w-8 h-8 text-white"/>
            </RouterLink>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!cache.entitesWithTasks || !cache.entitesWithTasks.length">
          <td colspan="7" class="text-2xl text-center">No entities present</td>
        </tr>
        <tr v-else v-for="entity in entities" :key="entity.id">
          <td>{{ entity.id }}</td>
          <td>{{ entity.task.taskName }}</td>
          <td>{{ entity.comment }}</td>
          <td>{{  entity.startTime ? dateFormat.format(new Date(entity.startTime)) : "-" }}</td>
          <td>{{ (entity.startTime && entity.endTime && dateFormat.format(new Date(entity.endTime))) || "-" }}</td>
          <td>{{ (entity.endTime && difFormat.format(new Date(entity.endTime - entity.startTime))) || '-' }}</td>
          <td><template v-if="entity.startTime"><RouterLink :to="{ name: 'Entity', params: { id: entity.id } }"><PencilIcon class="h-4 w-4" /></RouterLink></template></td>
        </tr>
      </tbody>
    </table>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDownIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import SearchableSelect from '@/components/formFunctions/SearchableSelect.vue';
import StyledInput from '@/components/formFunctions/StyledInput.vue';
import { useDateInputs } from '@/util/DateInputs';

const dateFormat = new Intl.DateTimeFormat(navigator.language, { timeZone: "UTC", year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
const difFormat = new Intl.DateTimeFormat('en-GB', { timeZone: "UTC", hour: 'numeric', minute: '2-digit'});

const route = useRoute();
const router = useRouter();
const cache = useDBCacheStore();

const {start, end, groupByTask} = route.query;
const startDate = ref<number | undefined>(start ? +start : undefined);
const endDate = ref<number | undefined>(end ? +end : undefined);
const groupBy = ref<boolean>(groupByTask !== undefined && groupByTask !== null);
const getQuery = ({ taskId }: { taskId: number } = { taskId: selectedTask.value }) => {
  return { taskId: taskId > -1 ? taskId : undefined, start: startDate.value, end: endDate.value, groupByTask: (groupBy.value && 1 ) || undefined };
}

const selectedTask = computed({
  get() {
    return +(route.query["taskId"] ?? -1);
  },
  set(v) {
    router.replace({ name: "Entities", query: getQuery({ taskId: v }) })
  }
});
const showFilters = ref(typeof selectedTask.value !== 'undefined');

const [endDateDate, endDateTime] = useDateInputs(endDate, false, () => router.replace({ query: getQuery() }));
const [startDateDate, startDateTime] = useDateInputs(startDate, false, () => router.replace({ query: getQuery() }));


const entities = computed(() => {
  let filtered = cache.entitesWithTasks?.filter(x => (selectedTask.value === -1 || x.taskId === selectedTask.value)
  && (!startDate.value || startDate.value <= x.startTime)
  && (!endDate.value || endDate.value > (x.endTime ?? endDate.value))
  )
  if (!groupBy.value) {
    return filtered;
  }
  return Object.values(filtered?.reduce((acc, { taskId, endTime, startTime, task}) => ({ ...acc, [taskId]: { id: taskId, startTime: 0, endTime: (acc[taskId]?.endTime ?? 0) + (endTime ? endTime - startTime : 0 ), task, taskId  } }), {} as Record<string, typeof filtered[0]>) ?? {});
});
</script>
