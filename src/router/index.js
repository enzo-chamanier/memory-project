import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import DashboardPage from '@/views/DashboardPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: DashboardPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
