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
import Visit from '@/components/audit/Visit'
import Process from '@/components/address/Process'
import Report from '@/components/address/Report'

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
      { path: '/user/users', component: Users },
      { path: '/user/menus', component: Menus },
      { path: '/user/roles', component: Roles },
      { path: '/configure/scdata', component: Scdata },
      { path: '/configure/ucdata', component: Ucdata },
      { path: '/address/searchip', component: SearchIp },
      { path: '/audit/visit', component: Visit },
      { path: '/Process', component: Process },
      { path: '/report', component: Report }
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
