import { Ref, UnwrapRef, ref } from "vue";

export type RefObject<T extends {}> = {[K in keyof T]: Ref<UnwrapRef<T[K]>>};

export interface FormResponse<T extends {}> {
  values: RefObject<T>,
  isDirty: () => boolean,
  reset: (values: T) => void,
}

export const useForm = <T extends {}>(initialValues: T): FormResponse<T> => {
  const startValues = {initial: { ...initialValues }};
  
  // asserting types becaouse they will be assigned
  const values = {} as RefObject<T>;
  let i: keyof T;
  for (i in initialValues) {
    values[i] = ref(initialValues[i]);
  }
  
  return {
    values,
    isDirty() {
      for (i in startValues.initial) {
        if (startValues.initial !== values[i].value) {
          return true;
        }
      }
      return false;
    },
    reset(values) {
      startValues.initial = { ...values };
    },
  };
};
