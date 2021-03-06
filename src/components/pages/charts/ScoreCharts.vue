<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">筛选条件</div>
        <h2 class="time-member-filter">类型筛选</h2>
        <div class="panel-body text-left">
          <div class="col-xs-6 col-sm-3 col-lg-2">
            <div class="be-radio inline">
              <input v-model="selectedType" value="true" type="radio" name="yearMonthRadio" id="yearRadio"/>
              <label for="yearRadio">年</label>
            </div>
            <div class="inline">
              <div class="pcPart">
                <select class="form-control input-sm" v-model="year" @change="yearChanged">
                   <option v-for="year in years" :key="year.id" :value="year.id">{{year.value}}</option>
                </select>
              </div>
              <div class="mobPart">
                <input-select title='选择年' :columns="yearColumns" state="true" :initial="year + '年'" @selectConfirmed="yearSelectChange"></input-select>
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-3 col-lg-2">
            <div class="be-radio inline">
              <input v-model="selectedType" value="false" type="radio" name="yearMonthRadio" id="monthRadio"/>
              <label for="monthRadio">月</label>
            </div>
            <div class="inline">
              <div class="pcPart">
                <select class="form-control input-sm" ref="monthSelect" v-model="month" @change="monthChanged" disabled>
                  <option v-for="n in 12" :key="n" :value="n">{{ n }} 月</option>
                </select>
              </div>
              <div class="mobPart">
                <input-select title='选择月份' :columns="monthColumns" :state="monthEnabled" :initial="month + '月'" @selectConfirmed="monthSelectChange"></input-select>
              </div>
            </div>
          </div>
        </div>
        <h2 class="time-member-filter">人员筛选</h2>
        <div class="panel-body">
          <clickable-button v-for="(person, index) of persons" :key="index" :value="person.name" :index="index" :activeFlag="person.selected" @buttonClicked="buttonClicked"></clickable-button>
          <a @click="clearAllPersonsSelected" class="btn btn-primary">清除所有</a>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">{{detailChartOptionTitle}}</div>
        <div class="panel-body">
          <div id="detailChart" class="charts"></div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">{{totalChartOptionTitle}}</div>
        <div class="panel-body">
          <div id="totalChart" class="charts"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import ClickableButton from '@/components/unit/ClickableButton'
import echarts from 'echarts'
import InputSelect from '@/components/unit/InputSelect'

