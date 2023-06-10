import { defineStore } from "pinia";
import { IIndexedDocuments } from "./documents";

export const useDBCacheStore = defineStore('DBCacheStore', {
  state(): { [K in keyof IIndexedDocuments]?: IIndexedDocuments[K][]} {
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
