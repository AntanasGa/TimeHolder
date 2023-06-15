import { defineStore } from "pinia";
import { CacheTypes } from "./documents";


export const useDBCacheStore = defineStore('DBCacheStore', {
  state(): CacheTypes {
    return {
      entity: undefined,
      task: undefined,
    };
  },
  getters: {
    entitesWithTasks: (state) => {
      const mappedTasks = Object.fromEntries(state.task?.map((x) => [x.id, x]) ?? []);
      return state.entity?.map((x) => ({...x, task: mappedTasks[x.taskId]}));
    }
  },
});
