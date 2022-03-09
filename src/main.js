import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
//组件样式
import 'element-ui/lib/theme-chalk/index.css';
import { TimePicker,Message, Switch, Button, Row, Col, Dialog,Calendar,ColorPicker} from 'element-ui';
Vue.use(TimePicker).use(Switch).use(Button).use(Row).use(Col).use(Dialog).use(Calendar).use(ColorPicker)
Vue.prototype.$message = Message;
// import ElementUI from 'element-ui';

// Vue.use(ElementUI)

import router from './router'

import store from './store'

import dayjs from 'dayjs'
import CustomParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(CustomParseFormat)
let vm = new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
},
}).$mount('#app')