export default {
  name: 'ScoreCharts',
  components: {
    ClickableButton,
    InputSelect
  },
  data: function () {
    return {
      showEchartsTotalInfo: '',
      year: 0,
      month: 0,
      years: [{
        id: 2018,
        value: '2018年'
      }],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectedType: 'true',
      monthEnabled: false,
      persons: [],
      detailChartOptionTitle: '',
      detailChartOption: {
        baseOption: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            selectedMode: false,
            data: [],
            x: 'center'
          },
          grid: {
            left: '5px',
            right: '30px',
            top: '50px',
            bottom: '10px',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            name: '',
            boundaryGap: true,
            splitLine: {show: true},
            data: []
          },
          yAxis: {
            type: 'value',
            name: '贡献值'
          },
          series: []
        },
        media: []
      },
      totalChartOptionTitle: '',
      totalChartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '0',
          right: '60px',
          top: '50px',
          bottom: '10px',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          name: '人员',
          splitLine: {show: true},
          data: []
        },
        xAxis: {
          type: 'value',
          name: '贡献值'
        },
        series: [{
          data: [],
          type: 'bar',
          barMaxWidth: 50,
          color: '#4285f4',
          label: {
            normal: {
              show: true,
              position: 'right'
            }
          }
        }]
      }
    }
  },
  async mounted () {
    let year = new Date().getFullYear()
    this.initTimeFilterYears(year)
    await this.initialYearAndMonth()
    await this.initialPersons()
    await this.initialTotalChartOption()
    this.totalChartSetOption()
    await this.initialDetailChartOption()
    this.detailChartSetOption()
  },
  computed: {
    selectedPersons: function () {
      return this.persons.filter(ele => {
        return ele.selected
      })
    },
    yearColumns () {
      return this.years.map(ele => {
        return ele.value
      })
    },
    monthColumns () {
      return this.months.map(ele => {
        return ele + ' 月'
      })
    }
  },
  watch: {
    selectedType: async function () {
      this.monthEnabled = !this.monthEnabled
      await this.initialDetailChartOption()
      this.detailChartSetOption()
    },
    monthEnabled: function (newValue) {
      if (newValue) {
        this.$refs.monthSelect.removeAttribute('disabled')
      } else {
        this.$refs.monthSelect.setAttribute('disabled', 'disabled')
      }
    }
  },
  methods: {
    yearSelectChange (index) {
      this.year = this.years[index].id
      this.yearChanged()
    },
    monthSelectChange (index) {
      this.month = index + 1
      this.monthChanged()
    },
    clearAllPersonsSelected () {
      this.persons.map(person => {
        person.selected = false
      })
      this.updateDetailChartOption()
      this.detailChartSetOption()
      this.updateTotalChartOption()
      this.totalChartSetOption()
    },
    getDetailChartsOptionMedia () {
      var detailChartsOptionMedia = []
      var selectPersonCount = this.selectedPersons.length
      for (var maxWidth = (selectPersonCount + 7) * 50; maxWidth >= 350; maxWidth = maxWidth - 50) {
        var mediaOption = {
          query: {
            maxWidth: 0
          },
          option: {
            grid: {
              top: ''
            },
            xAxis: {
              axisLabel: {
                interval: 0,
                rotate: 40
              }
            }
          }
        }
        mediaOption.query.maxWidth = maxWidth
        // 一行大概可以显示多少个legend
        var displayPersonsCountInLine = Math.ceil(maxWidth * 1.0 / 50) - 4
        // 选中这么多人大概需要多少行
        var totalLines = Math.ceil(selectPersonCount * 1.0 / displayPersonsCountInLine) + 2
        mediaOption.option.grid.top = totalLines * 25 + 'px'
        detailChartsOptionMedia.push(mediaOption)
      }
      return detailChartsOptionMedia
    },
    async initialYearAndMonth () {
      var result = await this.$api(Global.url.apiGetWeek, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.year = result.data.data.year
        this.month = result.data.data.month
      }
    },
    async initialPersons () {
      var result = await this.$api(Global.url.apiGetAllPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.persons = result.data.data.map(ele => {
          return {
            'id': ele.userId,
            'name': ele.name,
            'selected': true
          }
        })
      }
    },
    async initialTotalChartOption () {
      var queryString = '?year=' + this.year
      queryString = queryString + '&userIds='
      var selectedPersonsList = this.persons.map(ele => {
        return ele.id
      })
      queryString = queryString + (selectedPersonsList.toString())
      var result = await this.$api(Global.url.apiGetTotalScoreData + queryString, '', 'GET')
      if (result.data && result.data.code === 200) {
        for (var person in this.persons) {
          this.persons[person].totalScore = result.data.data.usersActualScore[this.persons[person].id]
        }
        this.updateTotalChartOption()
      }
    },
    async initialDetailChartOption () {
      var queryString = '?year=' + this.year
      if (this.selectedType !== 'true') {
        queryString = queryString + ('&month=' + this.month)
      }
      queryString = queryString + '&userIds='
      var selectedPersonsList = this.persons.map(ele => {
        return ele.id
      })
      queryString = queryString + (selectedPersonsList.toString())
      var result = await this.$api(Global.url.apiGetScoreData + queryString, '', 'GET')
      this.detailChartOption.baseOption.xAxis.data = []
      if (result.data && result.data.code === 200) {
        if (this.selectedType === 'true') {
          // 选中年份
          var monthCount = result.data.data.abscissa.year.length
          for (var monthIndex = 1; monthIndex <= monthCount; monthIndex++) {
            this.detailChartOption.baseOption.xAxis.data.push(monthIndex + '月')
          }
          this.detailChartOptionTitle = this.year + '年每月贡献值统计'
          this.detailChartOption.baseOption.xAxis.name = '月'
        } else {
          // 选中月份
          var weekCount = result.data.data.abscissa.month.length
          for (var weekIndex = 1; weekIndex <= weekCount; weekIndex++) {
            this.detailChartOption.baseOption.xAxis.data.push('第' + weekIndex + '周')
          }
          this.detailChartOptionTitle = this.year + '年' + this.month + '月每周贡献值统计'
          this.detailChartOption.baseOption.xAxis.name = '周'
        }
        for (var person in this.persons) {
          this.persons[person].sery = {
            name: this.persons[person].name,
            type: 'line',
            data: result.data.data.usersActualScore[this.persons[person].id]
          }
        }
        this.updateDetailChartOption()
      }
    },
    updateTotalChartOption () {
      this.totalChartOptionTitle = this.year + '年贡献值总计统计'
      let orderedSelectedPersonByTotalScore = this.selectedPersons.sort(function (begin, last) {
        return begin.totalScore - last.totalScore
      })
      this.totalChartOption.yAxis.data = orderedSelectedPersonByTotalScore.map(person => {
        return person.name
      })
      this.totalChartOption.series[0].data = orderedSelectedPersonByTotalScore.map(person => {
        if (person.totalScore === 0) {
          return null
        }
        return person.totalScore
      })
    },
    updateDetailChartOption () {
      this.detailChartOption.baseOption.legend.data = this.selectedPersons.map(person => {
        return person.name
      })
      this.detailChartOption.baseOption.series = this.selectedPersons.map(person => {
        return person.sery
      })
      this.detailChartOption.media = this.getDetailChartsOptionMedia()
    },
    async yearChanged () {
      await this.initialTotalChartOption()
      await this.initialDetailChartOption()
      this.totalChartSetOption()
      this.detailChartSetOption()
    },
    async monthChanged () {
      await this.initialDetailChartOption()
      this.detailChartSetOption()
    },
    totalChartSetOption () {
      var totalChart = echarts.init(document.getElementById('totalChart'))
      totalChart.setOption(this.totalChartOption, true)
    },
    detailChartSetOption () {
      var detailChart = echarts.init(document.getElementById('detailChart'))
      detailChart.setOption(this.detailChartOption, true)
    },
    buttonClicked (index) {
      this.persons[index].selected = !this.persons[index].selected
      this.updateDetailChartOption()
      this.detailChartSetOption()
      this.updateTotalChartOption()
      this.totalChartSetOption()
    },
    initTimeFilterYears (nowYear) {
      let startYear = this.years[0].id
      while (startYear <= nowYear) {
        startYear += 1
        this.years.push({
          id: startYear,
          value: startYear + '年'
        })
      }
    }
  }
}
</script>

<style scoped>
  .charts {
    height: 500px;
  }
  div.col-md-8.inline{
    padding: 0px;
  }
  .time-member-filter{
    margin: 0;
    padding-top: 8px;
    padding-left: 20px;
    padding-bottom: 3px;
    display: block;
    line-height: 1.1;
    color: inherit;
    font-weight: bold;
    font-size: 14px;
  }
  .col-xs-6{
    padding-left: 0;
  }
</style>
