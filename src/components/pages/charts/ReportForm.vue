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
      differentFlags: ['CodeReview', 'Improvement', 'Share'],
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
          },
          formatter: function (params) {
            var html = ''
            if (params.length > 0) {
              for (var int = 0; int < params.length; int++) {
                html += params[int].seriesName + ':' + params[int].data + '<br>'
              }
            }
            return html
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
      optionShare: {},
      // 获取组长姓名和Id
      groupLeader: [],
      forwordInformation: {
        month: 0,
        userId: 0,
        flag: ''
      }
    }
  },
  mounted () {
    this.getChartData(this.optionCodeReview, Global.url.apiGetCodeReviewEveryMonthData, 'GET', 'codeReview', this.title[0], this.differentFlags[0])
    this.getChartData(this.optionCodeReview, Global.url.apiGetImprovementMonthData, 'GET', 'improvement', this.title[1], this.differentFlags[1])
    this.getChartData(this.optionCodeReview, Global.url.apiGetShareMonthData, 'GET', 'share', this.title[2], this.differentFlags[2])
  },
  methods: {
    // 说明：由于是操作echarts表格画布数据，所以需要把上下文参数和需要用到的数据对象传递进去，这样才可进行正常操作！！
    // 获取每月 Code Review 数据，
    // option：echarts设置的数据对象、url：获取数据的地址、type：GET/POST、
    // id：echarts初始化的id、title：表格的title、differentFlag：识别用到的表示符
    async getChartData (option, url, type, id, title, differentFlag) {
      let result = await this.$api(url, '', type)
      option = this.publicAttrs
      let monthData = 0
      if (result.data && result.data.code === 200) {
        for (var key in result.data.data) { // 通过定义一个局部变量key遍历获取map里面的所有key值
          option.legend.data.push(JSON.parse(key).name)
          var groupLeader = {
            name: JSON.parse(key).name,
            userId: JSON.parse(key).userId
          }
          this.groupLeader.push(groupLeader)
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
      this.drowChart(option, id, this.groupLeader, this.month, differentFlag, this.forwordInformation, this.$store, this.$router)
    },
    // option：echarts设置的数据对象、id：echarts初始化的id、groupLeader：每组的组长id和name
    // monthData：月份数组、forwordInformation：转发页面需要用到的数据
    // store：this.$store、router：this.$router
    drowChart (option, id, groupLeader, monthData, differentFlag, forwordInformation, store, router) {
      // 初始化图像报表
      let myChart = echarts.init(document.getElementById(id))
      // 绘制图表
      myChart.setOption(option, true)
      myChart.on('click', function (param) {
        // 重要的参数都在param这里！
        var userid = 0
        for (var i = 0, vlen = monthData.length; i < vlen; i++) {
          if (monthData[i] === param.name) {
            forwordInformation.month = i + 1
          }
        }
        for (var key in groupLeader) {
          if (param.seriesName === groupLeader[key].name) {
            userid = groupLeader[key].userId
            break
          }
        }
        forwordInformation.userId = userid
        forwordInformation.flag = differentFlag
        store.commit('setForwordInformation', forwordInformation)
        router.push({name: 'ShowReportFormInfo'})
      })
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
