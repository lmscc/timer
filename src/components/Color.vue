<template>
    <transition name="el-zoom-in-top">
    <div class='colorChange'>
        <div class = 'container'>
            <i class='el-icon-close' @click="$emit('cancel')"></i>
            <ul class='color_list'>
                <li v-for='(type) in types' class='color_item' :key='type'>
                    <template v-if="itemMapCopy[type]">
                        <!-- <el-color-picker :value="colorMap[type]" @input="colorMap[type] = $event"></el-color-picker> -->
                        <el-color-picker v-model="itemMapCopy[type].color"></el-color-picker>
                        <input v-model='itemMapCopy[type].name'>
                        <input v-show="deleteMode" type="checkbox" v-model="choose" :value="type">
                    </template>
                    
                </li>
            </ul>
            <div class = 'btns'>
                <el-button @click='addMap' size='mini' type='primary'>新增</el-button>
                <el-button @click='remove' size='mini' type='primary'>删除</el-button>
                <el-button @click='save' size='mini' type='primary'>保存</el-button>
            </div>
            
        </div>
    </div>
    </transition>
</template>

<script>
import {randomString,getColor} from '../utils/utils'
import { mapMutations, mapState } from 'vuex'
import Vue from 'vue'
export default {
    data(){
        return{
            deleteMode:false,
            choose:[],
            types:[],
            itemMapCopy:null
        }
    },
    computed:{
        ...mapState(['itemMap']),
        // types(){
        //     return Object.keys(this.colorMap)
        // }
    },
    methods:{
        remove(){
            if(this.deleteMode == false){
                this.deleteMode = true
            }else{
                this.choose.forEach((type)=>{
                    Vue.delete(this.itemMapCopy,type)
                })
                this.deleteMode = false
            }
        },
        addMap(){
            Vue.set(this.itemMapCopy,randomString(6),{
                name:'no-type',
                color:getColor('colorVue')
            })
            this.types = Object.keys(this.itemMapCopy)
        },
        save(){
            this.saveMap(this.itemMapCopy) 
            //在week组件中
            this.$bus.$emit('refreshChart')
            this.init()
            this.$message({showClose: true,message: '保存成功',type: 'success',center:true,duration:600});
        },
        init(){
            this.types = Object.keys(this.itemMap)
            this.itemMapCopy = JSON.parse(JSON.stringify(this.itemMap))
        },
        ...mapMutations(['saveMap'])
    },
    // activated(){
    //     console.log('color激活了')
    //     this.types = Object.keys(this.colorMap)
    // },
    mounted(){
        this.init()
    }
}
</script>

<style lang="stylus">
.colorChange
    position: fixed
    top 0px
    left:  0px
    right  0px
    bottom: 0px
    display: flex
    justify-content: center
    align-items: center
    z-index 2
    .container 
        background-color: white
        border-radius 10px
        padding-left 20px
        padding-right 20px
        padding-top 10px
        // padding-bottom 20px
        box-sizing: border-box
        width 75%
        height fit-content
        border: 1px solid rgba(0,0,0,0.1)

        .el-icon-close
            margin-left 93%
            font-size: 22px
        .color_list
            overflow-y: auto 
            height: 350px
            margin-bottom 11px
            border-top 1px solid rgba(0,0,0,0.1)
            border-bottom 1px solid rgba(0,0,0,0.1)
            .color_item
                list-style-type none
                display:flex
                margin-top: 10px
                input
                    width 120px
                    margin-left: 10px
                .type
                    line-height 40px
                    margin-left 10px
        .btns
            margin-bottom 10px
.colorBlock
    width:30px
    height 30px
    border-radius 4px
    margin-right 8px
</style>