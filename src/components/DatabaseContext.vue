<template>
  <slot :busy="db.busy || toasts.loading" :accessable="!db.denyAccess"></slot>
</template>

<script setup lang="ts">
import { useIndexedDbStore } from '@/stores/IndexedDbStore';
import { useMessagingStore, IToast, ToastStatus } from '@/stores/MessagingStore';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { IEntity, ITask, IndexType, IndexedItem } from '@/stores/documents';
import { provide } from 'vue';

const items = useDBCacheStore();
const toasts = useMessagingStore();
const db = useIndexedDbStore();

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
      
      items.task.splice(index, 1);
    }).catch((e: IDBRequest | Error) => {
      let message = e instanceof Error ? e.message : (e.error?.message || "");

      toasts.addToast({title: "Task", message, status: ToastStatus.Error});
    });
  },
};

const entryUnloadedError: Partial<IToast> = { title: "Time entry", message: "time entries are not loaded", status: ToastStatus.Error };
const entryMissingError: Partial<IToast> = { title: "Time entry", message: "Could not find index", status: ToastStatus.Error };
const entity = {
  add: (payload: Omit<IEntity, keyof IndexedItem>): Promise<IEntity> => {
    return new Promise((resolve, reject) => {
      db.insert("entity", payload).then((res) => {
        items.entity = [...(items.entity ?? []), res];
        toasts.addToast({title: "Time entry", message: "Time entry added"});
        resolve(res);
      }).catch((e: IDBRequest | Error) => {
        let message = e instanceof Error ? e.message : (e.error?.message || "");
        toasts.addToast({title: "Time entry", message, status: ToastStatus.Error});
        reject(e);
      });
    })
  },
  update: (key: IndexType, payload: IEntity): Promise<IEntity> => {
    return new Promise((resolve, reject) => {
      if (!items.entity) {
        toasts.addToast(entryUnloadedError);
        return reject(new Error(entryUnloadedError.message));
      }
  
      const index = items.entity.map(x => x.id).indexOf(key);
      if (index === -1) {
        toasts.addToast(entryMissingError);
        return reject(new Error(entryMissingError.message));
      }
  
      db.update("entity", payload).then(() => {
        if (!items.entity) {
          toasts.addToast(entryUnloadedError);
          return reject(new Error(entryUnloadedError.message));
        }
        const newEntries = [...items.entity];
        newEntries.splice(index, 1, payload);
        items.entity = newEntries;
        toasts.addToast({title: "Time entry", message: "Time entry updated"});
        resolve(payload);
      }).catch((e: IDBRequest | Error) => {
        let message = e instanceof Error ? e.message : (e.error?.message || "");
        toasts.addToast({title: "Time entry", message, status: ToastStatus.Error});
        reject(e);
      });
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
      
      items.entity.splice(index, 1);
    }).catch((e: IDBRequest | Error) => {
      let message = e instanceof Error ? e.message : (e.error?.message || "");

      toasts.addToast({title: "Time entry", message, status: ToastStatus.Error});
    });
  },
};

export interface DBContext {
  task: typeof task,
  entity: typeof entity,
}

provide('task', task);
provide('entity', entity);
</script>
