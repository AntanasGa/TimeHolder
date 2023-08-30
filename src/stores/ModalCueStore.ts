import { numberId } from "@/util/Id";
import { last } from "@/util/array";
import { defineStore } from "pinia";

export const useModalQueStore = defineStore('ModalCueStore', {
  state: () => ({ que: new Array<string>() }),
  actions: {
    push(item: string) {
      this.que.push(item);
    },
    yank(item: string) {
      if (last(this.que) !== item) {
        return;
      }
      this.que.pop();
    }
  },
  getters: {
    isCurrent: (state) => (item: string) => last(state.que) === item,
    generate: (state) => {
      let newItem: string;
      do {
        newItem = numberId(12);

      } while (state.que.includes(newItem))
      return newItem;
    }
  }
});