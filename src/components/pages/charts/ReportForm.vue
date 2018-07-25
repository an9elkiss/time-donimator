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
      title: ['每月Code Review（组别）', '每月持续改进（组别）', '每月分享（组别）'],
      publicAttrs: {
        color: ['#4cabce', '#e5323e'],
        title: {
          text: '',
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
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: [],
            name: '月'
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次/月'
          }
        ],
        calculable: true,
        legend: {
          data: [], // ['李玉龙', '孙琛斌']
          top: '5%'
        },
        series: []
      },
      month: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'],
      app: {},
      // Code Review 报表显示数据
      optionCodeReview: {},
      // 持续改进显示数据
      optionImprovement: {},
      // 分享显示数据
      optionShare: {}
    }
  },
  mounted () {
    this.getChartData(this.optionCodeReview, Global.url.apiGetCodeReviewEveryMonthData, 'GET', 'codeReview', this.title[0])
    this.getChartData(this.optionCodeReview, Global.url.apiGetImprovementMonthData, 'GET', 'improvement', this.title[1])
    this.getChartData(this.optionCodeReview, Global.url.apiGetShareMonthData, 'GET', 'share', this.title[2])
  },
  methods: {
    // 获取每月 Code Review 数据
    async getChartData (option, url, type, id, title) {
      let result = await this.$api(url, '', type)
      option = this.publicAttrs
      let monthData = 0
      if (result.data && result.data.code === 200) {
        for (var key in result.data.data) { // 通过定义一个局部变量key遍历获取map里面的所有key值
          option.legend.data.push(JSON.parse(key).name)
          // 获取今年过了几个月份
          monthData = result.data.data[key].length
          var sery = {
            name: JSON.parse(key).name,
            type: 'bar',
            barGap: 0,
            label: true,
            data: result.data.data[key]
          }
          // 向series数组中添加sery对象数据
          option.series.push(sery)
        }
      }
      // 给数据x轴进行赋值(月份显示)
      option.xAxis[0].data = this.month.slice(0, monthData)
      option.title.text = title
      this.drowChart(option, id)
    },
    drowChart (option, id) {
      // 初始化图像报表
      let myChart = echarts.init(document.getElementById(id))
      // 绘制图表
      myChart.setOption(option, true)
      this.initPublicAttrs()
    },
    initPublicAttrs () {
      this.publicAttrs.series = []
      this.publicAttrs.legend.data = []
      this.publicAttrs.xAxis[0].data = []
    }
  }
}
</script>

<style scoped>
  .charts{
    height: 500px;
  }
</style>
