<template>
  <div :class="'echarts-table ' + tableClass">
    <div :id="id" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ProjectPlanChart',
  props: {
    tableClass: {
      type: String,
      default: ''
    },
    updateFlag: Boolean,
    setting: Object,
    planSetting: Object
  },
  computed: {
    id () {
      return 'projectPlanChart-' + this.planSetting.id
    }
  },
  data () {
    return {
      echartsInstant: null,
      echartsOption: {},
      constant: {
        ONE_DAY_MILLS: 24 * 3600 * 1000,
        PROJECT_PLAN_PHASE_KEY: 'projectPlanPhase',
        PROJECT_PLAN_PHASE_CHECK_KEY: 'projectPlanPhaseCheck',
        PROJECT_PLAN_PHASE_COLOR: {
          1: '#228B22', 2: '#FF6347', 3: '#FF6347'
        },
        PROJECT_PLAN_CATEGORIES: ['计划', '实际']
      }
    }
  },
  watch: {
    updateFlag () {
      let self = this
      if (self.updateFlag) {
        self.buildOption()
        self.echartsInstant.setOption(self.echartsOption, true)
        self.echartsInstant.resize()
        self.$emit('updateUpdateFlag')
      }
    }
  },
  mounted () {
    let self = this
    self.echartsInstant = echarts.init(document.getElementById(self.id))
    self.buildOption()
    self.echartsInstant.setOption(self.echartsOption)
    self.echartsInstant.on('click', function (params) {
      switch (params.componentType) {
        case 'series':
          // 计划阶段被点击
          if (params.value[0] === 0) {
            self.$emit('itemClicked', self.findOriginSetting('planPhase', params.value[5]))
          }
          break
        case 'markLine':
          // 检查点被点击
          if (params.data.append.isPlan) {
            self.$emit('itemClicked', self.findOriginSetting('planPhaseCheck', params.data.append.id))
          }
          break
      }

      params.event.event.cancelBubble = true
      params.event.event.stopPropagation()
      return false
    })
  },
  methods: {
    buildOption () {
      if (this.setting === null) {
        return
      }
      this.echartsOption.tooltip = this.buildTooltip()
      this.echartsOption.title = this.buildTitle()
      this.echartsOption.dataZoom = this.buildDataZoom()
      this.echartsOption.grid = this.buildGrid()
      this.echartsOption.xAxis = this.buildXAxis()
      this.echartsOption.yAxis = this.buildYAxis()
      this.echartsOption.series = this.buildSeries()
    },
    buildOptionSeriesData () {
      let self = this
      if (self.setting[self.constant.PROJECT_PLAN_PHASE_KEY]) {
        let data = []
        self.setting[self.constant.PROJECT_PLAN_PHASE_KEY].map(projectPlanPhase => {
          let template = self.buildOptionSeriesDataTemplate(projectPlanPhase.type)
          if (template === null) {
            return
          }
          if (projectPlanPhase.planStartTime && projectPlanPhase.planEndTime) {
            template.value = [0, projectPlanPhase.planStartTime, projectPlanPhase.planEndTime, self.$global.projectPlanPhaseType[projectPlanPhase.type], projectPlanPhase.description, projectPlanPhase.id]
            data.push(JSON.parse(JSON.stringify(template)))
          }
          if (projectPlanPhase.actualStartTime && projectPlanPhase.actualEndTime) {
            template.value = [1, projectPlanPhase.actualStartTime, projectPlanPhase.actualEndTime, self.$global.projectPlanPhaseType[projectPlanPhase.type], projectPlanPhase.description, projectPlanPhase.id]
            data.push(JSON.parse(JSON.stringify(template)))
          }
        })
        return data
      }
      return null
    },
    buildOptionSeriesDataTemplate (type) {
      if (type === null) {
        return null
      }
      let self = this
      return {
        value: [],
        itemStyle: {
          normal: {
            color: self.constant.PROJECT_PLAN_PHASE_COLOR[type]
          }
        }
      }
    },
    buildOptionSeriesMarkAreaData () {
      let self = this
      if (self.planSetting.planStartTime) {
        let now = new Date().getTime()
        let planStartTime = new Date(self.planSetting.planStartTime).getTime()
        if (now > planStartTime) {
          return [
            [{xAxis: planStartTime}, {xAxis: now}]
          ]
        }
      }
      return null
    },
    buildOptionSeriesMarkLineData () {
      let self = this
      if (self.setting[self.constant.PROJECT_PLAN_PHASE_CHECK_KEY]) {
        let data = []
        self.setting[self.constant.PROJECT_PLAN_PHASE_CHECK_KEY].map(projectPlanPhaseCheck => {
          let planTemplate = self.buildOptionSeriesMarkLineDataTemplate(true, projectPlanPhaseCheck)
          if (planTemplate) {
            data.push(planTemplate)
          }
          let actualTemplate = self.buildOptionSeriesMarkLineDataTemplate(false, projectPlanPhaseCheck)
          if (actualTemplate) {
            data.push(actualTemplate)
          }
        })
        return data
      }
      return null
    },
    buildOptionSeriesMarkLineDataTemplate (isPlan, projectPlanPhaseCheck) {
      let self = this
      if (isPlan && !projectPlanPhaseCheck.planCheckTime) {
        return null
      }
      if (!isPlan && !projectPlanPhaseCheck.actualCheckTime) {
        return null
      }
      let xAxis = new Date(isPlan ? projectPlanPhaseCheck.planCheckTime : projectPlanPhaseCheck.actualCheckTime).getTime()
      let template = {
        name: 'checkline',
        xAxis: xAxis,
        append: {
          id: projectPlanPhaseCheck.id,
          description: projectPlanPhaseCheck.description,
          isPlan: isPlan,
          time: isPlan ? projectPlanPhaseCheck.planCheckTime : projectPlanPhaseCheck.actualCheckTime
        }
      }
      if (isPlan) {
        template.append.label = '计划检查点'
        template.append.status = projectPlanPhaseCheck.planStatus === null ? '无' : self.$global.projectPlanPhaseCheckStatusType[projectPlanPhaseCheck.planStatus]
        return template
      }

      template.append.label = '实际检查点'
      template.append.status = projectPlanPhaseCheck.actualStatus === null ? '无' : self.$global.projectPlanPhaseCheckStatusType[projectPlanPhaseCheck.actualStatus]
      template.lineStyle = {
        color: 'blue'
      }
      return template
    },
    buildTooltip () {
      let self = this
      return {
        formatter: function (params) {
          let result = '日期区间：'
          if (params.value[1] && params.value[2]) {
            result += (params.value[1].substr(0, 10) + '~' + params.value[2].substr(0, 10) + '<br />')
          } else {
            result += '无<br />'
          }
          result += '<div style="border-top: 1px solid #d9d9d9;">'
          result += '描述：<br />'
          result += (params.value[4] ? self.$global.format(params.value[4]) : '无')
          result += '</div>'
          return result
        }
      }
    },
    buildTitle () {
      let self = this
      return {
        text: self.planSetting.name,
        left: 'center'
      }
    },
    buildDataZoom () {
      return [{
        type: 'slider',
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: 30,
        height: 20,
        borderColor: 'transparent',
        backgroundColor: '#e2e2e2',
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 20,
        handleStyle: {
          shadowBlur: 6,
          shadowOffsetX: 1,
          shadowOffsetY: 2,
          shadowColor: '#aaa'
        },
        labelFormatter: ''
      }, {
        type: 'inside',
        filterMode: 'weakFilter'
      }]
    },
    buildGrid () {
      return {
        top: 80,
        height: 80
      }
    },
    buildXAxis () {
      let self = this
      return {
        type: 'time',
        position: 'bottom',
        axisLabel: {
          align: 'left'
        },
        // interval: self.constant.ONE_DAY_MILLS
        minInterval: self.constant.ONE_DAY_MILLS
        // maxInterval: self.constant.ONE_DAY_MILLS
      }
    },
    buildYAxis () {
      let self = this
      return {
        data: self.constant.PROJECT_PLAN_CATEGORIES
      }
    },
    buildSeries () {
      let self = this
      let series = []
      let sery = {
        type: 'custom',
        renderItem: (params, api) => {
          var categoryIndex = api.value(0)
          var start = api.coord([api.value(1), categoryIndex])
          var end = api.coord([api.value(2), categoryIndex])
          var height = 25

          var rectShape = echarts.graphic.clipRectByRect({
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          })

          return {
            type: 'rect',
            shape: rectShape,
            style: api.style({
              text: api.value(3)
            })
          }
        },
        itemStyle: {
          normal: {
            opacity: 0.8
          }
        },
        encode: {
          x: [1, 2],
          y: 0
        },
        data: self.buildOptionSeriesData(),
        markArea: {
          silent: true,
          itemStyle: {
            color: '#ccc'
          },
          data: self.buildOptionSeriesMarkAreaData()
        },
        markLine: {
          silent: false,
          symbol: 'none',
          tooltip: {
            show: true,
            formatter: function (params) {
              var result = ''
              var flag = params.data.append.isPlan ? '计划' : '实际'
              result += (flag + '检查日期：' + params.data.append.time.substr(0, 10) + '<br />')
              result += (flag + '状态：' + params.data.append.status + '<br />')
              result += '<div style="border-top: 1px solid #d9d9d9;">描述：<br />' + (params.data.append.description ? self.$global.format(params.data.append.description) : '无') + '</div>'
              return result
            }
          },
          label: {
            formatter: function (params) {
              return params.data.append.label
            }
          },
          data: self.buildOptionSeriesMarkLineData()
        }
      }
      series.push(sery)
      return series
    },
    findOriginSetting (type, id) {
      let self = this
      if (id === null) {
        return null
      }
      if (type === 'planPhase') {
        return self.setting[self.constant.PROJECT_PLAN_PHASE_KEY].find(projectPlanPhase => {
          return id === projectPlanPhase.id
        })
      } else if (type === 'planPhaseCheck') {
        return self.setting[self.constant.PROJECT_PLAN_PHASE_CHECK_KEY].find(projectPlanPhaseCheck => {
          return id === projectPlanPhaseCheck.id
        })
      }
      return null
    }
  }
}
</script>

<style scoped>
.echarts-table {
  height: 200px;
}
</style>
