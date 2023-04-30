import { createRouter, createWebHistory, NavigationGuardWithThis, RouteLocationNormalized, RouterView } from 'vue-router'
import Index from '@/routes/Index.vue';
import Err404 from '@/routes/error/Err404.vue';
import Task from '@/routes/Task.vue';
import { useDBCacheStore } from '@/stores/DBCacheStore';


const generate404 = (to: RouteLocationNormalized): ReturnType<NavigationGuardWithThis<undefined>> => {
  return {
    name: 'NotFound',
    path: to.path,
    params: { catchAll: to.path.substring(1) },
    query: to.query,
    hash: to.hash,
  }
}

const taskGuard: NavigationGuardWithThis<undefined> = (to) => {
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