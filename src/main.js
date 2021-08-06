import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/fonts/iconfont.css'
import './assets/css/global.css'
// 导入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入对应的Nprogress包对应的JS和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.3.79:8002/api/v1/'
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中，隐藏进度条 Nprogress.done
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
