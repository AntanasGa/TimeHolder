import { defineStore } from "pinia";
import { IIndexedDocuments } from "./documents";

export const useDBCacheStore = defineStore('DBCacheStore', {
  state(): { [K in keyof IIndexedDocuments]?: IIndexedDocuments[K][]} {
    return {
      entity: undefined,
      task: undefined,
    };
  },
});
