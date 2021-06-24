import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Menus from '@/components/permissions/Menus'
import Roles from '@/components/permissions/Roles'
import Scdata from '@/components/configure/Scdata'
import Ucdata from '@/components/configure/Ucdata'
import SearchIp from '@/components/address/SearchIp'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/welcome' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/menus', component: Menus },
      { path: '/roles', component: Roles },
      { path: '/scdata', component: Scdata },
      { path: '/ucdata', component: Ucdata },
      { path: '/address/searchip', component: SearchIp }
    ]
  }
]

const router = new VueRouter({
  routes
})

// /挂载路由导航首位
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
