import { createRouter, createWebHistory, NavigationGuardWithThis, RouteLocationNormalized, RouterView } from 'vue-router'
import Index from '@/routes/Index.vue';
import Err404 from '@/routes/error/Err404.vue';
import Task from '@/routes/Task.vue';
import { useDBCacheStore } from '@/stores/DBCacheStore';
import { ToastStatus, useMessagingStore } from '@/stores/MessagingStore';
import { useIndexedDbStore } from '@/stores/IndexedDbStore';


const generate404 = (to: RouteLocationNormalized): ReturnType<NavigationGuardWithThis<undefined>> => {
  return {
    name: 'NotFound',
    path: to.path,
    params: { catchAll: to.path.substring(1) },
    query: to.query,
    hash: to.hash,
  }
}

const preload: NavigationGuardWithThis<undefined> = async (_) => {
  const toasts = useMessagingStore();
  const db = useIndexedDbStore();
  const cache = useDBCacheStore();
  let shouldStayDenied = false;
  const onDeny = () => {
    db.denyAccess = shouldStayDenied;
    return true;
  };
  await db.initialize().catch((err: EventTarget & {error: Error}) => {
    shouldStayDenied = true;
    toasts.addToast({title: "Database initialize", message: err.error.message, status: ToastStatus.Error});
  });
  if (shouldStayDenied) {
    return onDeny();
  }

  await db.fetch("entity").then((res) => {
    cache.entity = res;
  }).catch((e: IDBRequest | Error) => {
    shouldStayDenied = true;
    let message = e instanceof Error ? e.message : (e.error?.message || "");
    toasts.addToast({title: "Database fetch", message, status: ToastStatus.Error});
  });
  if (shouldStayDenied) {
    return onDeny();
  }

  await db.fetch("task").then((res) => {
    cache.task = res;
  }).catch((e: IDBRequest | Error) => {
    shouldStayDenied = true;
    let message = e instanceof Error ? e.message : (e.error?.message || "");
    toasts.addToast({title: "Database fetch", message, status: ToastStatus.Error});
  });
  if (shouldStayDenied) {
    return onDeny();
  }
  return true;
}

const taskGuard: NavigationGuardWithThis<undefined> = async (to) => {
  const cache = useDBCacheStore();

  if (!("id" in to.params)) {
    return true;
  }

  const id = +to.params["id"];
  const possibleTask = cache.task?.find((x) => x.id === id);
  if (!possibleTask) {
    return generate404(to);
  }

  return true;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: RouterView,
      beforeEnter: preload,
      children: [
        {
          path: '',
          name: 'Overview',
          component: Index,
        },
        {
          path: '/tasks',
          name: 'Tasks',
          component: Index,
          children: [
            {
              path: 'new',
              name: 'NewTask',
              component: Task,
            },
            {
              path: ':id(\\d+)',
              name: 'Task',
              component: Task,
              beforeEnter: taskGuard,
            },
          ],
        },
        {
          path: ':catchAll(.*)',
          name: 'NotFound',
          component: Err404,
        }
      ],
    },
  ],
});

export default router;