<template>
   <div class='daylist'>
        <swiper :options="swiperOption" ref = 'mySwiper'>
            <swiper-slide v-for='(i,index) in list' :key='index'>
                <vue-lazy-component>
                    <Day :date="i.date" :displayWeek="i.displayWeek"/>
                </vue-lazy-component>
            </swiper-slide>
            <!-- <swiper-slide><img src="../assets/back.png"></swiper-slide> -->
        </swiper>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'

import Day from './Day.vue'
import { mapState } from 'vuex'
export default {
    components:{
        swiper,swiperSlide,Day,
        'vue-lazy-component': VueLazyComponent
    },
    data(){
        return{
            swiperOption:{
                zoom:{
                    zoom:true
                }
            },
        }
    },
    computed:{
        swiper() {
            return this.$refs.mySwiper.swiper
        },
        ...mapState(['list'])
    },
    mounted(){
        
    },
    activated(){
        console.log('daylist激活了')
        let currentDate = this.$route.params.date
        let currentIndex = -1

        this.list.forEach((item,index)=>{
            if(item.date == currentDate){
                currentIndex = index
            }
        })
        if(currentIndex == -1){
            this.$router.push('/timer')
        }
        this.swiper.slideTo(currentIndex, 300, false)
        this.swiper.on('slideChange', (e)=>{  
            window.history.replaceState(null, null,this.list[this.swiper.activeIndex].date)
        });
    }
}
</script>

<style lang="stylus">
.daylist
    height: calc(100% - 40px);
    margin-top 40px
    .swiper-container 
        height 100%
        //控制懒加载相关div的高度
        .swiper-slide>div
            height 100%
            &>div
                height 100%
</style>