<template>
  <div class="sticky flex top-0 w-full z-[1] bg-white/50 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-900 dark:to-white/10 backdrop-blur-md transition-all">
    <div class="flex flex-col container mx-auto mb-10 mt-5 gap-4 flex-wrap">
    <div class="flex">
      <h1 class="font-bold text-6xl grow">Entities</h1>
      <h1 v-if="groupBy" class="font-bold text-6xl shrink">{{ difFormat.format(entities?.reduce((acc, { endTime: et }) => acc += (et ?? 0), 0)) }}</h1>
    </div>
    <div class="flex flex-col">
      <div>
        <StyledButton :class="[
            'relative flex items-center gap-1 z-10',
            showFilters
              ? 'bg-red-200 dark:bg-red-700 hover:bg-red-300 dark:hover:bg-red-600'
              : 'bg-zinc-100 dark:bg-stone-900 hover:bg-zinc-200 dark:hover:bg-stone-700'
          ].join(' ')"
          @click="() => showFilters = !showFilters"
        >
        <h3 class="font-bold text-lg">Filters</h3>
        <ChevronDownIcon :class="['w-4 h-4 transition-all', showFilters ? 'scale-y-100' : '-scale-y-100']" />
      </StyledButton>
      </div>
      <div :class="[
        'flex flex-col w-full bg-stone-100 dark:bg-stone-900 dark:bg-gradient-to-t dark:from-stone-800 dark:to-stone-700 rounded-md transition-all gap-2',
        ...(showFilters ? ['px-4 pt-12 pb-4 h-full -translate-y-10'] : ['h-0 px-4 pt-0 pb-0 -translate-y-100 pointer-events-none opacity-0'])
      ]">
        <SearchableSelect name="TaskIndex"
          title="Task"
          :selection="cache.task?.map(x => x.taskName)"
          :modelValue="cache.task?.findIndex((x) => x.id === selectedTask) ?? -1"
          @update:modelValue="(v) => selectedTask = cache.task?.[v ?? -1]?.id ?? -1"
          class="mb-4"
        />
        <div class="flex flex-nowrap w-full justify-around gap-2">
          <StyledInput type="date" title="Start date" class="w-full" name="FilterStartDateDate" v-model="startDateDate" keepUp />
          <StyledInput type="time" title="Start time" class="w-full" name="FilterStartDateTime" v-model="startDateTime" keepUp />
          <Transition name="reset-time">
            <StyledButton v-if="startDate"
              class="bg-zinc-50 dark:bg-stone-900 hover:bg-zinc-100 dark:hover:bg-stone-600 w-12"
              @click="() => (startDate = undefined, router.replace({ query: getQuery() }))"
            >
              <XMarkIcon class="w-8 h-8" />
            </StyledButton>
          </Transition>
        </div>
        <div class="flex flex-nowrap w-full justify-around gap-2">
          <StyledInput type="date" title="End Date" class="w-full" name="FilterEndDateDate" v-model="endDateDate" keepUp />
          <StyledInput type="time" title="End Date" class="w-full" name="FilterEndDateTime" v-model="endDateTime" keepUp />
          <Transition name="reset-time">
            <StyledButton v-if="endDate"
              class="bg-zinc-50 dark:bg-stone-900 hover:bg-zinc-100 dark:hover:bg-stone-600 w-12"
              @click="() => (endDate = undefined, router.replace({ query: getQuery() }))"
            >
              <XMarkIcon class="w-8 h-8" />
            </StyledButton>
          </Transition>
        </div>
        <div class="flex gap-2 mb-4">
          <StyledButton class="flex gap-2 items-center"
            @click="onToday"
          >
            <CalendarIcon class="w-8 h-8" />
            Today
          </StyledButton>
          <Transition name="reset-activity">
            <StyledButton v-if="startDate || endDate"
              class="flex gap-2 items-center"
              @click="() => (startDate = undefined, endDate = undefined, router.replace({ query: getQuery()}))"
            >
              <ArrowPathIcon class="w-8 h-8" />
              Reset
            </StyledButton>
          </Transition>
        </div>
        <div class="flex gap-2">
          <input type="checkbox" id="groupTasksSelector" v-model="groupBy" @change="() => router.replace({ query: getQuery() })">
          <label for="groupTasksSelector">Group by task</label>
        </div>
      </div>
    </div>
    </div>
  </div>
  <section class="container mx-auto overflow-x-auto mt-5">
    <table class="w-full table-auto">
      <thead>
        <tr class="bg-zinc-200 dark:bg-stone-800">
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
          <td>
            <div class="flex">
              <span>{{ entity.id }}</span>
              <RouterLink class="ml-2 w-5 opacity-100"
              :to="{name: 'Task', params: { id: entity.taskId }}"
              ><LinkIcon class="w-5 h-5" /></RouterLink>
            </div>
          </td>
          <td class="inline">
            <div class="flex">
              <span>{{ entity.task.taskName }}</span>
              <a class="ml-2 w-5 opacity-100"
                :href="entity.task.taskLink"
                rel="noopener noreferrer"
                target="_blank"
              ><LinkIcon class="w-5 h-5" /></a>
            </div>
          </td>
          <td>{{ entity.comment }}</td>
          <td>{{  !groupBy ? dateFormat.format(new Date(entity.startTime)) : "-" }}</td>
          <td>{{ (!groupBy && entity.endTime && dateFormat.format(new Date(entity.endTime))) || "-" }}</td>
          <td>{{ (entity.endTime && difFormat.format(new Date(entity.endTime - entity.startTime))) || '-' }}</td>
          <td><template v-if="!groupBy"><RouterLink :to="{ name: 'Entity', params: { id: entity.id } }"><PencilIcon class="h-4 w-4" /></RouterLink></template></td>
        </tr>
      </tbody>
    </table>
  </section>
  <RouterView />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowPathIcon, CalendarIcon, ChevronDownIcon, LinkIcon, PencilIcon, PlusIcon, XMarkIcon } from '@/components/Icons/index';
