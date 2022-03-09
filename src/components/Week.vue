<template>
  <div class = 'week_warp'>
      <div class = 'month'>
          <span>{{month}}</span>
          <span>月</span>
      </div>
      <div class = 'second_line' :data-mark="mark">
          <div class = 'day' v-for="(i,index) in days"><div>{{i}}</div><div>{{day[index]}}</div></div>
      </div>
      <div class = 'third_line'>
          <div class='flex_wrapper'>
                <div class = 'timePoint'>
                    <div v-for='i in 24' class='time'>{{i+":00"}}</div>
                </div>
                <div class = 'main'>
                    <div v-for="(day,index) in list" class = 'column' @click="jumptoDay(index)">
                        <template v-if="day!=null"> 
                            <div :style="{height:`${day.interval[0]}px`}"></div>
                            <div v-for="(text,index) in day.texts" class="card"
                                    :style="{background:itemMap[text.type]?
                                    itemMap[text.type].color:
                                    '#000'
                                    ,
                                    height:`${day.interval[index+1]}px`}"
                            >{{text.text}}
                            </div>
                        </template>
                        
                    </div>
                </div>
          </div>
          
      </div>
      <div :id="mark" class="bintu"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import dayjs from 'dayjs'
import {mapState} from 'vuex'
import {getSum} from '../utils/getSum'
export default {
    props:['duration'],
    data(){
        return{
            list:[null,null,null,null,null,null,null],
            days:['一','二','三','四','五','六','日'],
            activeIndex:'',
            mychart:undefined
        }
    },
    computed:{
        month(){
            if(this.list){
                return this.duration[0].split('-')[0]
            }
        },
        day(){
            let arr = []
            let today = dayjs().format('MM-DD-YYYY')
            this.duration.forEach((i,index)=>{
                if(today == i){
                    this.activeIndex = index + 1
                }
                let day = dayjs(i,"MM-DD-YYYY").$D
                arr.push(day)
            })
            return arr
        },
        mark(){
            return this.duration[0]
        },
        ...mapState(['itemMap'])
    },
    methods:{
        jumptoDay(index){
            if(this.list[index] !== null){
                this.$router.push(`/timer/day/${this.duration[index]}`)
            }
        },
        init(){
            let chartDom = document.getElementById(this.mark);
            if(this.myChart == undefined)
                this.myChart = echarts.init(chartDom);
            // 绘制饼图
            let result = getSum(this.duration,1.2)
            this.list = result.list
            let option = result.option
            this.myChart.setOption(option);
        }
    },
    // 只有在挂载以后这个钩子才有效
    activated(){
        console.log('week组件激活了')
        this.init()
    },
    mounted(){
        console.log('week组件挂载了')
        //为了让第一次出现的时候list上就有数据，
        this.init()
        //设置当前日期的样式
        if(this.activeIndex != ''){
            document.querySelector(`[data-mark="${this.mark}"] div:nth-child(${this.activeIndex}) div:nth-child(2)`).style = "background-color:var(--color-blue);color:white;border-radius:2rem;width:20px;height:20px"
        }
        this.$bus.$on('refreshChart',this.init)
    }
}
</script>

<style lang="stylus">
.week_warp
    // padding-top:10px
    padding-left:10px
    padding-right:2px
    overflow: auto
    height 100%
    .month
        margin-bottom 10px
        margin-left 10px
        font-size: 19px
        font-weight: 700
    .second_line
        margin-left 30px
        display: flex
        background rgba(255,255,255,0.6)
        justify-content: space-around
        font-size: 13px
        .day 
            display: flex
            flex-direction: column
            div
                text-align: center
            >div:nth-child(1)
                margin-bottom 5px
    .third_line
        margin-left: -9px;
        margin-bottom: 13px;
        overflow: hidden
        .flex_wrapper 
            position relative
            // 上移 6 * 块高度
            margin-top:calc(-300px + 10px)
            .timePoint
                background rgba(255,255,255,0.6)
                width 42px
                .time
                    font-size: 9px
                    text-align: center
                    // 与每个块的高度相对应
                    line-height 90px
                    height: 50px
            .main 
                position:absolute 
                top 0px
                left 42px
                display: flex
                justify-content: space-around
                width:calc(100% - 40px)
                .column
                    width calc(100%/7)
                    .card
                        padding 2px
                        border-radius 3px
                        box-sizing: border-box
                        width 98%
                        // background:opacity(0.5) 
                        overflow: auto 
                        font-size: 13px
                        color white
                div:nth-child(odd)
                    background rgba(255,255,255,0.2)
    .bintu
        height 300px
</style>