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

export const useToastStore = defineStore('toastStore', {
  state(): { toasts: IToast[] } {
    return {
      toasts: [],
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
    },
  },
});
