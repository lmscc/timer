import { rgba } from 'stylus/lib/functions'
import Vue from 'vue'
import {getColor} from './utils'

let list = localStorage.getItem('list')
if(list == null){
    localStorage.setItem('list',JSON.stringify([]))
}

let itemMap = localStorage.getItem('itemMap')
if(itemMap !== null) {
    itemMap = JSON.parse(itemMap)
}else{
    itemMap = {}
}

let required
//重新计算一下必须的颜色
//生成itemMap
function refresh() {
    let namecount = 0
    required = new Set()
    // itemMap = {}
    let list = JSON.parse(localStorage.getItem('list')) 
    list.forEach((day)=>{
        day = JSON.parse(localStorage.getItem(day.date))
        if(day !== null){
            day.texts.forEach((text,index)=>{
                //某个text对应的inerval数组，因为interval第一项是到0的时长，为了跳过这个要加1
                let type = text.type
                required.add(type)
                //
                if(type !== '' && itemMap[type] === undefined){  
                    if(type == undefined){
                        Vue.set(itemMap,type,{
                            name:'undefined',
                            color:'#000'
                        })
                    }else{
                        Vue.set(itemMap,type,{
                            name:'no-name' + (++namecount),
                            color:getColor('refresh')
                        })
                    }     
                    
                }      
            })
        }
    })
}

refresh()

localStorage.setItem('itemMap',JSON.stringify(itemMap))

console.log(itemMap)
console.log(required)
export {itemMap,required,refresh}