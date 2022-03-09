import Vue from 'vue'
import Vuex from 'vuex'
import {itemMap,required,refresh } from './utils/colorNameMap'
function setStorage(){
    localStorage.setItem('itemMap', JSON.stringify(state.itemMap))
}
Vue.use(Vuex)
let state = {
    itemMap,
    list:[],
}
let mutations = {
    refreshList(state,list){
        state.list = list
        // console.log(list)
        localStorage.setItem('list',JSON.stringify(list))
    },
    saveMap(state,itemMapCopy){
        let newMap = JSON.parse(JSON.stringify(itemMapCopy))
        for(let key of required){
            if(newMap[key] == undefined){
                newMap[key] = state.itemMap[key]
            }
        }
        for(let key in state.itemMap){
            Vue.delete(state.itemMap,key) 
        }
        for(let key in newMap){
            Vue.set(state.itemMap,key,newMap[key])
        }
        setStorage()      
    },
    refreshItemMap(){
        refresh()
    }
}
window.state = state
// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
export default new Vuex.Store({
  state,
  mutations
})