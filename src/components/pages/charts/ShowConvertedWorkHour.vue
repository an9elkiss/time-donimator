<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">筛选条件</div>
        <h2 class="time-member-filter">时间筛选</h2>
        <div class="panel-body flexBox">
          <div class="boxFlex_1">
            <select class="form-control input-sm" v-model="timeFilter.year" @change="changeYearOrMonth()">
              <option value="2018">2018年</option>
            </select>
          </div>
          <div class="boxFlex_1">
            <select class="form-control input-sm" v-model="timeFilter.month" @change="changeYearOrMonth()">
              <option :value="itemmonth.id" :key="itemmonth.id" v-for="itemmonth in timeFilter.months">{{itemmonth.value}}</option>
            </select>
          </div>
          <div class="boxFlex_1">
            <select class="form-control input-sm" v-model="timeFilter.week" @change="changeSelect()">
              <option :value="itemweek.id" :key="itemweek.id" v-for="itemweek in timeFilter.weeks" v-if="itemweek.id <= timeFilter.maxWeek">{{itemweek.value}}</option>
            </select>
          </div>
        </div>
        <!--<div class="panel-heading panel-heading-divider"></div>-->
        <h2 class="time-member-filter">人员筛选</h2>
        <div class="panel-body">
          <clickable-button v-for="(person, index) of selectedList" :key="index" :value="person.name" :index="index" :activeFlag="person.selected" @buttonClicked="buttonClicked"></clickable-button>
        </div>
      </div>
      <div class="panel panel-default">
          <div class="panel-heading panel-heading-divider">一周计划统计</div>
        <div class="panel-body flexBox">
          <div id="container" class="container" style="height: 500px; width: 100%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import { mapState } from 'vuex'
