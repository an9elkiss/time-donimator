<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">筛选条件</div>
        <h2 class="time-member-filter">时间筛选</h2>
        <div class="panel-body text-left">
          <div class="col-xs-6 col-sm-3 col-lg-2">
            <div class="be-radio inline">
              <input v-model="selectedType" value="true" type="radio" name="yearMonthRadio" id="yearRadio"/>
              <label for="yearRadio">年</label>
            </div>
            <div class="inline">
              <select class="form-control input-sm" v-model="year" @change="yearChanged">
                <!--<option v-for="n in 6" :value="year - 5 + n" :key="year - 5 + n">{{  year - 5 + n}}</option>-->
                <option value="2018">2018</option>
              </select>
            </div>
          </div>
          <div class="col-xs-6 col-sm-3 col-lg-2">
            <div class="be-radio inline">
              <input v-model="selectedType" value="false" type="radio" name="yearMonthRadio" id="monthRadio"/>
              <label for="monthRadio">月</label>
            </div>
            <div class="inline">
              <select class="form-control input-sm" ref="monthSelect" v-model="month" @change="monthChanged" disabled>
                <option v-for="n in 12" :key="n" :value="n">{{ n }} 月</option>
              </select>
            </div>
          </div>
        </div>
        <h2 class="time-member-filter">人员筛选</h2>
        <div class="panel-body">
          <clickable-button v-for="(person, index) of persons" :key="index" :value="person.name" :index="index" :activeFlag="person.selected" @buttonClicked="buttonClicked"></clickable-button>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">贡献值统计</div>
        <div class="panel-body">
          <div id="detailChart" class="charts"></div>
        </div>
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

export default {
  name: 'ScoreCharts',
  components: {
    ClickableButton
  },
  data: function () {
    return {
      showEchartsTotalInfo: '',
      year: 0,
      month: 0,
      selectedType: 'true',
      monthEnabled: false,
      persons: [],
      detailChartOption: {
        title: {
          text: '',
          left: 'center',
          bottom: 1
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          selectedMode: false,
          data: []
        },
        grid: {
          left: '0',
          right: '50px',
          bottom: '9%',
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
      totalChartOption: {
        title: {
          text: '',
          left: 'center',
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '0',
          right: '50px',
          bottom: '9%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          name: '人员',
          splitLine: {show: true},
          data: []
        },
        yAxis: {
          type: 'value',
          name: '贡献值'
        },
        series: [{
          data: [],
          type: 'line',
          color: '#2572f2',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }]
      }
    }
  },
  async mounted () {
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
    async initialYearAndMonth () {
      var result = await this.$api(Global.url.apiGetWeek, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.year = result.data.data.year
        this.month = result.data.data.month
      }
    },
    async initialPersons () {
      var result = await this.$api(Global.url.apiPersons, '', 'GET')
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
      var selectedPersonsList = this.selectedPersons.map(ele => {
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
      var selectedPersonsList = this.selectedPersons.map(ele => {
        return ele.id
      })
      queryString = queryString + (selectedPersonsList.toString())
      var result = await this.$api(Global.url.apiGetScoreData + queryString, '', 'GET')
      this.detailChartOption.xAxis.data = []
      if (result.data && result.data.code === 200) {
        if (this.selectedType === 'true') {
          // 选中年份
          var monthCount = result.data.data.abscissa.year.length
          for (var monthIndex = 1; monthIndex <= monthCount; monthIndex++) {
            this.detailChartOption.xAxis.data.push(monthIndex + '月')
          }
          this.detailChartOption.title.text = this.year + '年每月贡献统计'
          this.detailChartOption.xAxis.name = '月'
        } else {
          // 选中月份
          var weekCount = result.data.data.abscissa.month.length
          for (var weekIndex = 1; weekIndex <= weekCount; weekIndex++) {
            this.detailChartOption.xAxis.data.push('第' + weekIndex + '周')
          }
          this.detailChartOption.title.text = this.year + '年' + this.month + '月每周贡献统计'
          this.detailChartOption.xAxis.name = '周'
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
      this.totalChartOption.title.text = this.year + '年贡献总计'
      this.totalChartOption.xAxis.data = this.selectedPersons.map(person => {
        return person.name
      })
      this.totalChartOption.series[0].data = this.selectedPersons.map(person => {
        return person.totalScore
      })
    },
    updateDetailChartOption () {
      this.detailChartOption.legend.data = this.selectedPersons.map(person => {
        return person.name
      })
      this.detailChartOption.series = this.selectedPersons.map(person => {
        return person.sery
      })
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
    getNameFromPersonId (id) {
      for (var index in this.persons) {
        if (this.persons[index].id + '' === id) {
          return this.persons[index].name
        }
      }
      return ''
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
      if (this.selectedPersons.length === 0) {
        this.$global.showMessage('请留下至少一个人的数据')
        this.persons[index].selected = true
        return
      }
      this.updateDetailChartOption()
      this.detailChartSetOption()
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
