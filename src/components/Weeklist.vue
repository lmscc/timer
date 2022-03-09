<template>
     <div class='weeklist'>
        <swiper :options="swiperOption" ref = 'mySwiper'>
            <swiper-slide v-for='(i,index) in durations'>
                <vue-lazy-component>
                    <Week :duration="i"/>
                </vue-lazy-component>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import getDurations from '../utils/duration'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import { component as VueLazyComponent } from '@xunlei/vue-lazy-component'

import Week from './Week.vue'
export default {
    components:{
        swiper,swiperSlide,Week,
        'vue-lazy-component': VueLazyComponent
    },
    data(){
        return{
            swiperOption:{

            },
            durations:[]
        }
    },
    computed:{
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    methods:{
       
    },
    mounted(){
        
    },
    activated(){
        let list = JSON.parse(localStorage.getItem('list')) 
        this.durations = getDurations(list)
        
        console.log(this.durations)
        console.log('weeklist激活了')
        
        let page = this.$route.params.page
        this.swiper.slideTo(page, 300, false)
        this.swiper.on('slideChange', (e)=>{  
            window.history.replaceState(null, null,this.swiper.activeIndex)
        });
    }
}
</script>

<style lang="stylus">
.weeklist
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