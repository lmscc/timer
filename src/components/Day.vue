<template>
  <div class = 'container' :data-date = 'date'>
      <!-- 模式选择 -->
      <el-switch
        v-model="timemode"
        active-text="time"
        inactive-text="defalut">
      </el-switch>
      <!-- 主列表 -->
      <template v-if='this.isEmpty'>
          <header>
            <span class = 'date'>{{date}}</span>&nbsp
            <span class = 'week'>{{displayWeek}}</span>
          </header>
        <div v-for = '(p,index) in texts' class = 'item' :style="styleObj(index)" >
            <!-- 区间 -->
            <div @click="dialogForColor = true;choosedBar = index" :style="{background:itemMap[p.type]?
                                                                                itemMap[p.type].color:
                                                                                '#000'
                                                                                }"></div>  
            <!-- 时间点 -->        
            <input class = 'timepoint' type="text" v-model='timePoint[index]'>
            <div :class="{'text-time-mode':timemode}">
                <!-- 时长 -->
                <div>{{intervals[index].hours}}时{{intervals[index].mins}}分</div> 
                <!-- 文本 -->
                <p class ='textarea'  contenteditable="true" v-html="p.text"></p>
            </div>
        </div>
        <input class = 'timepoint' type="text" v-model='timePoint[timePoint.length - 1]'>
      </template>
        <div class = 'time_choose'>
            <!-- 时间选择 -->
            <el-time-picker
                v-model="newTime"
                value-format="HH:mm"
                placeholder="任意时间点"
                :editable="false">
            </el-time-picker>
            <i class = "el-icon-refresh-right refresh" @click="newTime = new Date()"></i>
        </div>
        <!-- 按钮 -->
        <el-row >
            <el-col :span="8"><el-button size = 'medium' type="primary" @click="additem()" round>添加一项</el-button></el-col>
            <el-col :span="8"><el-button size = 'medium' type="primary" @click="removeitem()" round>去除一项</el-button></el-col>
            <el-col :span="8"><el-button size = 'medium' type="primary" @click="save()" round>保存</el-button></el-col>
        </el-row>    
        <!-- 颜色选择 -->
        <el-dialog
            title="选择类型"
            :visible.sync="dialogForColor"
            width="90%"
            :modal="false"
            >
            <div v-for="key in Object.keys(itemMap)" @click="changeType(key)" :style="`background-color:${itemMap[key].color}`" class='colorBlock'></div>

        </el-dialog>
 
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import dayjs from 'dayjs'
export default {
    props:['date','displayWeek'],
    data(){
        return{
            isEmpty:null,

            newTime:new Date(),          
            timePoint:'',
            texts:'',
            timemode:false,
            
            choosedBar:'',
            dialogForColor:false,

        }
    },
    computed:{
        intervals(){
            let arr = []
            for(let i = 0;i < this.timePoint.length - 1;i++){
                let interval = this.subtime(this.timePoint[i],this.timePoint[i+1])
                arr.push(interval)
            }
            return arr
        },
        styleObj(){
            return function(index){
                 if(this.timemode === true){
                    let intervals = this.intervals
                    console.log('intervals',intervals,'index',index)
                    if(intervals != undefined){
                        return{
                            height:intervals[index].length*2 + 'px'
                        }
                    }      
                }else{
                    return null
                }
            }
        },
        ...mapState(['itemMap'])
    },
    methods:{
        // str1比str2早
        subtime(str1,str2){
            
            let arr1 = str1.split(":")
            let arr2 = str2.split(":")
            let hours,mins,length
            
            if(parseInt(arr1[0] *60)  + parseInt(arr1[1]) >= parseInt(arr2[0] *60)  + parseInt(arr2[1])){
                console.log(arr1[0] *60 + arr1[1],arr2[0] *60 + arr2[1])
                this.$message({
                    showClose: true,
                    message: '该时间点在过去或已经创建',
                    type: 'error',
                     center:true,
                    duration:600
                });
                return 'error'
            }

            if(arr2[1] >= arr1[1]){
                hours = arr2[0]-arr1[0]
                mins = arr2[1]-arr1[1]
                length = hours*60 + mins  
            }else{
                hours = arr2[0]-arr1[0]-1
                mins = parseInt(arr2[1]) + 60 - parseInt(arr1[1])
                length = hours*60 + mins   
            }

            return {
                hours,
                mins,
                length
            }          
        },
        additem(){
            let currenttime = this.newTime
            if(currenttime instanceof Date){
                currenttime = dayjs(currenttime).format('HH:mm')
            }
            
            let lasttime =  this.timePoint[this.timePoint.length - 1]  
            if(this.subtime(lasttime,currenttime) == 'error'){
                return
            }
            this.timePoint.push(currenttime)
            this.texts.push({text:'',type:undefined})
        },
        removeitem(){
            if(this.texts.length > 0){
                this.timePoint.pop()
                this.texts.pop()
            }else{
                this.$message({showClose: true,message: '删无可删',type: 'error',center:true,duration:600});
            }
            
        },
        save(){
            let obj = {}
            // obj.date = this.date
            obj.timePoint = this.timePoint
            obj.texts = this.texts
            this.areas = document.querySelectorAll(`[data-date="${this.date}"] .textarea`) 
            //保存html
            this.areas.forEach((dom,index)=>{
                console.log(dom.innerHTML)
                obj.texts[index].text = dom.innerHTML
            })
            localStorage.setItem(this.date,JSON.stringify(obj))
            this.refreshItemMap()

            this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success',
                center:true,
                duration:600
            });
            //重新求一下required
        },
        getstore(){
            let date = this.date
            let obj = JSON.parse(localStorage.getItem(date))
            if(obj !== null){
                // console.log(obj)
                // this.displayWeek = obj.displayWeek
                this.timePoint = obj.timePoint
                this.texts = obj.texts
                this.isEmpty = 1
            }
        },
        changeType(key){
            this.dialogForColor = false
            this.texts[this.choosedBar].type = key
        },
        ...mapMutations(['refreshItemMap'])
    },
    mounted(){      
        this.getstore()
    },
    activated(){
        this.getstore()
    },

}
</script>

