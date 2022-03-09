<template>
    <div class='static'>
        <nav>
            <div class='item' :class="{focus:type == 'week'}" @click="type = 'week';calcWeek()">周</div>
            <div class='item' :class="{focus:type == 'month'}" @click="type = 'month'">月</div>
            <div class='item' :class="{focus:type == 'year'}" @click="type = 'year'">年</div>
            <div class='item' :class="{focus:type == 'total'}" @click="type = 'total';getTotal()">全部</div>
        </nav>
        <div>
            <div v-show="type == 'week'">
                <div class = 'title'>按周</div>
                <div id = 'week'class='chart'></div>
            </div>
            <div v-show="type == 'month'">
                
            </div>
            <div v-show="type == 'year'">
                
            </div>
            <div v-show="type == 'total'">
                <div class = 'title'>全部已统计的日期({{list.length}}天)</div>
                <div id = 'total' class='chart'></div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapState } from 'vuex'
import * as echarts from 'echarts/core';
import {getSum,calcWeek} from '../utils/getSum'
export default {   
    name:'Statistics',
    data(){
        return{
            type:'week',
            calced:[]
        }
    },
    methods:{
        getTotal(){
            if(this.calced.find(i=>i=='total'))return
            setTimeout(()=>{
                let chartDom = document.getElementById('total');
                let myChart = echarts.init(chartDom);
                // 绘制饼图
                let result = getSum(this.list,1)
                console.log(result)
                let option = result.option
                myChart.setOption(option);
                this.calced.push('total')
            })
        },
        calcWeek(){
            if(this.calced.find(i=>i=='week'))return
            setTimeout(()=>{
                let chartDom = document.getElementById('week');
                let myChart = echarts.init(chartDom);
                let option = calcWeek(this.list)
                console.log(option)
                myChart.setOption(option);

                this.calced.push('week')
            })
        }

    },
    computed:{
        ...mapState(['list'])
    },
    activated(){
    },
    mounted(){
        this.calcWeek()
    }
    
}
</script>

<style lang="stylus" scoped>
.static
    nav
        display: flex
        align-items: center
        box-sizing: border-box
        padding-left 10px
        width 100%
        height: 40px
        .item
            margin-left 10px
        .focus
            font-weight bold
            font-size: 18px
    .title 
        text-align: center
        font-size: 24px
        margin-top 30px
        font-weight 700
        color rgba(0,0,0,0.7)
    .chart
        margin-top 14px
        height: 300px
</style>