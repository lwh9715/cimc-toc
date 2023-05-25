import Vue from 'vue'
import App from './App'
import api from './utils/request/api.js'
import md from './utils/request/md5.js'
import config from './utils/request/config.js'
import Tools from './utils/Tools.js'
import uView from "@/uni_modules/uview-ui";
Vue.use(uView);

let WebIM = require("utils/request/config")["default"];

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$md = md
Vue.prototype.$config = config
Vue.prototype.$Tools = Tools
Vue.prototype.$im = WebIM;

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()