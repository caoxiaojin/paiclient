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
import VisitReport from '@/components/audit/VisitReport'
import Process from '@/components/address/Process'
import Machine from '@/components/resource/Machine'
import Label from '@/components/resource/Label'
import MachineDetail from '@/components/resource/MachineDetail'
import Template from '@/components/publish/Template'
import Command from '@/components/publish/Command'
import Script from '@/components/publish/Script'
import AddTemplate from '@/components/publish/AddTemplate'
import Jenkins from '@/components/integration/Jenkins'

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
      { path: '/address/process', component: Process },
      { path: '/audit/visit', component: Visit },
      { path: '/audit/visitreport', component: VisitReport },
      { path: '/resource/machine', component: Machine },
      { path: '/resource/label', component: Label },
      { path: '/resource/machine/:id', component: MachineDetail },
      { path: '/publish/template', component: Template },
      { path: '/publish/template/add', component: AddTemplate },
      { path: '/publish/command', component: Command },
      { path: '/publish/script', component: Script },
      { path: '/integration/jenkins', component: Jenkins }
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
