import Vue from 'vue'
import App from './App'
import api from '@/common/api.js'
import store from './store'
import tools from '@/common/tools.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$api = api
Vue.prototype.$tools = tools

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
