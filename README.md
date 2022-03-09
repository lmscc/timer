# timer
[GitHub](https://github.com/liangmeisheng/timer)
## 项目介绍
基于vue2，elemnet-ui的时间统计工具,记录日常生活中某一时间段的活动记录，并按照年，月，周，日给出统计信息

## 项目演示
[演示地址](http://www.limisi.top/timer)<br><br>

## 目录结构
```
  timer
  ├─ .gitignore
  ├─ README.md
  ├─ babel.config.js
  ├─ output.js
  ├─ package-lock.json
  ├─ package.json
  ├─ public
  │  ├─ favicon.ico
  │  └─ index.html
  ├─ src
  │  ├─ App.vue
  │  ├─ assets
  │  │  └─ a.jpg (背景图片)
  │  ├─ components
  │  │  ├─ Color.vue (选取不同类型的事件对应的名字和颜色)
  │  │  ├─ Day.vue (显示一天的时间点和事件)
  │  │  ├─ Daylist.vue (Day组件的列表)
  │  │  ├─ Main.vue (主页)
  │  │  ├─ Statistics.vue (数据统计组件)
  │  │  ├─ Week.vue (显示一周的时间点和事件)
  │  │  └─ Weeklist.vue (Week组件的列表)
  │  ├─ main.js
  │  ├─ router.js
  │  ├─ store.js
  │  └─ utils
  │     ├─ calcLineChart.js (计算折线图)
  │     ├─ chart.js (echart基本配置)
  │     ├─ colorNameMap.js (生成颜色映射)
  │     ├─ copyClip.js (剪切板)
  │     ├─ duration.js (将天数按周进行分组)
  │     ├─ getSum.js (获取一段时间内各类型事件的时间总长，用于统计)
  │     └─ utils.js (一些工具函数)
  └─ vue.config.js
```
## 数据结构
```javascript
将一天的数据，以日期为键值储存在localstorage中
结构如下
{
    texts:[
        {
            text: "读书"
            type: "b02bd5"
        },
        {
            text: "睡觉"
            type: "q1r345"
        }
        ...
    ],
    timePoint:["8:40","8:40"...]
}
```
