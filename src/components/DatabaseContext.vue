<template>
  <slot :busy="db.busy" :accessable="!denyDbAccess"></slot>
</template>

<script setup lang="ts">
import { useIndexedDbStore } from '@/stores/IndexedDbStore';
import { useToastStore, IToast, ToastStatus } from '@/stores/ToastStore';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { IEntity, ITask, IndexType, IndexedItem } from '@/stores/documents';
import { provide, ref } from 'vue';

const items = useDBCacheStore();
const toasts = useToastStore();
const db = useIndexedDbStore();

const denyDbAccess = ref(false);

db.initialize().then(async () => {
  let shouldStayDenied = false;
  await db.fetch("entity").then((res) => {
    items.entity = res;
  }).catch((e: IDBRequest | Error) => {
    shouldStayDenied = true;
    let message = e instanceof Error ? e.message : (e.error?.message || "");
    toasts.addToast({title: "Database fetch", message, status: ToastStatus.Error});
  });

  await db.fetch("task").then((res) => {
    items.task = res;
  }).catch((e: IDBRequest | Error) => {
    shouldStayDenied = true;
    let message = e instanceof Error ? e.message : (e.error?.message || "");
    toasts.addToast({title: "Database fetch", message, status: ToastStatus.Error});
  });
  denyDbAccess.value = shouldStayDenied;
});

const taskUnloadedError: Partial<IToast> = { title: "Task", message: "tasks are not loaded", status: ToastStatus.Error };
const taskMissingError: Partial<IToast> = { title: "Task", message: "Could not find index", status: ToastStatus.Error };
const task = {
  add: (payload: Omit<ITask, keyof IndexedItem>): Promise<ITask> => {
    return new Promise((resolve, reject) => {
      db.insert("task", payload).then((res) => {
        items.task = [...(items.task ?? []), res];
        toasts.addToast({title: "Task", message: "Task added"});
        resolve(res);
      }).catch((e: IDBRequest | Error) => {
        let message = e instanceof Error ? e.message : (e.error?.message || "");
        toasts.addToast({title: "Task", message, status: ToastStatus.Error});
        reject(e);
      });
    });
  },
  update: (key: IndexType, payload: ITask): Promise<ITask> => {
    return new Promise((resolve, reject) => {
      if (!items.task) {
        toasts.addToast(taskUnloadedError);
        return reject(new Error(taskUnloadedError.message));
      }
  
      const index = items.task.map(x => x.id).indexOf(key);
      if (index === -1) {
        toasts.addToast(taskMissingError);
        return reject(new Error(taskMissingError.message));
      }
  
      db.update("task", payload).then(() => {
        if (!items.task) {
          toasts.addToast(taskUnloadedError);
          return reject(taskUnloadedError.message);
        }
        const newTasks = [...items.task];
        newTasks.splice(index, 1, payload);
        items.task = newTasks;
        toasts.addToast({title: "Task", message: "Task updated"});
        resolve(payload);
      }).catch((e: IDBRequest | Error) => {
        let message = e instanceof Error ? e.message : (e.error?.message || "");
        toasts.addToast({title: "Task", message, status: ToastStatus.Error});
        reject(e);
      });
    });
  },
  remove: (key: IndexType) => {
    if (!items.task) {
      toasts.addToast(taskUnloadedError);
      return;
    }

    const index = items.task.map(x => x.id).indexOf(key);
    if (index === -1) {
      toasts.addToast(taskMissingError);
      return;
    }

    db.remove("task", key).then(() => {
      if (!items.task) {
        toasts.addToast(taskUnloadedError);
        return;
      }
      
      items.task = items.task.splice(index, 1);
    }).catch((e: IDBRequest | Error) => {
      let message = e instanceof Error ? e.message : (e.error?.message || "");

      toasts.addToast({title: "Task", message, status: ToastStatus.Error});
    });
  },
};

const entryUnloadedError: Partial<IToast> = { title: "Time entry", message: "time entries are not loaded", status: ToastStatus.Error };
const entryMissingError: Partial<IToast> = { title: "Time entry", message: "Could not find index", status: ToastStatus.Error };
const entry = {
  add: (payload: Omit<IEntity, keyof IndexedItem>) => {
    db.insert("entity", payload).then((res) => {
      items.entity = [...(items.entity ?? []), res];
      toasts.addToast({title: "Time entry", message: "Time entry added"});
    }).catch((e: IDBRequest | Error) => {
      let message = e instanceof Error ? e.message : (e.error?.message || "");

      toasts.addToast({title: "Time entry", message, status: ToastStatus.Error});
    });
  },
  update: (key: IndexType, payload: IEntity) => {
    if (!items.entity) {
      toasts.addToast(entryUnloadedError);
      return;
    }

    const index = items.entity.map(x => x.id).indexOf(key);
    if (index === -1) {
      toasts.addToast(entryMissingError);
      return;
    }

    db.update("entity", payload).then(() => {
      if (!items.entity) {
        toasts.addToast(entryUnloadedError);
        return;
      }
      const newEntries = [...items.entity];
      newEntries.splice(index, 1, payload);
      items.entity = newEntries;
      toasts.addToast({title: "Time entry", message: "Time entry updated"});
    }).catch((e: IDBRequest | Error) => {
      let message = e instanceof Error ? e.message : (e.error?.message || "");

      toasts.addToast({title: "Time entry", message, status: ToastStatus.Error});
    });
  },
  remove: (key: IndexType) => {
    if (!items.entity) {
      toasts.addToast(entryUnloadedError);
      return;
    }

    const index = items.entity.map(x => x.id).indexOf(key);
    if (index === -1) {
      toasts.addToast(taskMissingError);
      return;
    }

    db.remove("entity", key).then(() => {
      if (!items.entity) {
        toasts.addToast(entryUnloadedError);
        return;
      }
      
      items.entity = items.entity.splice(index, 1);
    }).catch((e: IDBRequest | Error) => {
      let message = e instanceof Error ? e.message : (e.error?.message || "");

      toasts.addToast({title: "Time entry", message, status: ToastStatus.Error});
    });
  },
};

export interface DBContext {
  task: typeof task,
  entry: typeof entry,
}

provide('task', task);
provide('entry', entry);
</script>
