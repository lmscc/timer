import VueRouter from 'vue-router'
import Vue from 'vue'

import Day from './components/Day.vue'
import Daylist from './components/Daylist.vue'
import Weeklist from './components/Weeklist.vue'
import Main from './components/Main.vue'
import Statistics from './components/Statistics.vue'
Vue.use(VueRouter)
const publicPath = '/timer'
const router = new VueRouter({
    mode:'history',
    routes:[
      {
            path:publicPath + '/day/:date',
            component:Daylist,
            name:'日列表，Daylist',
            meta:{
                header:true
                // keepAlive: true
            },   
      },
      {
            path:publicPath + '/week/:page',
            component:Weeklist,
            name:'周列表，Weeklist',
            meta:{
                header:true
                // keepAlive: true
            },   
      },
      {
            path:publicPath + '/statistics',
            component:Statistics,
            name:'统计',
            meta:{
                // keepAlive: true
            },   
      },
      {
            path:publicPath + '/',
            name:'主页面',
            component:Main,
      }
    ]
})
export default router