import echarts from 'echarts'
import ClickableButton from '@/components/unit/ClickableButton'
import { Toast } from 'vant'
export default {
  name: 'hello',
  components: { ClickableButton },
  data () {
    return {
      personsData: {},
      projectName: [],
      selectedList: [],
      tableConfig: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        title: {
          text: '任务报表',
          left: 'center',
          bottom: 1
        },
        grid: {
          left: '3%',
          right: '18%',
          bottom: '9%',
          top: '22%',
          containLabel: true
        },
        legend: {
          data: []
        },
        xAxis: {
          type: 'value',
          name: '时间/H',
          splitLine: {show: true}
        },
        yAxis: {
          type: 'category',
          name: '人员/week',
          splitLine: {show: true},
          min: 0,
          max: 4,
          data: []
        },
        series: []
      },
      timeFilter: {
        year: 2018,
        month: 6,
        week: 2,
        maxWeek: 0,
        months: [{
          id: 1,
          value: '1月'
        }, {
          id: 2,
          value: '2月'
        }, {
          id: 3,
          value: '3月'
        }, {
          id: 4,
          value: '4月'
        }, {
          id: 5,
          value: '5月'
        }, {
          id: 6,
          value: '6月'
        }, {
          id: 7,
          value: '7月'
        }, {
          id: 8,
          value: '8月'
        }, {
          id: 9,
          value: '9月'
        }, {
          id: 10,
          value: '10月'
        }, {
          id: 11,
          value: '11月'
        }, {
          id: 12,
          value: '12月'
        }],
        weeks: [{
          id: 1,
          value: '第一周'
        }, {
          id: 2,
          value: '第二周'
        }, {
          id: 3,
          value: '第三周'
        }, {
          id: 4,
          value: '第四周'
        }, {
          id: 5,
          value: '第五周'
        }, {
          id: 6,
          value: '第六周'
        }]
      }
    }
  },
  created () {
    var now = new Date()
    this.timeFilter.year = now.getFullYear()
    this.initialWeek()
    this.timeFilter.month = this.selectedMonth
    this.timeFilter.week = this.selectedWeek
  },
  async mounted () {
    await this.getPersons()
    this.getPersonsData()
  },
  computed: {
    ...mapState({
      personMsg: 'user',
      codeReviewPerson: 'codeReviewPerson',
      selectedMonth: 'selectedMonth',
      selectedWeek: 'selectedWeek'
    }),
    selectedDate: function () {
      return this.timeFilter.year + '年 ' + this.getValueFromId(this.timeFilter.months, this.timeFilter.month) + ' ' + this.getValueFromId(this.timeFilter.weeks, this.timeFilter.week)
    },
    selectedPersons: function () {
      return this.selectedList.filter(ele => { return ele.selected })
      // return this.selectedList
    }
  },
  methods: {
    changeSelect () {
      this.selectedDateCommitStore()
      this.selectedList.map(ele => {
        ele.selected = true
      })
      this.getPersonsData()
    },
    changeYearOrMonth () {
      var t = this
      t.initialWeekFromYearAndMonth()
      t.selectedDateCommitStore()
      this.selectedList.map(ele => {
        ele.selected = true
      })
      this.getPersonsData()
    },
    async initialWeekFromYearAndMonth () {
      var result = await this.$api(Global.url.apiGetWeekFromYearAndMonth + '?year=' + this.timeFilter.year + '&month=' + this.timeFilter.month, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.timeFilter.maxWeek = result.data.data
      }
    },
    async initialWeek () {
      var result = await this.$api(Global.url.apiGetWeek, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.timeFilter.week = result.data.data.week
        this.timeFilter.month = result.data.data.month
        this.selectedDateCommitStore()
        this.initialWeekFromYearAndMonth()
      }
    },
    selectedDateCommitStore () {
      this.$store.commit('setSelectedMonth', this.timeFilter.month)
      this.$store.commit('setSelectedWeek', this.timeFilter.week)
    },
    async getPersons () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.selectedList = result.data.data.map(ele => {
          return {
            'id': ele.userId,
            'name': ele.name,
            'selected': true
          }
        })
      }
    },
    async getPersonsData () {
      var memberIds = this.selectedPersons.map(ele => { return ele.id })
      var url = Global.url.apiShowConvertedWorkHours + '?year=' + this.timeFilter.year + '&month=' + this.timeFilter.month + '&week=' + this.timeFilter.week + '&memberId=' + memberIds
      var result = await this.$api(url, '', 'GET')
      if (result != null && result.data && result.data.code === 200) {
        this.personsData = result.data.data
        this.changeStateSelectButton()
        if (this.personsData == null) {
          document.getElementById('container').style.display = 'none'
          Toast.fail('未选取人员')
        } else if (this.personsData.project.length === 0) {
          document.getElementById('container').style.display = 'none'
          Toast.fail('暂无数据')
        } else {
          document.getElementById('container').style.display = ''
        }
        this.drawLine()
      }
    },
    changeStateSelectButton () {
      this.selectedList.map(ele => {
        ele.selected = false
      })
      // 判断personData是否为空
      if (this.personsData != null) {
        for (var attr in this.personsData.map) {
          for (var att in this.selectedList) {
            if (this.selectedList[att].id + '' === attr) {
              this.selectedList[att].selected = true
            }
          }
        }
      }
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('container'))
      // 拿到taskResultCommand数据
      var duplicateRemovalProjectName = []
      if (this.personsData != null) {
        for (var i in this.personsData.project) {
          if (duplicateRemovalProjectName.indexOf(this.personsData.project[i]) === -1) {
            duplicateRemovalProjectName.push(this.personsData.project[i])
          }
        }
      }
      this.projectName = duplicateRemovalProjectName
      this.tableConfig.legend.data = duplicateRemovalProjectName
      this.tableConfig.yAxis.data.splice(0, this.tableConfig.yAxis.data.length)
      // 判断personData是否为空
      if (this.personsData != null) {
        for (var attr in this.personsData.map) {
          this.tableConfig.yAxis.data.push(this.personsData.map[attr])
          this.tableConfig.yAxis.max = this.personsData.map.length
        }
      }
      this.tableConfig.series.splice(0, this.tableConfig.series.length)
      if (this.personsData != null) {
        for (var projectIndex in this.personsData.echartsCommand) {
          var sery = {
            name: this.personsData.echartsCommand[projectIndex].projectName,
            type: 'bar',
            stack: '总量',
            barMaxWidth: 50,
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.personsData.echartsCommand[projectIndex].totalHours
          }
          this.tableConfig.series.push(sery)
        }
      }
      // 绘制图表
      myChart.setOption(this.tableConfig, true)
    },
    buttonClicked (index) {
      this.selectedList[index].selected = !this.selectedList[index].selected
      if (this.selectedPersons.length === 0) {
        this.$global.showMessage('请至少留下一个人的数据')
        this.selectedList[index].selected = true
        return
      }
      this.getPersonsData()
    }
  }
}
</script>

<style scoped>
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
  .container {
    margin-right: auto;
    margin-left: auto;
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
