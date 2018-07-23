<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">Code Reviev</div>
        <div class="panel-body">
          <div id="codeReview" class="charts"></div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">持续改进</div>
        <div class="panel-body">
          <div id="improvement" class="charts"></div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">分享</div>
        <div class="panel-body">
          <div id="share" class="charts"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import Global from '@/components/Global'
export default {
  name: 'ReportForm',
  data () {
    return {
      month: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'],
      app: {},
      toolbox: {
        show: true,
        orient: 'vertical',
        right: 15,
        top: 'center',
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      // Code Review 报表显示数据
      optionCodeReview: {
        color: ['#4cabce', '#e5323e'],
        title: {
          text: '每月Code Review（组别）',
          left: 'center',
          bottom: 1
        },
        grid: {
          left: '1%',
          right: '10%',
          bottom: '9%',
          top: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [], // ['李玉龙', '孙琛斌']
          top: '5%'
        },
        // 可修改表格的展示方式
        toolbox: {},
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: [], // '一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'
            name: '月'
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次/月'
          }
        ],
        series: []
      },
      // 持续改进显示数据
      optionImprovement: {
        color: ['#4cabce', '#e5323e'],
        title: {
          text: '每月持续改进（组别）',
          left: 'center',
          bottom: 1
        },
        grid: {
          left: '1%',
          right: '10%',
          bottom: '9%',
          top: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [], // '李玉龙', '孙琛斌'
          top: '5%'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: [], // '一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'
            name: '月'
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次/月'
          }
        ],
        series: []
      },
      // 分享显示数据
      optionShare: {
        color: ['#4cabce', '#e5323e'],
        title: {
          text: '每月分享（组别）',
          left: 'center',
          bottom: 1
        },
        grid: {
          left: '1%',
          right: '10%',
          bottom: '9%',
          top: '20%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [], // '李玉龙', '孙琛斌'
          top: '5%'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: [], // '一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'
            name: '月'
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次/月'
          }
        ],
        series: []
      }
    }
  },
  mounted () {
    this.getCodeReviewData()
    this.getImprovementData()
    this.getShareData()
  },
  methods: {
    // 获取每月 Code Review 数据
    async getCodeReviewData () {
      let result = await this.$api(Global.url.apiGetCodeReviewEveryMonthData, '', 'GET')
      let monthData = 0
      if (result.data && result.data.code === 200) {
        for (var key in result.data.data) { // 通过定义一个局部变量key遍历获取map里面的所有key值
          this.optionCodeReview.legend.data.push(key)
          // 获取今年过了几个月份
          monthData = result.data.data[key].length
          var sery = {
            name: key,
            type: 'bar',
            barGap: 0,
            label: true,
            data: result.data.data[key]
          }
          // 向series数组中添加sery对象数据
          this.optionCodeReview.series.push(sery)
        }
      }
      // 给数据x轴进行赋值(月份显示)
      this.optionCodeReview.xAxis[0].data = this.month.slice(0, monthData)
      this.drowCodeReview()
    },
    drowCodeReview () {
      // 初始化图像报表
      let myChart = echarts.init(document.getElementById('codeReview'))
      var app = {}
      app.title = '堆叠条形图'
      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
      // 可用它来更改报表的显示样式
      // this.optionCodeReview.toolbox = this.toolbox
      // 绘制图表
      myChart.setOption(this.optionCodeReview, true)
    },
    // 获取小组每月持续改进数据
    async getImprovementData () {
      let result = await this.$api(Global.url.apiGetImprovementMonthData, '', 'GET')
      let monthData = 0
      if (result.data && result.data.code === 200) {
        for (var key in result.data.data) { // 通过定义一个局部变量key遍历获取map里面的所有key值
          this.optionImprovement.legend.data.push(key)
          // 获取今年过了几个月份
          monthData = result.data.data[key].length
          var sery = {
            name: key,
            type: 'bar',
            barGap: 0,
            label: true,
            data: result.data.data[key]
          }
          // 向series数组中添加sery对象数据
          this.optionImprovement.series.push(sery)
        }
      }
      // 给数据x轴进行赋值(月份显示)
      this.optionImprovement.xAxis[0].data = this.month.slice(0, monthData)
      this.drowImprovement()
    },
    drowImprovement () {
      // 初始化图形报表
      let myChart = echarts.init(document.getElementById('improvement'))
      var app = {}
      app.title = '堆叠条形图'
      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
      // 绘制图表
      myChart.setOption(this.optionImprovement, true)
    },
    // 获取小组每月分享的数据
    async getShareData () {
      let result = await this.$api(Global.url.apiGetShareMonthData, '', 'GET')
      let monthData = 0
      if (result.data && result.data.code === 200) {
        for (var key in result.data.data) {
          this.optionShare.legend.data.push(key)
          // 获取今年过了几个月份
          monthData = result.data.data[key].length
          var sery = {
            name: key,
            type: 'bar',
            barGap: 0,
            label: true,
            data: result.data.data[key]
          }
          this.optionShare.series.push(sery)
        }
      }
      this.optionShare.xAxis[0].data = this.month.slice(0, monthData)
      this.drowShare()
    },
    drowShare () {
      // 初始化图像报表
      let myChart = echarts.init(document.getElementById('share'))
      var app = {}
      app.title = '堆叠条形图'
      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15
      }
      // 绘制图表
      myChart.setOption(this.optionShare, true)
    }
  }
}
</script>

<style scoped>
.charts{
  height: 500px;
}
</style>
