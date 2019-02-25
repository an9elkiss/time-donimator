<template>
  <div class="be-content taskMangementList">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider flex-space-between">
          <span>条件筛选</span>
          <button class="btn btn-space btn-primary btn-add" @click="routerToEdit">新建</button>
        </div>
        <div class="panel-body">
          <div class="filter">
            <div class="form-inline">
              <div class="form-group">
                <label>任务名称</label>
                <input type="text" class="form-control input-xs" v-model="query.name"/>
              </div>
              <div class="form-group">
                <label>项目名称</label>
                <select class="form-control input-xs" v-model.number="query.project">
                  <option v-for="(option, index) in queryProjectOptions" :key="index" :value="option.id">{{option.value}}</option>
                </select>
              </div>
              <date-range-input id="query" :start="query.planStartTime" :end="query.planEndTime" label='起止日期' type="unnormal" blockClass="" @setRange="setRange(query, 'planStartTime', 'planEndTime', $event)"/>
              <div class="form-group">
                <label>创建人</label>
                <select class="form-control input-xs" v-model.number="query.userId">
                  <option v-for="(option, index) in queryPersonOptions" :key="index" :value="option.id">{{option.name}}</option>
                </select>
              </div>
              <div class="form-group">
                <label>状态</label>
                <select class="form-control input-xs" v-model.number="query.lifecycle">
                  <option value="">全部</option>
                  <option value="1">进行中</option>
                  <option value="2">已完成</option>
                </select>
              </div>
              <div class="form-group">
                <label>优先级</label>
                <select class="form-control input-xs" v-model="query.projectLevel">
                  <option value="">全部</option>
                  <option value="1">1星</option>
                  <option value="2">2星</option>
                  <option value="3">3星</option>
                  <option value="4">4星</option>
                  <option value="5">5星</option>
                </select>
              </div>
            </div>
            <button class="btn btn-space btn-primary btn-add floatRight" @click="submitQueryProjectPlanTracking">搜索</button>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="panel-group accordion plan-accordion" id="plan-accordion-heading">
            <div class="panel panel-default" v-for="(projectPlanTracking, index) in showProjectPlanTrackings" :key="projectPlanTracking.id">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <a data-toggle="collapse" data-parent="#plan-accordion-heading" :href="'#plan-accordion-body-' + projectPlanTracking.id" class="collapsed" @click="projectPlanTracking.clickCount += 1">
                    <i class="icon mdi mdi-chevron-down"></i>{{projectPlanTracking.projectName}} - {{projectPlanTracking.name}} <star-level :value="projectPlanTracking.projectLevel" :clearable="false" :editable="false" :showNull="false" class="inline"></star-level>
                  </a>
                </h4>
              </div>
              <div class="panel-collapse collapse" :id="'plan-accordion-body-' + projectPlanTracking.id">
                <div class="panel-body">
                  <project-plan-panel :trackingSetting="projectPlanTracking" @updateEchartItem="updateEchartItem(index, $event)" @redraw="redraw"></project-plan-panel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import DateRangeInput from '@/components/unit/DateRangeInput'
import ProjectPlanPanel from '@/components/unit/projectPlan/ProjectPlanPanel'
import StarLevel from '@/components/unit/StarLevel'
import { Dialog } from 'vant'

