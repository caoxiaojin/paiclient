import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Menus from '../components/permissions/Menus'
import Roles from '../components/permissions/Roles'
import Scdata from '../components/configure/Scdata'
import Ucdata from '../components/configure/Ucdata'
import MissionLabel from '../components/configure/MissionLabel'
import MissionLabelDetail from '../components/configure/MissionLabelDetail'
import SearchIp from '../components/address/SearchIp'
import Visit from '../components/audit/Visit'
import VisitReport from '../components/audit/VisitReport'
import Process from '../components/address/Process'
import Machine from '../components/resource/Machine'
import Label from '../components/resource/Label'
import MachineDetail from '../components/resource/MachineDetail'
import Template from '../components/publish/Template'
import Command from '../components/publish/Command'
import Script from '../components/publish/Script'
import AddTemplate from '../components/publish/AddTemplate'
import Jenkins from '../components/integration/Jenkins'
import Deployment from '../components/container/Deployment'
import Statefulsets from '../components/container/Statefulsets'
import Service from '../components/container/Service'
import Routes from '../components/container/Routes'
import Configmap from '../components/container/Configmap'
import Secret from '../components/container/Secret'
import Pod from '../components/container/Pod'
import Sshpod from '../components/container/Sshpod'
// import Test from '../components/container/Test'

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
      { path: '/configure/label', component: MissionLabel },
      { path: '/configure/label/:name', component: MissionLabelDetail },
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
      { path: '/integration/jenkins', component: Jenkins },
      { path: '/container/deployment', component: Deployment },
      { path: '/container/statefulsets', component: Statefulsets },
      { path: '/container/service', component: Service },
      { path: '/container/routes', component: Routes },
      { path: '/container/configmap', component: Configmap },
      { path: '/container/secret', component: Secret },
      { path: '/container/pods', component: Pod },
      { path: '/container/terminal/:pod', component: Sshpod }
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
