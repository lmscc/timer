<template>
    <div class = 'main'>
        <!-- 模式切换 -->
        <nav>
            <i class='iconfont icon-daochu' @click="exportItems"></i>
            <i class='iconfont icon-daoru' @click="dialogVisible2 = true"></i>
            <i class='iconfont el-icon-s-data' @click="$router.push('/timer/statistics')"></i>
            
            <el-switch
                v-model="mode"
                active-text="周"
                inactive-text="日">
            </el-switch>
        </nav>
        <!-- 列表 -->
            <!-- 日视图 -->
        <div class = 'list' ref="list" @touchstart="listTouchstart" @touchend="listTouchend" v-show="!mode">
            <div v-for = '(i) in list' @click="clickCard(i.date)" class = 'card' :key="i.date">
                {{i.date}}&nbsp&nbsp{{i.displayWeek}}
                <input v-show="deleteMode" type="checkbox" v-model="choose" :value="i.date">
            </div>
        </div >
            <!-- 周视图 -->
        <el-calendar v-show="mode">
            <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
            <template
                slot="dateCell"
                slot-scope="{date, data}">
                <p :class="isContainDay(date) ? 'is-contain': ''" @click="jump(date)">
                    {{ data.day.split('-')[2]}}
                </p>
            </template>
        </el-calendar>
        <!-- 按钮 -->
        <div :class="{'add':!deleteMode,'delete':deleteMode}" >
            <i v-show='!deleteMode' class = 'el-icon-plus' @click="dialogVisible = true"></i>
            <i v-show='deleteMode' class = 'el-icon-delete' @click="deleteItems"></i>
        </div>
        <!-- 对话框 -->
        <el-dialog title="选择开始时间" :visible.sync="dialogVisible" width="90%" :modal="false">
            <input type="text" v-model="time">
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size = 'small'>取 消</el-button>
                <el-button type="primary" size = 'small' @click="addOneDay()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="导入文本" :visible.sync="dialogVisible2" width="90%" :modal="false">
            <textarea type="text" v-model="importObj"></textarea>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size = 'small'>取 消</el-button>
                <el-button type="primary" size = 'small' @click="importItems()">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapMutations, mapState } from 'vuex'
import copyToClipboard from '../utils/copyClip'
import Color from './Color.vue'

// import Day from './Day.vue'
let publicPath = '/timer'
export default {
    data(){
      return{
        
          dialogVisible:false,
          time:dayjs().format('HH:mm'),
          choose:[],
          deleteMode:false,
          touchtimer:null,

          dialogVisible2:false,
          importObj:'',

          mode:false,

      }
  },
  computed:{
      ...mapState(['list'])
  },
    methods:{
        addOneDay(){
            this.dialogVisible = false
            //添加一条date的记录 
            let dayjsobj = dayjs()
            let date = dayjsobj.format('MM-DD-YYYY')     
            if(localStorage.getItem(date) != null){
                this.$message({
                        showClose: true,
                        message: '今日已创建',
                        type: 'error',
                        center:true,
                        duration:600
                    });
                return
            }
            //数字 0-6
            let week =  dayjsobj.$W            
            let weeks = ['周日','周一','周二','周三','周四','周五','周六']
            let displayWeek
            displayWeek = weeks[week]
            if(week == 0)week = 7
            let list = this.list.slice()
            list.push({date,week,displayWeek}) 
            this.refreshList(list)
            //关于item
            let obj = {
                timePoint:[this.time],
                texts:[]
            }
            localStorage.setItem(date,JSON.stringify(obj))

        },
        clickCard(date){
            if(!this.deleteMode){
                this.$router.push(publicPath+`/day/${date}`)
            }else{
                let index = this.choose.indexOf(date)
                if(index >= 0){
                    this.choose.splice(index,1)
                }else{
                    console.log('一次')
                    this.choose.push(date)
                }
            }
        },
        deleteItems(){
            this.choose.forEach((date)=>{   
                let index 
                this.list.forEach((item,ind)=>{
                    if(item.date == date){
                        index = ind
                    }
                })     
                this.list.splice(index,1)
                localStorage.removeItem(date)
            })
            this.choose = []
            localStorage.setItem('list',JSON.stringify(this.list))
            window.location.hash=''
            this.deleteMode=false
        },
        exportItems(){    
            let days = []
            this.list.forEach((listItem)=>{
                days.push({
                    date:listItem.date,
                    content:localStorage.getItem(listItem.date)
                })
            })
            let obj = {
                days,
                list:this.list
            }
            
            obj = JSON.stringify(obj)
            copyToClipboard(obj)

            //导出成功
            this.$message({
                        showClose: true,
                        message: '导出成功',
                        type: 'success',
                        center:true,
                        duration:600
                    });
        },
        importItems(){
            this.dialogVisible2 = false 
            // let importObj = JSON.parse(this.importObj)    
            let importObj = JSON.parse(this.importObj)
            console.log(importObj)

            this.refreshList(importObj.list)
            //days是一个数组
            let days = importObj.days
            days.forEach((item)=>{
                localStorage.setItem(item.date,item.content)
            })
            //导入成功
            this.refreshItemMap()
            this.$message({
                        showClose: true,
                        message: '导入成功',
                        type: 'success',
                        center:true,
                        duration:600
                    });
        },
        listTouchstart(){
            clearTimeout(this.touchtimer)
            this.touchtimer = setTimeout(()=>{
                this.deleteMode = true
                window.history.pushState({}, "title", "#/delete");
            },500)
        },
        listTouchend(){
            clearTimeout(this.touchtimer)
        },
        isContainDay(date){
            
            let dateStr = dayjs(date).format('MM-DD-YYYY')
            if(localStorage.getItem(dateStr) !== null){
                return dateStr       
            }
            return false
        },
        jump(date){
            let datestr = this.isContainDay(date)
            if(datestr){
                this.$router.push(`/timer/day/${datestr}`)
            }
        },

        ...mapMutations(['refreshList','refreshItemMap'])
    },
    created(){
    },
    mounted(){
        window.addEventListener('hashchange', e=>{
            if(e.oldURL.indexOf('delete')>=0){
                this.deleteMode = false
            }
        });
    }
}
</script>