export default {
  name: 'ProjectPlanTracking',
  components: {
    DateRangeInput,
    ProjectPlanPanel,
    StarLevel
  },
  data () {
    return {
      query: {
        name: '',
        project: '',
        planStartTime: null,
        planEndTime: null,
        userId: '',
        lifecycle: '',
        projectLevel: ''
      },
      queryProjectOptions: [{id: '', value: '全部'}],
      queryPersonOptions: [{id: '', name: '全部'}],
      showProjectPlanTrackings: []
    }
  },
  async mounted () {
    // 初始化筛选日期区间为本周
    let now = new Date()
    let nowTime = now.getTime()
    let weekday = now.getDay()
    if (weekday === 0) {
      weekday = 7
    }
    let oneDayTime = 24 * 60 * 60 * 1000
    let startTime = nowTime - weekday * oneDayTime + oneDayTime
    let endTime = startTime + 7 * oneDayTime - oneDayTime

    this.query.planStartTime = this.$global.transformDateString(startTime)
    this.query.planEndTime = this.$global.transformDateString(endTime)

    await this.initQueryProjectOptions()
    await this.initQueryPersonOptions()
    await this.submitQueryProjectPlanTracking()
  },
  async activated () {
    await this.submitQueryProjectPlanTracking()
  },
  methods: {
    async initQueryProjectOptions () {
      let self = this
      let result = await this.$api(Global.url.apiGetCommonType, '', 'GET')
      if (result && result.data.code === 200 && result.data.data.project) {
        self.queryProjectOptions = self.simpleObjectToArray(result.data.data.project)
        self.queryProjectOptions.splice(0, 0, {id: '', value: '全部'})
      }
    },
    async initQueryPersonOptions () {
      let self = this
      let result = await this.$api(Global.url.apiGetAllPersons, '', 'GET')
      if (result && result.data.code === 200 && result.data.data) {
        self.queryPersonOptions = result.data.data.filter(ele => {
          return ele.id !== null
        }).map(ele => {
          return {
            'id': ele.userId,
            'name': ele.name
          }
        })
        self.queryPersonOptions.splice(0, 0, {id: '', name: '全部'})
      }
    },
    async submitQueryProjectPlanTracking () {
      let self = this
      this.showProjectPlanTrackings.splice(0, this.showProjectPlanTrackings.length)
      let queryOption = JSON.parse(JSON.stringify(self.query))
      if (queryOption.planStartTime) {
        queryOption.planStartTime += ' 00:00:00'
      }
      if (queryOption.planEndTime) {
        queryOption.planEndTime += ' 23:59:59'
      }
      let result = await self.$api(Global.url.apiQueryProjectPlanTracking, queryOption, 'POST')
      if (result && result.data.code === 200) {
        self.showProjectPlanTrackings = result.data.data.map(ele => {
          let projectOption = self.queryProjectOptions[ele.project]
          return {
            ...ele,
            projectName: projectOption === undefined ? null : projectOption.value,
            // collapse点击次数，1 发ajax 之后每当单数resize
            clickCount: 0,
            // panel 里面echarts强制更新的标志
            updateFlag: false
          }
        })
      }
    },
    async updateEchartItem (index, {type, postObject}) {
      let self = this
      Dialog.confirm({
        title: '警告',
        message: '确认更新该' + (type === 'check' ? '检查点' : '阶段') + '吗？'
      }).then(async () => {
        let result = null
        if (type === 'check') {
          // 检查点
          postObject.actualCheckTime += ' 12:00:00'
          result = await self.$api(Global.url.apiProjectPlanPhaseCheck + '/' + postObject.id, postObject, 'POST')
        } else if (type === 'phase') {
          // 计划阶段
          postObject.actualStartTime += ' 00:00:00'
          postObject.actualEndTime += ' 23:59:59'
          result = await self.$api(Global.url.apiProjectPlanPhase + '/' + postObject.id, postObject, 'POST')
        }
        self.$global.showResult(result.data)
        // echarts 发送ajax获取最新配置数据
        self.showProjectPlanTrackings[index].updateFlag = !self.showProjectPlanTrackings[index].updateFlag
      })
    },
    redraw () {
      this.submitQueryProjectPlanTracking()
    },
    routerToEdit () {
      this.$router.push({name: 'editProjectPlanTracking'})
    },
    simpleObjectToArray (obj) {
      var arr = []
      for (let i in obj) {
        let o = {}
        o['id'] = i
        o['value'] = obj[i]
        arr.push(o)
      }
      return arr
    },
    setRange (model, startAttr, endAttr, {startDate, endDate}) {
      model[startAttr] = startDate
      model[endAttr] = endDate
    }
  }
}
</script>

<style scoped>
.plan-accordion .panel{
  box-shadow: 0 0 4px 0 rgba(0,0,0,.1);
}
.plan-accordion a.collapsed {
  padding: 10px;
}
@media (min-width: 768px) {
  .filter .form-group {
    width: 16%;
  }
}
</style>
