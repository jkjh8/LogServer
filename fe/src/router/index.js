import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LogView from '../views/LogView.vue'
import Header from '../components/Header.vue'
import Data from '../components/Data.vue'
import Users from '../views/Users.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      layout: Header,
      default: Home
    }
  },
  {
    path: '/home',
    name: 'Home',
    components: {
      layout: Header,
      default: Home
    }
  },
  {
    path: '/logview',
    name: 'LogView',
    components: {
      layout: Header,
      default: LogView
    }
  },
  {
    path: '/data',
    name: 'Data',
    components: {
      layout: Header,
      default: Data
    }
  },
  {
    path: '/users',
    name: 'Users',
    components: {
      layout: Header,
      default: Users
    }
  },
  {
    path: '/login',
    name: 'Login',
    components: {
      layout: () => import('../components/HeaderLogin.vue'),
      default: () => import('../views/User/Login.vue')
    }
  },
  {
    path: '/Register',
    name: 'Register',
    components: {
      layout: () => import('../components/HeaderLogin.vue'),
      default: () => import('../views/User/Register.vue')
    }
  },
  {
    path: '*',
    name: 'Error',
    components: {
      layout: null,
      default: () => import('../views/404.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
