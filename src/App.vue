<template>
  <div id="app">  
      <div class = 'header' v-show='$route.meta.header'>
          <input type="radio" v-model='mode' id = 'a' value = 'day'>
          <label class = 'tab' for = 'a' @click="jumptoday()">日</label>
          <input type="radio" v-model='mode' id = 'b' value = 'week'>
          <label class = 'tab' for = 'b' @click="jumptoweek()">周</label>
          <i class='iconfont icon-yanse' @click="colorDialogVisible = 1"></i>
      </div>
      <keep-alive exclude="">
          <router-view></router-view>
      </keep-alive>
      <Color v-if='colorDialogVisible' @cancel='colorDialogVisible = 0'/>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
import Color from './components/Color.vue'
function fillEmpty(list){
    if(list.length == 0)return list
    let begin = dayjs(list[0].date,"MM-DD-YYYY") 
    let end = dayjs(list[list.length - 1].date,"MM-DD-YYYY") 
    let i = 0
    let weeks = ['周日','周一','周二','周三','周四','周五','周六']
    while(true){
        let str = begin.format('MM-DD-YYYY')
        if(localStorage.getItem(str) == null || list[i].date !== str){
            localStorage.setItem(str,'{"timePoint":["9:00"],"texts":[]}')
            let week =  begin.$W ;let displayWeek; displayWeek = weeks[week] ;if(week == 0)week = 7   

            list.splice(i,0,{date:str,week,displayWeek})
        }
        if(begin.format('MM-DD-YYYY') == end.format('MM-DD-YYYY')){
            break
        }   
        begin = begin.add(1, 'day')
        i++
    }
    return list
}
export default {
    components:{
        Color
    },
    name: 'App',
    data(){
        return{
            mode:null,
            colorDialogVisible:false,
        }
    },
    methods:{
        jumptoweek(){
            if(this.$route.path.indexOf('week') !== -1)return
            let list = JSON.parse(localStorage.getItem('list'))
        
            let firtWeekday = list[0].week
            let currentDate = this.$route.params.date,currentIndex
            list.forEach((item,index)=>{
                if(item.date == currentDate){
                    currentIndex = index
                }
            })
            let page = parseInt((currentIndex + firtWeekday -1 )/7)
            this.$router.replace(`/timer/week/${page}`)
        },
        jumptoday(){
            if(this.$route.path.indexOf('day') !== -1)return
            this.$router.replace(`/timer/day/${dayjs().format('MM-DD-YYYY')}`)
            
        },
        ...mapMutations(['refreshList'])
    },
    beforeMount(){
        let list = fillEmpty(JSON.parse(localStorage.getItem('list')))
        // console.log(list)
        this.refreshList(list)
        //第一次运行初始化
        // getSum()
        // localStorage.setItem('itemMap',JSON.stringify(itemMap))
    },
    mounted(){
        console.log(this.$route)
        let arr = this.$route.path.match(/timer\/([a-z]+)/)
        if(arr !== null)
            this.mode = arr[1]
    }

}
</script>

<style lang='stylus'>
*
    margin 0
    padding 0
*::-webkit-scrollbar{width:0;}，
body 
    font-family: var(--bs-body-font-family);
    line-height: var(--bs-body-line-height);
    
:root 
    --bs-font-sans-serif: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"
    --bs-body-font-family: var(--bs-font-sans-serif);
    --bs-body-line-height: 1.5
    --color-blue: #409EFF
    --color-green:#67C23A
    --color-orange:#f7c429
    --color-red:#eb3535
    --color-gray:#909399
    --color-purple:#b02bd5
#app
    position: fixed
    top 0;left 0;right:0 ;bottom 0
    background: url('./assets/a.jpg') no-repeat 
    background-size:100% 100%

.header
    position fixed
    line-height: 40px
    height: 40px
    width  90%
    border-bottom 1px solid rgba(0,0,0,0.13)
    margin-left 10px
    display: flex
    text-align: center
    input
        display: none
        &:checked+label
            font-size: 20px
            // font-weight 550
    .tab
        margin-left 10px
    .icon-yanse
        font-size: 26px
        margin-left 18px
        transform: translateY(3px)
</style>
