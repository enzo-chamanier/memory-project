import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import JouerPage from '@/views/JouerPage.vue';

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
  },
  {
    path: '/jouer/:themeId',
    name: 'Jouer',
    component: JouerPage,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