<style lang='stylus'scoped>

.container
    box-sizing: border-box
    overflow: auto
    height: 100%
    padding-left: 10px
    padding-top: 10px
    header
        .date
            font-size: 16px
        .week
            font-size: 14px
    .add
        width 80px
        height 30px
        background-color: #0e92fd
        border-radius: 9px
    .timepoint
        outline:none
        border none
        color rgba(0,0,0,0.7)
        font-size: 13px;
        background: transparent
    .time_choose
        margin-top: 14px    
        display: flex
        align-items: center
        .refresh
            color rgba(0,0,0,0.6)
            font-size 35px
            margin-left 10px
    >.el-dialog__wrapper
        position: absolute
.item
    z-index 3
    position relative
    min-height: 68px;
    margin-bottom 5px
    >div:nth-of-type(1)
        position: absolute
        top 23px
        left 13px
        // height calc(100% - 15px)
        bottom 3px
        width 6px
        background-color: #0e92fd
        border-radius: 2rem
    // >div:nth-of-type(2)
    //     color rgba(0,0,0,0.7)
    //     font-size: 13px;
    >div:nth-of-type(2)
        margin-left 30px
        width calc(92% - 30px)
        >div:nth-of-type(1)
            font-weight 700
            font-family '黑体'
            font-size: 20px
    .textarea
        width 100%
        word-break:break-all;
        margin-top: -4px;
        line-height: 1.3;
    .text-time-mode
        height: calc(100% - 20px);
        .textarea
            height calc(100% - 30px)
            overflow: auto;
.el-row
    margin-top 19px
    margin-bottom 20px
.colorBlock
    width:30px
    height 30px
    border-radius 4px
    margin-right 8px
    display: inline-block
    border: 1px solid rgba(0, 0, 0, 0.2);

</style>
<style lang='stylus'>
    .el-date-editor>input
        background transparent
</style>