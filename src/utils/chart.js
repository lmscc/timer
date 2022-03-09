import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent 
} from 'echarts/components';
import { PieChart,LineChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer,SVGRenderer } from 'echarts/renderers';
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  SVGRenderer,
  LineChart,
  GridComponent,
  ToolboxComponent
]);
let option = {
  title: {
    text: 'total',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    left: 'center',
    bottom:0

  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: null,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
let optionForLine = {
    title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['no-name1', 'no-name2', 'no-name3', 'no-name4', 'no-name5','no-name5']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value'
      },
      series: null
}
export {echarts,option,optionForLine}