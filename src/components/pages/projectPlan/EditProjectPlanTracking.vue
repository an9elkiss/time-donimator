<template>
  <div class="be-content taskMangementList">
    <div class="main-content container-fluid">
      <!-- 任务计划 -->
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider flex-space-between">
          <span class="pointer" data-toggle="collapse" data-target="#projectPlanPanelBody">任务计划</span>
          <div class="operate-buttons">
            <button class="btn btn-space btn-primary btn-add" v-if="null === projectPlanPanelModel.id" @click="saveProjectPlanPanel">保存</button>
            <!-- 有id的更新保存 -->
            <button class="btn btn-space btn-primary btn-add" v-if="null !== projectPlanPanelModel.id" @click="updateProjectPlanPanel">保存</button>
            <button class="btn btn-space btn-primary btn-add" v-if="null !== projectPlanPanelModel.id" @click="deleteProjectPlanPanel">删除</button>
            <button class="btn btn-space btn-primary btn-add" @click="goBack">返回</button>
          </div>
        </div>
        <div id="projectPlanPanelBody" class="panel-body collapse in">
          <div class="col-sm-4">
            <div class="form-group clearfix">
              <label class="col-xs-4 text-right">任务名称</label>
              <div :class="'col-xs-8 ' + (projectPlanPanelSubmitFlag.name ? '' : 'has-error')">
                <input class="form-control input-xs" placeholder="任务名称" autocomplete="off" v-model="projectPlanPanelModel.name" @input="projectPlanPanelSubmitFlag.name = true"/>
              </div>
            </div>
            <div :class="'form-group clearfix ' + (projectPlanPanelSubmitFlag.project ? '' : 'has-error')">
              <label class="col-xs-4 text-right">项目</label>
              <div class="col-xs-8">
                <select class="form-control input-xs" v-model="projectPlanPanelModel.project" @change="projectPlanPanelSubmitFlag.project = true">
                  <option v-for="(option, index) in queryProjectOptions" :key="index" :value="option.id">{{option.value}}</option>
                </select>
              </div>
            </div>
            <date-range-input id="projectPlanPanelModel" :start="projectPlanPanelModel.planStartTime" :end="projectPlanPanelModel.planEndTime" type="normal" label="计划起止日期" blockClass="clearfix" labelClass="col-xs-4 text-right" :inputDivClass="'col-xs-8 ' + (projectPlanPanelSubmitFlag.planDateRange ? '' : 'has-error')" @setRange="setRange(projectPlanPanelModel, 'planStartTime', 'planEndTime', $event)"></date-range-input>
          </div>
          <div class="col-sm-4">
              <div class="form-group clearfix">
              <label class="col-xs-4 text-right">优先级</label>
              <star-level :value="projectPlanPanelModel.projectLevel" :clearable="false" class="col-xs-8" @click="projectPlanPanelModel.projectLevel = $event"></star-level>
            </div>
            <div class="form-group clearfix">
              <label class="col-xs-4 text-right">描述</label>
              <div class="col-xs-8">
                <textarea class="form-control input-xs" rows="5" v-model="projectPlanPanelModel.description"></textarea>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group clearfix" v-if="projectPlanPanelModel.userName">
              <label class="col-xs-4 text-right">创建人</label>
              <div class="col-xs-8">
                <input class="form-control input-xs" placeholder="创建人" autocomplete="off" disabled v-model="projectPlanPanelModel.userName"/>
              </div>
            </div>
            <div class="form-group clearfix" v-if="projectPlanPanelModel.id">
              <label class="col-xs-4 text-right">状态</label>
              <div class="col-xs-8">
                <select class="form-control input-xs" v-model="projectPlanPanelModel.lifecycle">
                  <option :value="1">进行中</option>
                  <option :value="2">已完成</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 任务图表 -->
      <div class="panel panel-default" v-if="projectPlanPanelModel.id !== null">
        <div class="panel-heading panel-heading-divider flex-space-between">
          <span class="pointer" data-toggle="collapse" data-target="#projectPlanChartBody">进度图设计</span>
          <div class="operate-buttons">
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPanelModel.id !== null" @click="addProjectCheckPhase">新增阶段</button>
          </div>
        </div>
        <div id="projectPlanChartBody" class="panel-body collapse in">
          <project-plan-chart :planSetting="orginProjectPlan" :setting="projectPlanChartSetting" :updateFlag="projectPlanChartUpdateFlag"  @updateUpdateFlag="updateUpdateFlag" @itemClicked="echartItemClicked"></project-plan-chart>
        </div>
      </div>
      <!-- 任务时间段 -->
      <div class="panel panel-default" v-if="projectPlanPhasePanelShowFlag">
        <div class="panel-heading panel-heading-divider flex-space-between">
          <span class="pointer" data-toggle="collapse" data-target="#projectPlanPhaseBody">阶段数据</span>
          <div class="operate-buttons">
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPhaseModel.id !== null && projectPlanPhaseModel.type === 1" @click="addProjectPlanPhaseCheck">新增检查点</button>
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPhaseModel.id === null" @click="saveProjectPlanPhase">保存</button>
            <!-- 有id的更新保存 -->
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPhaseModel.id !== null" @click="updateProjectPlanPhase">保存</button>
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPhaseModel.id !== null" @click="deleteProjectPlanPhase">删除</button>
          </div>
        </div>
        <div class="panel-body collapse in" id="projectPlanPhaseBody">
          <div class="col-sm-4">
            <div :class="'form-group clearfix ' + (projectPlanPhaseSubmitFlag.type ? '' : 'has-error')">
              <label class="col-xs-4 text-right">阶段类型</label>
              <div class="col-xs-8">
                <select class="form-control input-xs" v-model="projectPlanPhaseModel.type" @change="projectPlanPhaseSubmitFlag.type = true">
                  <option value="">请选择</option>
                  <option v-for="(option, key) in $global.projectPlanPhaseType" :key="key" :value="key">{{option}}</option>
                </select>
              </div>
            </div>
            <date-range-input id="projectPlanPhaseModel" :start="projectPlanPhaseModel.planStartTime" :end="projectPlanPhaseModel.planEndTime" type="normal" label="计划起止日期" blockClass="clearfix" labelClass="col-xs-4 text-right" :inputDivClass="'col-xs-8 ' + (projectPlanPhaseSubmitFlag.planDateRange ? '' : 'has-error')" @setRange="setRange(projectPlanPhaseModel, 'planStartTime', 'planEndTime', $event)"></date-range-input>
          </div>
          <div class="col-sm-4">
            <div class="form-group clearfix">
              <label class="col-xs-4 text-right">描述</label>
              <div class="col-xs-8">
                <textarea class="form-control input-xs" rows="5" v-model="projectPlanPhaseModel.description"></textarea>
              </div>
            </div>
          </div>
          <div class="col-sm-4"></div>
        </div>
      </div>
      <!-- 任务检查点 -->
      <div class="panel panel-default" v-if="projectPlanPhaseCheckPanelShowFlag">
        <div class="panel-heading panel-heading-divider flex-space-between">
          <span class="pointer" data-toggle="collapse" data-target="#projectPlanCheckBody">检查点数据</span>
          <div class="operate-buttons">
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPhaseCheckModel.id === null" @click="saveProjectPlanPhaseCheck">保存</button>
            <!-- 有id的更新保存 -->
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPhaseCheckModel.id !== null" @click="updateProjectPlanPhaseCheck">保存</button>
            <button class="btn btn-space btn-primary btn-add" v-if="projectPlanPhaseCheckModel.id !== null" @click="deleteProjectPlanPhaseCheck">删除</button>
          </div>
        </div>
        <div class="panel-body collapse in" id="projectPlanCheckBody">
          <div class="col-sm-4">
            <date-input :value="projectPlanPhaseCheckModel.planCheckTime" :inputClass="(projectPlanPhaseCheckSubmitFlag.planCheckTime ? '' : 'error')" id="projectPlanPhaseCheckModel" label="计划检查日期" blockClass="clearfix" labelClass="col-xs-4 text-right" inputDivClass="col-xs-8" @updateValue="updateValue(projectPlanPhaseCheckModel, 'planCheckTime', $event)"></date-input>
            <div :class="'form-group clearfix ' + (projectPlanPhaseCheckSubmitFlag.planStatus ? '' : 'has-error')">
              <label class="col-xs-4 text-right">计划状态</label>
              <div class="col-xs-8">
                <select class="form-control input-xs" v-model="projectPlanPhaseCheckModel.planStatus" @change="projectPlanPhaseCheckSubmitFlag.planStatus = true">
                  <option value="">请选择</option>
                  <option v-for="(option, key) in $global.projectPlanPhaseCheckStatusType" :key="key" :value="key">{{option}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group clearfix">
              <label class="col-xs-4 text-right">描述</label>
              <div class="col-xs-8">
                <textarea class="form-control input-xs" rows="5" v-model="projectPlanPhaseCheckModel.description"></textarea>
              </div>
            </div>
          </div>
          <div class="col-sm-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import DateRangeInput from '@/components/unit/DateRangeInput'
import ProjectPlanChart from '@/components/unit/projectPlan/ProjectPlanChart'
import DateInput from '@/components/unit/DateInput'
import StarLevel from '@/components/unit/StarLevel'
import { Dialog } from 'vant'

export default {
  name: 'EditProjectPlanTracking',
  components: {
    DateRangeInput,
    DateInput,
    ProjectPlanChart,
    StarLevel
  },
  data () {
    return {
      projectPlanPanelModel: {
        id: null,
        name: '',
        project: '',
        planStartTime: null,
        planEndTime: null,
        projectLevel: 0,
        description: '',
        userName: null,
        lifecycle: 0
      },
      projectPlanPanelSubmitFlag: {
        name: true,
        project: true,
        planDateRange: true,
        projectLevel: true
      },
      orginProjectPlan: null,
      queryProjectOptions: [{id: '', value: '请选择'}],
      projectPlanChartSetting: null,
      projectPlanChartUpdateFlag: false,
      projectPlanPhasePanelShowFlag: false,
      projectPlanPhaseCheckPanelShowFlag: false,
      flags: {
        updateFlag: false
      },
      projectPlanPhaseModel: {
        id: null,
        planTrackingId: null,
        type: '',
        planStartTime: '',
        planEndTime: '',
        description: ''
      },
      projectPlanPhaseSubmitFlag: {
        type: true,
        planDateRange: true
      },
      projectPlanPhaseCheckModel: {
        id: null,
        planPhaseId: null,
        planCheckTime: '',
        planStatus: '',
        description: ''
      },
      projectPlanPhaseCheckSubmitFlag: {
        planCheckTime: true,
        planStatus: true
      }
    }
  },
  async mounted () {
    let self = this
    if (self.$route.params.hasOwnProperty('id')) {
      self.flags.updateFlag = true
      await self.initOriginProjectPlan(self.$route.params.id)
      self.initModel(self.orginProjectPlan)
      self.initProjectPlanTrackingChart()
    }
    self.initQueryProjectOptions()
  },
  methods: {
    async initOriginProjectPlan (id) {
      let result = await this.$api(Global.url.apiQueryProjectPlanTracking, {id: id}, 'POST')
      if (result && result.data.code === 200) {
        if (result.data.data.length !== 1) {
          this.$global.showMessage('没有找到相关数据')
          this.$router.go(-1)
          return
        }
        this.orginProjectPlan = result.data.data[0]
      }
    },
    async initQueryProjectOptions () {
      let self = this
      let result = await this.$api(Global.url.apiGetCommonType, '', 'GET')
      if (result && result.data.code === 200 && result.data.data.project) {
        self.queryProjectOptions = self.simpleObjectToArray(result.data.data.project)
        self.queryProjectOptions.splice(0, 0, {id: '', value: '请选择'})
      }
    },
    async saveProjectPlanPanel () {
      let self = this
      if (!this.validateProjectPlanModel()) {
        return
      }
      let postObject = JSON.parse(JSON.stringify(self.projectPlanPanelModel))
      postObject.planStartTime += ' 00:00:00'
      postObject.planEndTime += ' 23:59:59'
      let result = await self.$api(Global.url.apiProjectPlanTracking, postObject, 'POST')
      self.$global.showResult(result.data)
      if (result && result.data.code === 200) {
        self.initModel(result.data.data)
        self.updateOriginPlan(result.data.data)
        await self.initProjectPlanTrackingChart()
      }
    },
    async updateProjectPlanPanel () {
      let self = this
      if (!this.validateProjectPlanModel()) {
        return
      }
      Dialog.confirm({
        title: '警告',
        message: '确定要更新' + self.projectPlanPanelModel.name + '计划吗？'
      }).then(async () => {
        let postObject = JSON.parse(JSON.stringify(self.projectPlanPanelModel))
        postObject.planStartTime += ' 00:00:00'
        postObject.planEndTime += ' 23:59:59'
        let result = await self.$api(Global.url.apiProjectPlanTracking + '/' + self.projectPlanPanelModel.id, postObject, 'POST')
        self.$global.showResult(result.data)
        if (result && result.data.code === 200) {
          self.initModel(result.data.data)
          self.updateOriginPlan(result.data.data)
          // 更新图的显示
          self.initProjectPlanTrackingChart()
        }
      })
    },
    async deleteProjectPlanPanel () {
      let self = this
      Dialog.confirm({
        title: '警告',
        message: '确定要删除' + self.projectPlanPanelModel.name + '计划吗？'
      }).then(async () => {
        let result = await self.$api(Global.url.apiProjectPlanTracking + '/' + self.projectPlanPanelModel.id, '', 'DELETE')
        self.$global.showResult(result.data)
        if (result && result.data.code === 200) {
          self.goBack()
        }
      })
    },
    async saveProjectPlanPhase () {
      let self = this
      if (!this.validateProjectPlanPhaseModel()) {
        return
      }
      let postObject = JSON.parse(JSON.stringify(self.projectPlanPhaseModel))
      postObject.planStartTime += ' 00:00:00'
      postObject.planEndTime += ' 23:59:59'
      let result = await self.$api(Global.url.apiProjectPlanPhase, postObject, 'POST')
      self.$global.showResult(result.data)
      if (result && result.data.code === 200) {
        // 输入表单隐藏
        self.projectPlanPhasePanelShowFlag = false
        // 重新发送ajax获取最新数据
        self.initProjectPlanTrackingChart()
        self.projectPlanChartUpdateFlag = true
      }
    },
    async updateProjectPlanPhase () {
      let self = this
      if (!this.validateProjectPlanPhaseModel()) {
        return
      }
      Dialog.confirm({
        title: '警告',
        message: '确定要更新该计划阶段吗？'
      }).then(async () => {
        let postObject = JSON.parse(JSON.stringify(self.projectPlanPhaseModel))
        postObject.planStartTime += ' 00:00:00'
        postObject.planEndTime += ' 23:59:59'
        delete postObject.planTrackingId
        let result = await self.$api(Global.url.apiProjectPlanPhase + '/' + self.projectPlanPhaseModel.id, postObject, 'POST')
        self.$global.showResult(result.data)
        if (result && result.data.code === 200) {
          // 输入表单隐藏
          self.projectPlanPhasePanelShowFlag = false
          // 重新发送ajax获取最新数据
          self.initProjectPlanTrackingChart()
          self.projectPlanChartUpdateFlag = true
        }
      })
    },
    async deleteProjectPlanPhase () {
      let self = this
      Dialog.confirm({
        title: '警告',
        message: '确定要删除该计划阶段吗？'
      }).then(async () => {
        let result = await self.$api(Global.url.apiProjectPlanPhase + '/' + self.projectPlanPhaseModel.id, '', 'DELETE')
        self.$global.showResult(result.data)
        if (result && result.data.code === 200) {
          // 输入表单隐藏
          self.projectPlanPhasePanelShowFlag = false
          // 重新发送ajax获取最新数据
          self.initProjectPlanTrackingChart()
          self.projectPlanChartUpdateFlag = true
        }
      })
    },
    async saveProjectPlanPhaseCheck () {
      let self = this
      if (!this.validateProjectPlanPhaseCheckModel()) {
        return
      }
      let postObject = JSON.parse(JSON.stringify(self.projectPlanPhaseCheckModel))
      postObject.planCheckTime += ' 00:00:00'
      let result = await self.$api(Global.url.apiProjectPlanPhaseCheck, postObject, 'POST')
      self.$global.showResult(result.data)
      if (result && result.data.code === 200) {
        // 输入表单隐藏
        self.projectPlanPhaseCheckPanelShowFlag = false
        // 重新发送 Ajax获取最新数据
        self.initProjectPlanTrackingChart()
        self.projectPlanChartUpdateFlag = true
      }
    },
    async updateProjectPlanPhaseCheck () {
      let self = this
      if (!this.validateProjectPlanPhaseCheckModel()) {
        return
      }
      Dialog.confirm({
        title: '警告',
        message: '确定要更新该检查点吗？'
      }).then(async () => {
        let postObject = JSON.parse(JSON.stringify(self.projectPlanPhaseCheckModel))
        postObject.planCheckTime += ' 00:00:00'
        let result = await self.$api(Global.url.apiProjectPlanPhaseCheck + '/' + self.projectPlanPhaseCheckModel.id, postObject, 'POST')
        self.$global.showResult(result.data)
        if (result && result.data.code === 200) {
          // 输入表单隐藏
          self.projectPlanPhaseCheckPanelShowFlag = false
          // 重新发送 Ajax获取最新数据
          self.initProjectPlanTrackingChart()
          self.projectPlanChartUpdateFlag = true
        }
      })
    },
    async deleteProjectPlanPhaseCheck () {
      let self = this
      Dialog.confirm({
        title: '警告',
        message: '确定要删除该检查点吗？'
      }).then(async () => {
        let result = await self.$api(Global.url.apiProjectPlanPhaseCheck + '/' + self.projectPlanPhaseCheckModel.id, '', 'DELETE')
        self.$global.showResult(result.data)
        if (result && result.data.code === 200) {
          // 输入表单隐藏
          self.projectPlanPhaseCheckPanelShowFlag = false
          // 重新发送 Ajax获取最新数据
          self.initProjectPlanTrackingChart()
          self.projectPlanChartUpdateFlag = true
        }
      })
    },
    async initProjectPlanTrackingChart () {
      let self = this
      if (self.projectPlanPanelModel.id === null) {
        return
      }
      let result = await this.$api(Global.url.apiProjectPlanTracking + '/' + self.projectPlanPanelModel.id, '', 'GET')
      if (result && result.data.code === 200) {
        self.projectPlanChartSetting = result.data.data
        self.projectPlanChartUpdateFlag = true
      }
    },
    validateProjectPlanModel () {
      let result = true
      // 清空标志
      this.initProjectPlanSubmitFlag()
      if (this.projectPlanPanelModel.name === null || this.projectPlanPanelModel.name === '') {
        this.projectPlanPanelSubmitFlag.name = false
        result = false
      }
      if (this.projectPlanPanelModel.project === null || this.projectPlanPanelModel.project === '') {
        this.projectPlanPanelSubmitFlag.project = false
        result = false
      }
      if (!this.projectPlanPanelModel.planStartTime || !this.projectPlanPanelModel.planEndTime) {
        this.projectPlanPanelSubmitFlag.planDateRange = false
        result = false
      }
      if (this.projectPlanPanelModel.projectLevel === null || this.projectPlanPanelModel.projectLevel === '' || this.projectPlanPanelModel.projectLevel === 0) {
        this.projectPlanPanelSubmitFlag.projectLevel = false
      }
      if (!result && !this.projectPlanPanelSubmitFlag.projectLevel) {
        this.$global.showMessage('请输入红色标注的表单信息和优先级')
      } else if (!result && this.projectPlanPanelSubmitFlag.projectLevel) {
        this.$global.showMessage('请输入红色标注的表单信息')
      } else if (result && !this.projectPlanPanelSubmitFlag.projectLevel) {
        this.$global.showMessage('请输入计划优先级')
      }
      return result && this.projectPlanPanelSubmitFlag.projectLevel
    },
    validateProjectPlanPhaseModel () {
      let result = true
      if (!this.projectPlanPhaseModel.type) {
        this.projectPlanPhaseSubmitFlag.type = false
        result = false
      }
      if (!this.projectPlanPhaseModel.planStartTime || !this.projectPlanPhaseModel.planEndTime) {
        this.projectPlanPhaseSubmitFlag.planDateRange = false
        result = false
      }
      if (!result) {
        this.$global.showMessage('请输入红色标注的表单信息')
      }
      return result
    },
    validateProjectPlanPhaseCheckModel () {
      let result = true
      if (!this.projectPlanPhaseCheckModel.planCheckTime) {
        this.projectPlanPhaseCheckSubmitFlag.planCheckTime = false
        result = false
      }
      if (!this.projectPlanPhaseCheckModel.planStatus) {
        this.projectPlanPhaseCheckSubmitFlag.planStatus = false
        result = false
      }
      if (!result) {
        this.$global.showMessage('请输入红色标注的表单信息')
      }
      return result
    },
    addProjectCheckPhase () {
      let parentId = this.projectPlanPanelModel.id
      this.projectPlanPhasePanelShowFlag = true
      this.initProjectPlanPhase(parentId)
    },
    addProjectPlanPhaseCheck () {
      let parentId = this.projectPlanPhaseModel.id
      this.projectPlanPhaseCheckPanelShowFlag = true
      this.initProjectPlanPhaseCheck(parentId)
    },
    setRange (model, startAttr, endAttr, {startDate, endDate}) {
      // 表单参数校验
      if (model === this.projectPlanPanelModel) {
        if (startDate && endDate) {
          this.projectPlanPanelSubmitFlag.planDateRange = true
        }
      } else if (model === this.projectPlanPhaseModel) {
        if (startDate && endDate) {
          this.projectPlanPhaseSubmitFlag.planDateRange = true
        }
      }

      model[startAttr] = startDate
      model[endAttr] = endDate
    },
    goBack () {
      if (window.history.length > 1) {
        this.$router.go(-1)
        return
      }
      this.$router.push({name: 'projectPlanTracking'})
    },
    echartItemClicked (val) {
      // 准备显示修改panel
      if (val.hasOwnProperty('type')) {
        // 计划阶段
        this.projectPlanPhaseModel.id = val.id
        this.projectPlanPhaseModel.description = val.description
        this.projectPlanPhaseModel.type = val.type
        this.projectPlanPhaseModel.planStartTime = this.$global.transformDateString(val.planStartTime)
        this.projectPlanPhaseModel.planEndTime = this.$global.transformDateString(val.planEndTime)
        // this.projectPlanPhaseModel.actualStartTime = val.actualStartTime
        // this.projectPlanPhaseModel.actualEndTime = val.actualEndTime
        this.projectPlanPhasePanelShowFlag = true
        this.projectPlanPhaseCheckPanelShowFlag = false
        return
      }
      // 检查点
      this.projectPlanPhaseCheckModel.id = val.id
      this.projectPlanPhaseCheckModel.description = val.description
      this.projectPlanPhaseCheckModel.planCheckTime = this.$global.transformDateString(val.planCheckTime)
      // this.projectPlanPhaseCheckModel.actualCheckTime = val.actualCheckTime === null ? '' : val.actualCheckTime
      this.projectPlanPhaseCheckModel.planStatus = val.planStatus === null ? '' : val.planStatus
      // this.projectPlanPhaseCheckModel.actualStatus = val.actualStatus === null ? 0 : val.actualStatus
      this.projectPlanPhaseCheckPanelShowFlag = true
      this.projectPlanPhasePanelShowFlag = false
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
    initProjectPlanPhaseCheck (parentId) {
      this.projectPlanPhaseCheckModel.id = null
      this.projectPlanPhaseCheckModel.planPhaseId = parentId
      this.projectPlanPhaseCheckModel.planCheckTime = ''
      this.projectPlanPhaseCheckModel.planStatus = ''
      this.projectPlanPhaseCheckModel.description = ''
    },
    initProjectPlanPhase (parentId) {
      this.projectPlanPhaseModel.id = null
      this.projectPlanPhaseModel.planTrackingId = parentId
      this.projectPlanPhaseModel.type = ''
      this.projectPlanPhaseModel.planStartTime = ''
      this.projectPlanPhaseModel.planEndTime = ''
      this.projectPlanPhaseModel.description = ''
    },
    initModel (params) {
      this.projectPlanPanelModel.id = params.id
      this.projectPlanPanelModel.name = params.name
      this.projectPlanPanelModel.project = params.project
      this.projectPlanPanelModel.planStartTime = params.planStartTime.substr(0, 10)
      this.projectPlanPanelModel.planEndTime = params.planEndTime.substr(0, 10)
      this.projectPlanPanelModel.projectLevel = params.projectLevel
      this.projectPlanPanelModel.description = params.description
      this.projectPlanPanelModel.userName = params.userName
      this.projectPlanPanelModel.lifecycle = params.lifecycle
    },
    initProjectPlanSubmitFlag () {
      this.projectPlanPanelSubmitFlag.name = true
      this.projectPlanPanelSubmitFlag.project = true
      this.projectPlanPanelSubmitFlag.projectLevel = true
      this.projectPlanPanelSubmitFlag.planDateRange = true
    },
    initProjectPlanPhaseSubmitFlag () {
      this.projectPlanPhaseSubmitFlag.planDateRange = true
      this.projectPlanPhaseSubmitFlag.type = true
    },
    initProjectPlanPhaseCheckSubmitFlag () {
      this.projectPlanPhaseCheckSubmitFlag.planCheckTime = true
      this.projectPlanPhaseCheckSubmitFlag.planStatus = true
    },
    updateUpdateFlag () {
      this.projectPlanChartUpdateFlag = false
    },
    updateValue (model, attr, val) {
      // 校验更新
      if (val) {
        this.projectPlanPhaseCheckSubmitFlag.planCheckTime = true
      }

      model[attr] = val
    },
    updateOriginPlan (val) {
      this.orginProjectPlan = JSON.parse(JSON.stringify(val))
    }
  }
}
</script>

<style scoped>
span.pointer {
  cursor: pointer;
}
</style>
