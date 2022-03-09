import {option,optionForLine} from './chart.js'
import {itemMap } from './colorNameMap.js'
//输入时间点，输出区间段
function getinterval(timePoint,scale = 1){
    let arr = []
    timePoint.forEach((i)=>{
        let length = i.split(':')[0]*60 + parseInt(i.split(':')[1]) 
        arr.push(length)
    })
    arr.push(24*60)
    // 60min->50px  /
    let arr2 = [arr[0]/scale]
    arr.forEach((i,index,arr)=>{
        if(index < arr.length - 1){
            arr2.push(parseInt( ( arr[index+1] - arr[index] )/scale )  )
        }
    })
    return arr2
}
//获取列表 加上interval
function getListContainInterval(arr,scale){
    let list = new Array(arr.length).fill(null)
    arr.forEach((i,index)=>{   
        let item = localStorage.getItem(i.date||i)
        if(item != null){
            //算区间
            item = JSON.parse(item)
            item.interval = getinterval(item.timePoint,scale)
            list[index] = item
        }
    })
    return list 
}
//输入一日期数组，计算得分类的的时间
function getSum(arr,scale){
    console.log('itemMap--',itemMap)
    
    let list = getListContainInterval(arr,scale)
    //算总和
    let total = 0
    let count = 0
    console.log('----list',list)
    list.forEach((item)=>{
        if(item !== null){
            let points = item.timePoint
            let begin = points[0].split(':')[0]*60 + parseInt(points[0].split(':')[1]) 
            let end = points[points.length - 1].split(':')[0]*60 + parseInt(points[points.length - 1].split(':')[1]) 
            total += (end - begin)
            count++
        }
    })
    option.title.text = 'Total '+parseInt(total/60)+'h/'+ count*24 +'h'
    //算各项,构建绘图数据
    //刷新data，获取新颜色及名字
    // refreshData()
    let dataMap = {}
    list.forEach((day)=>{
        if(day !== null){
            day.texts.forEach((text,index)=>{
                //某个text对应的inerval数组，因为interval第一项是到0的时长，为了跳过这个要加1
                let timeLength = day.interval[index+1]
                let type = text.type
                if(type !== ''){
                    if(dataMap[type] === undefined){
                        dataMap[type] = {
                                            value:0,
                                            name:itemMap[type].name,
                                            itemStyle:{
                                                color:itemMap[type].color
                                            }      
                                        }
                    }
                    dataMap[type].value += timeLength*scale/60
                }      
            })
        }
    })
    let data = Object.values(dataMap)
    data.forEach((item)=>{
        item.value = item.value.toFixed(1)
    })
    option.series[0].data = data
    console.log('计算了一次总和')
    console.log(JSON.parse(JSON.stringify(option)))
    return {list,option}
}
function calcWeek(arr){
    let list = getListContainInterval(arr)
    let dataMap = {}
    list.forEach((day,outerIndex)=>{
        day.texts.forEach((text,index)=>{
            //某个text对应的inerval数组，因为interval第一项是到0的时长，为了跳过这个要加1
            let timeLength = day.interval[index+1]
            let type = text.type
            if(type !== ''){
                if(dataMap[type] == undefined){
                    dataMap[type] = {
                                        name:itemMap[type].name,
                                        itemStyle:{
                                            color:itemMap[type].color
                                        },
                                        type:'line',
                                        data:new Array(Math.floor(arr.length/7) + 1).fill(0)
                                    }
                }
                dataMap[type].data[Math.floor(outerIndex/7)] += Number((timeLength/60))
               
            }      
        })
    })
    let data = Object.values(dataMap)
    data.forEach(item=>{
        item.data.forEach((i,index,arr)=>{
            arr[index] = arr[index].toFixed(1)
        })
    })
    optionForLine.series = data
    optionForLine.legend.data = Object.values(dataMap).map(i=>i.name)
    // data.forEach((item)=>{
    //     item.value = item.value.toFixed(1)
    // })
    return optionForLine
}
export {getSum,calcWeek}