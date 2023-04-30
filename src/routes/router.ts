import { createRouter, createWebHistory, RouterView } from 'vue-router'
import Index from '@/routes/Index.vue';
import Err404 from '@/routes/error/Err404.vue';
import Task from '@/routes/Task.vue';

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
              path: ':id',
              name: 'Task',
              component: Task,
            },
          ],
        },
        {
          path: ':catchAll(.*)',
          name: 'Not found',
          component: Err404,
        }
      ],
    },
  ],
});

export default router;