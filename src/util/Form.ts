import { Ref, ref } from "vue";

export type RefObject<T extends {}> = {[K in keyof T]: Ref<T[K]>};

export interface FormResponse<T extends {}> {
  values: RefObject<T>,
  isDirty: () => boolean,
  reset: (values: T) => void,
  toInitial: () => void,
}

export const useForm = <T extends {}>(initialValues: T): FormResponse<T> => {
  const startValues = {initial: { ...initialValues }};
  
  // asserting types becaouse they will be assigned
  const values = {} as RefObject<T>;
  let i: keyof T;
  for (i in initialValues) {
    // 2 definitions apply, have to override
    values[i] = ref(initialValues[i]) as Ref<T[keyof T]>;
  }
  const result: FormResponse<T> = {
    values,
    isDirty() {
      for (i in startValues.initial) {
        if (startValues.initial[i] !== result.values[i].value) {
          return true;
        }
      }
      return false;
    },
    reset(updateValues) {
      startValues.initial = { ...updateValues };
      result.toInitial()
    },
    toInitial() {
      for(i in startValues.initial) {
        if (typeof result.values[i] === 'undefined') {
          result.values[i] = ref(startValues.initial[i]) as Ref<T[keyof T]>;
        } else {
          result.values[i].value = startValues.initial[i];
        }
      }
    },
  };
  return result;
};
