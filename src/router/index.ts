import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CreateGameView from '@/views/CreateGameView.vue'
import LobbyView from '@/views/LobbyView.vue'
import JoinGameView from '@/views/JoinGameView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/creategame',
      name: 'creategame',
      component: CreateGameView,
    },
    {
      path: '/joingame',
      name: 'joingame',
      component: JoinGameView,
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: LobbyView,
    },
  ],
})

export default router