<style lang='stylus'>
.main
    width: 100%
    height 100%
nav 
    width: 100%
    height 40px
    border-bottom 1px solid rgba(0,0,0,0.1)
    // background: white
    .iconfont
        font-size: 30px
        margin-left 10px
        color: rgba(0,0,0,0.7)
    .el-icon-s-data
        font-size 24px
        transform: translateY(-3px)
    .el-switch
        float right
        margin-top 11px
        margin-right 20px
    
        // transform: translateY(-3px) !important
.list 
    width: 100%
    overflow: auto;
    height: calc(100% - 40px);  
    .card
        box-sizing: border-box
        padding 9px 13px
        border-radius: 6px
        width calc(100% - 20px)
        margin:10px auto
        background: rgba(255,255,255,0.4);
        // color white
        color rgba(0,0,0,0.8)
    input 
        float: right
        margin-top 4px
.durations
    height: calc(100% - 40px);  
    .duration
        margin-top 15px
        display flex
        justify-content: space-around
        .day
            width 23px
            height 23px
            font-size 13px
            line-height 23px
            text-align center
            background-color: rgba(255,255,255,0.8);
            color rgba(0,0,0,0.7)
            border-radius 2rem
.el-calendar
    background transparent
    .is-contain
        color var(--color-blue)
        font-weight 700
        font-size 17px
    .el-calendar-day
        height auto
        text-align center
    button
        background:rgba(255,255,255,0)
        span 
            font-weight 550
.add 
    width: 50px
    height:50px
    position: fixed
    border-radius 2em
    right 30px
    bottom 40px
    background: #307af5
    color white
    text-align: center
    line-height: 50px
    font-size: 25px
    font-weight 700
    animation: pulse 1.6s infinite;
    box-shadow: 0 0 0 0 rgba(255 255 255 0.7);
.delete 
    width: 50px
    height:50px
    position: fixed
    border-radius 2em
    right 30px
    bottom 40px
    background: #ff3300
    color white
    text-align: center
    line-height: 50px
    font-size: 25px
    font-weight 700
    animation: pulse 1.6s infinite;
    box-shadow: 0 0 0 0 rgba(255 255 255 0.7);
@keyframes pulse {
    50% {
        box-shadow: 0 0 0 10px  rgba(255, 255, 255, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(255,255,255,0);
    }
}
</style>