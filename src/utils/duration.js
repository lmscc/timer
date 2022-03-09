import dayjs from 'dayjs'

export default function(list){
    let begin = dayjs(list[0].date,"MM-DD-YYYY") 
    let end = dayjs(list[list.length - 1].date,"MM-DD-YYYY") 
    //移位
    if(begin.$W == 0){
        begin = begin.subtract(6, 'day')
        console.log(begin)
    }else{
        begin = begin.subtract(begin.$W - 1, 'day')
    }
    
    if(end.$W != 0){
        end = end.add(7 - end.$W, 'day')
    }

    let length = end.diff(begin,'day') + 1
    //
    let durations = []
    let duration = (new Array(7)).fill(null)
    for(let i = 0;i < length;i++){
        let week = begin.$W
        if(week == 0 || i == length - 1){
            if(week == 0){
                duration[6] = (begin.format('MM-DD-YYYY'))
            }else{
                duration[week - 1] = (begin.format('MM-DD-YYYY'))
            }
            durations.push(duration)
            duration = (new Array(7)).fill(null)
        }else{
            duration[week - 1] = (begin.format('MM-DD-YYYY'))
        }
        
        begin = begin.add(1, 'day')
    }
    return durations
}