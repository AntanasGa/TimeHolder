import { defineStore } from "pinia";

export interface IToast {
  title: string,
  message: string,
  /** miliseconds */
  timeout: number,
  status: ToastStatus,
}

export enum ToastStatus {
  Success,
  Warn,
  Error,
}

export const useMessagingStore = defineStore('toastStore', {
  state(): { toasts: IToast[], subs: (() => void)[], loading: boolean } {
    return {
      toasts: [],
      subs: [],
      loading: false,
    };
  },
  actions: {
    addToast(toast: Partial<IToast>) {
      const pushableToast: IToast = {
        title: "",
        message: "",
        timeout: 5000,
        status: ToastStatus.Success,
        ...toast
      };

      this.toasts = [...this.toasts, pushableToast];
      this.subs.forEach((fn) => fn());
    },
    subscribe(listener: () => void) {
      this.subs.push(listener);
    },
    unsubscribe(listener: () => void) {
      const index = this.subs.indexOf(listener);
      if (index < 0) {
        return;
      }
      this.subs.splice(index, 1);
    },
  },
});
