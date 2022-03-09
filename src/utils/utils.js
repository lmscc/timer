function randomString(len) {
    len = len || 32;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
         pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
const colors = ['#409eff','#67c23a','#f7c429','#eb3535','#909399','#b02bd5']
let map = new Map()
function getColor(id){
    let pointer = map.get(id)
    console.log(map)
    if(pointer == undefined){
        map.set(id,1)
        return colors[0]
    }else{
        map.set(id,pointer == 5?0:pointer + 1)
        return colors[pointer]
    }
}
export {randomString,getColor}