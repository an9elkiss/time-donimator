<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">类型选择</div>
        <div class="panel-body text-left">
          <div class="col-xs-6">
            <div class="be-radio inline col-md-4">
              <input v-model="selectedType" value="true" type="radio" name="yearMonthRadio" id="yearRadio"/>
              <label for="yearRadio">年</label>
            </div>
            <div class="inline col-md-8">
              <select class="form-control input-sm" v-model="year">
                <option v-for="n in 6" :value="year - 5 + n" :key="year - 5 + n">{{  year - 5 + n}}</option>
              </select>
            </div>
          </div>
          <div class="col-xs-6">
            <div class="be-radio inline col-md-4">
              <input v-model="selectedType" value="false" type="radio" name="yearMonthRadio" id="monthRadio"/>
              <label for="monthRadio">月</label>
            </div>
            <div class="inline col-md-8">
              <select class="form-control input-sm" v-model="month">
                <option v-for="n in 12" :key="n" :value="n">{{ n }} 月</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">人员筛选</div>
        <div class="panel-body">
          <clickable-button v-for="(person, index) of persons" :key="index" :value="person.name" :index="index" :activeFlag="person.selected" @buttonClicked="buttonClicked"></clickable-button>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-body">
          <div id="detailChart" class="charts"></div>
        </div>
      </div>
      <div class="panel panel-default">
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
      year: 0,
      month: 0,
      selectedType: 'true',
      persons: [],
      detailChartOption: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
          left: '0',
          right: '5%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      detailChartOptionLegend: [],
      detailChartOptionSeries: [],
      totalChartOptionXAxis: [],
      totalChartOption: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
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
      console.log(queryString)
      var result = await this.$api(Global.url.apiGetScoreData + queryString, '', 'GET')
      console.log(result)
      this.detailChartOption.xAxis.data = []
      if (result.data && result.data.code === 200) {
        if (this.selectedType === 'true') {
          // 选中年份
          var monthCount = result.data.data.abscissa.year.length
          for (var monthIndex = 1; monthIndex <= monthCount; monthIndex++) {
            this.detailChartOption.xAxis.data.push(monthIndex + '月')
          }
        } else {
          // 选中月份
          var weekCount = result.data.data.abscissa.year.length
          for (var weekIndex = 1; weekIndex <= weekCount; weekIndex++) {
            this.detailChartOption.xAxis.data.push('第' + weekIndex + '周')
          }
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
      this.totalChartOption.legend.data = this.selectedPersons.map(person => {
        return person.name
      })
      this.totalChartOption.series = this.selectedPersons.map(person => {
        return person.sery
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
      this.updateDetailChartOption()
      this.detailChartSetOption()
      // this.updateTotalChartOption()
      // this.totalChartSetOption()
    }
  }
}
</script>

<style scoped>
.charts {
  height: 500px;
}
</style>