import StyledButton from '@/components/formFunctions/StyledButton.vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { SearchableSelect, StyledInput } from '@/components/formFunctions/index';
import { clearSeconds, convertToUtc, useDateInputs } from '@/util/DateInputs';

const dateFormat = new Intl.DateTimeFormat(navigator.language, { timeZone: "UTC", year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'});
const difFormat = new Intl.DateTimeFormat('en-GB', { timeZone: "UTC", hour: 'numeric', minute: '2-digit'});

const route = useRoute();
const router = useRouter();
const cache = useDBCacheStore();

const {start, end, groupByTask} = route.query;
const startDate = ref<number | undefined>(start && !isNaN(+start) ? +start : undefined);
const endDate = ref<number | undefined>(end && !isNaN(+end) ? +end : undefined);
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
const showFilters = ref(selectedTask.value > -1 || !!startDate.value || !!endDate.value);

const [endDateDate, endDateTime] = useDateInputs(endDate, false, () => router.replace({ query: getQuery() }));
const [startDateDate, startDateTime] = useDateInputs(startDate, false, () => router.replace({ query: getQuery() }));



const onToday = () => {
  let currDate = new Date();
  clearSeconds(currDate);
  currDate.setHours(0);
  currDate.setMinutes(0);
  convertToUtc(currDate);
  startDate.value = currDate.valueOf();
  currDate = new Date();
  clearSeconds(currDate);
  currDate.setHours(23);
  currDate.setMinutes(59);
  convertToUtc(currDate);
  endDate.value = currDate.valueOf();
  router.replace({ query: getQuery() });
};

const entities = computed(() => {
  let filtered = cache.entitesWithTasks?.filter(x => (selectedTask.value === -1 || x.taskId === selectedTask.value)
    && (!startDate.value || startDate.value <= x.startTime)
    && (!endDate.value || endDate.value > (x.endTime ?? endDate.value))
  )
  if (!groupBy.value) {
    return filtered?.sort((a, b) => b.id - a.id);
  }
  type ArrayPicker<T> = T extends (infer U)[] ? U : never;
  type filteredEntry = typeof filtered;
  let resolved: Record<string, ArrayPicker<filteredEntry>> = {};
  return Object.values(filtered?.reduce((acc, { taskId, endTime, startTime, task}) => ({
        ...acc,
        [taskId]: {
          id: taskId,
          startTime: 0,
          endTime: (acc[taskId]?.endTime ?? 0) + (endTime ? endTime - startTime : 0 ),
          task,
          taskId
        }
  }), resolved) ?? {});
});
</script>
<style>
.reset-activity-leave-active,
.reset-activity-enter-active {
  transition: all 0.10s ease-in;
}

.reset-activity-leave-to,
.reset-activity-enter-from {
  opacity: 0;
  transform: translateX(-2em);
}

.reset-time-leave-active,
.reset-time-enter-active {
  transition: all 0.1s ease-in;
}

.reset-time-leave-to,
.reset-time-enter-from {
  transform: translateX(2em);
  opacity: 0;
}
</style>
