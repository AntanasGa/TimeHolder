import { Ref, computed } from "vue";

export const convertToUtc = (value: Date) => {
  value.setUTCFullYear(value.getFullYear(), value.getMonth(), value.getDate());
  value.setUTCHours(value.getHours(), value.getMinutes());
  clearSeconds(value);
}

export const clearSeconds = (value: Date) => {
  value.setUTCSeconds(0, 0);
}

const getUtcNow = () => {
  const date = new Date();
  convertToUtc(date);
  return date.valueOf();
}

export const useDateInputs = (ref: Ref<number | undefined>, setDefault: boolean = true, onChange?: () => void) => {

  const time = computed({
    get() {
      if (!setDefault && !ref.value) {
        return '';
      }
      var date = new Date(ref.value ?? getUtcNow());
      return `${(date.getUTCHours() + "").padStart(2, "0")}:${(date.getUTCMinutes()+ "").padStart(2, "0")}`;
    },
    set(value) {
      const [hour, minute] = value.split(":", 2);
      if (!hour || !minute || isNaN(+hour) || isNaN(+minute)) {
        ref.value = undefined;
        return;
      }

      const date = new Date(ref.value ?? getUtcNow());
      date.setUTCHours(+hour, +minute);
      ref.value = date.valueOf();
      onChange?.();
    }
  });
  const date = computed({
    get() {
      if (!setDefault && !ref.value) {
        return '';
      }
      const date = new Date(ref.value ?? getUtcNow());
      return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1 + "").padStart(2, "0")}-${(date.getUTCDate() + "").padStart(2, "0")}`;
    },
    set(value) {
      const [year, month, day] = value.split("-", 3);
      if (!year || !month || !day || isNaN(+year) || isNaN(+month) || isNaN(+day)) {
        ref.value = undefined;
        return;
      }
      const date = new Date(ref.value ?? getUtcNow());
      date.setUTCFullYear(+year, (+month - 1), +day);
      ref.value = date.valueOf();
      onChange?.()
    }
  });
  return [date, time];
}
