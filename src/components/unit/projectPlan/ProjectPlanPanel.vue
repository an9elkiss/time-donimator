<template>
  <div class="project-plan-panel">
    <project-plan-chart :planSetting="trackingSetting" :setting="echartSetting" :updateFlag="updateFlag" :tableClass="updateFormFlag ? 'col-md-8' : 'col-md-12'" @updateUpdateFlag="updateUpdateFlag" @itemClicked="echartItemClicked"></project-plan-chart>
    <div class="added">
      <button v-if="trackingSetting.lifecycle === 1" class="btn btn-space btn-primary btn-add" @click="updateCompleteStatus">标记完成</button>
      <button class="btn btn-space btn-primary btn-add" @click="routerToEdit">修改计划</button>
    </div>
    <div class="operation-form center col-md-4" v-if="updateFormFlag">
      <div class="form-group clearfix">
        <label class="col-xs-4 text-right">类型</label>
        <div class="col-xs-8">
          <select class="form-control input-xs" v-model="updateForm.type" disabled>
            <option :value="0">检查点</option>
            <option v-for="(phaseType, key) in $global.projectPlanPhaseType" :key="key" :value="key">{{phaseType}}</option>
          </select>
        </div>
      </div>
      <div class="form-group clearfix" v-if="updateForm.type !== 0">
        <label class="col-xs-4 text-right">计划日期区间</label>
        <div class="col-xs-8">
          <input class="form-control input-xs" :value="getValueFromForm" disabled/>
        </div>
      </div>
      <date-range-input v-if="updateForm.type !== 0" :id="'update-form-date-range' + trackingSetting.id" :start="updateForm.actualStartTime" :end="updateForm.actualEndTime" :inputDivClass="'col-xs-8 ' + (updateFormValidateFlag.actualTimeRange ? '' : 'has-error')" label="实际日期区间" type="normal" opens="left" blockClass="clearfix" labelClass="col-xs-4 text-right" @setRange="setRange(updateForm, 'actualStartTime', 'actualEndTime', $event)"></date-range-input>
      <div :class="'form-group clearfix ' + (updateFormValidateFlag.actualStatus ? '' : 'has-error')" v-if="updateForm.type === 0">
        <label class="col-xs-4 text-right">实际状态</label>
        <div class="col-xs-8">
          <select class="form-control input-xs" v-model="updateForm.actualStatus" @change="updateFormValidateFlag.actualStatus = true">
            <option v-for="(option, index) in checkStatusOptions" :key="index" :value="option.value">{{option.label}}</option>
          </select>
        </div>
      </div>
      <div class="form-group clearfix" v-if="updateForm.type === 0">
        <date-input :value="updateForm.actualCheckTime" :id="'update-form-date' + trackingSetting.id" :inputClass="(updateFormValidateFlag.actualCheckTime ? '' : 'error')" label="实际检查日期" blockClass="clearfix" labelClass="col-xs-4 text-right" inputDivClass="col-xs-8" @updateValue="updateValue"></date-input>
      </div>
      <div class="form-group clearfix">
        <label class="col-xs-4 text-right">描述</label>
        <div class="col-xs-8">
          <textarea class="form-control input-xs" v-model="updateForm.description"></textarea>
        </div>
      </div>
      <button class="btn btn-space btn-primary btn-add" v-if="updateForm.id !== null" @click="updateModel">更新</button>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import ProjectPlanChart from '@/components/unit/projectPlan/ProjectPlanChart'
import DateRangeInput from '@/components/unit/DateRangeInput'
import DateInput from '@/components/unit/DateInput'
import { Dialog } from 'vant'

export default {
  name: 'ProjectPlanPanel',
  components: {
    ProjectPlanChart,
    DateRangeInput,
    DateInput
  },
  props: {
    trackingSetting: Object
  },
  data () {
    return {
      echartSetting: null,
      updateFlag: false,
      updateForm: {
        id: null,
        type: null,
        description: null,
        // 阶段的一些属性
        planStartTime: null,
        planEndTime: null,
        actualStartTime: null,
        actualEndTime: null,
        // 检查点属性
        planCheckTime: null,
        actualCheckTime: null,
        planStatus: null,
        actualStatus: null
      },
      updateFormValidateFlag: {
        id: false,
        actualTimeRange: true,
        actualCheckTime: true,
        actualStatus: true
      },
      checkStatusOptions: [{value: 0, label: '请选择'}]
    }
  },
  computed: {
    updateFormFlag () {
      return this.updateForm.id != null
    },
    clickCount () {
      return this.trackingSetting.clickCount
    },
    getValueFromForm () {
      if (this.updateForm.planStartTime && this.updateForm.planEndTime) {
        return this.updateForm.planStartTime.substr(0, 10) + ' ~ ' + this.updateForm.planEndTime.substr(0, 10)
      }
      return ''
    },
    strengthUpdateFlag () {
      return this.trackingSetting.updateFlag
    }
  },
  watch: {
    async clickCount (value) {
      if (value === 1) {
        // 发送ajax 初始化图表
        this.updateEchartSetting()
      } else if (value > 0 && value % 2 === 1) {
        // 图表resize
        this.updateFlag = true
      } else if (value > 0 && value % 2 === 0) {
        // 收缩时，清空傍边的表单
        this.updateForm.id = null
      }
    },
    async strengthUpdateFlag () {
      // 发送ajax 更新图表
      this.updateEchartSetting()
    },
    updateFormFlag () {
      let self = this
      this.$nextTick(() => {
        self.updateFlag = true
      })
    }
  },
  mounted () {
    this.initCheckStatusOptions()
  },
  methods: {
    async updateEchartSetting () {
      let self = this
      let result = await self.$api(Global.url.apiProjectPlanTracking + '/' + self.trackingSetting.id, '', 'GET')
      if (result && result.data.code === 200) {
        self.echartSetting = result.data.data
        self.updateFlag = true
      }
    },
    updateCompleteStatus () {
      let self = this
      // 更新计划为完成状态
      Dialog.confirm({
        title: '警告',
        message: '确定完成了' + self.trackingSetting.name + '计划吗？'
      }).then(async () => {
        let postObject = {
          id: self.trackingSetting.id,
          lifecycle: 2
        }
        let result = await self.$api(Global.url.apiProjectPlanTracking + '/' + postObject.id, postObject, 'POST')
        self.$global.showResult(result.data)
        if (result && result.data.code === 200) {
          self.$emit('redraw')
        }
      })
    },
    routerToEdit () {
      this.$router.push({name: 'editProjectPlanTracking', params: {id: this.trackingSetting.id}})
    },
    updateModel () {
      let type = 'check'
      let postObject = {}
      postObject.id = this.updateForm.id
      postObject.description = this.updateForm.description
      if (this.updateForm.type === 0) {
        // 检查点
        postObject.planCheckTime = this.updateForm.planCheckTime
        postObject.actualCheckTime = this.updateForm.actualCheckTime
        postObject.actualStatus = this.updateForm.actualStatus
        if (!this.validateForm(postObject, 0)) {
          return
        }
        this.$emit('updateEchartItem', {type: type, postObject: postObject})
        return
      }
      // 计划阶段
      type = 'phase'
      postObject.planStartTime = this.updateForm.planStartTime
      postObject.planEndTime = this.updateForm.planEndTime
      postObject.actualStartTime = this.updateForm.actualStartTime
      postObject.actualEndTime = this.updateForm.actualEndTime
      if (!this.validateForm(postObject, null)) {
        return
      }
      this.$emit('updateEchartItem', {type: type, postObject: postObject})
    },
    echartItemClicked (val) {
      // 清空之前的校验参数信息
      this.initPostFlag()

      this.updateForm.id = val.id
      this.updateForm.description = val.description
      if (val.hasOwnProperty('type')) {
        // 计划阶段
        this.updateForm.type = val.type
        this.updateForm.planStartTime = val.planStartTime
        this.updateForm.planEndTime = val.planEndTime
        this.updateForm.actualStartTime = this.$global.transformDateString(val.actualStartTime)
        this.updateForm.actualEndTime = this.$global.transformDateString(val.actualEndTime)

        // 清空检查点的配置
        this.updateForm.planCheckTime = null
        this.updateForm.planStatus = ''
        this.updateForm.actualCheckTime = null
        this.updateForm.actualStatus = ''
        return
      }
      // 检查点
      this.updateForm.type = 0
      this.updateForm.planCheckTime = val.planCheckTime
      this.updateForm.actualCheckTime = this.$global.transformDateString(val.actualCheckTime)
      this.updateForm.planStatus = val.planStatus
      this.updateForm.actualStatus = val.actualStatus === null ? 0 : val.actualStatus

      // 清空计划阶段的配置
      this.updateForm.planStartTime = null
      this.updateForm.planEndTime = null
      this.updateForm.actualStartTime = null
      this.updateForm.actualEndTime = null
    },
    validateForm (postObject, type) {
      let result = true
      if (type === 0) {
        // 检查点的校验
        if (!postObject.actualCheckTime) {
          this.updateFormValidateFlag.actualCheckTime = false
          result = false
        }
        if (!postObject.actualStatus) {
          this.updateFormValidateFlag.actualStatus = false
          result = false
        }
      } else {
        // 计划阶段的校验
        if (!postObject.actualStartTime || !postObject.actualEndTime) {
          this.updateFormValidateFlag.actualTimeRange = false
          result = false
        }
      }
      if (!result) {
        this.$global.showMessage('请输入红色标注的表单信息')
      }
      return result
    },
    setRange (model, startAttr, endAttr, {startDate, endDate}) {
      if (startDate && endDate) {
        this.updateFormValidateFlag.actualTimeRange = true
      }
      model[startAttr] = startDate
      model[endAttr] = endDate
    },
    updateValue (val) {
      if (val) {
        this.updateFormValidateFlag.actualCheckTime = true
      }
      this.updateForm.actualCheckTime = val
    },
    updateUpdateFlag () {
      this.updateFlag = false
    },
    initPostFlag () {
      for (let attr in this.updateFormValidateFlag) {
        this.updateFormValidateFlag[attr] = true
      }
    },
    initCheckStatusOptions () {
      for (let attr in this.$global.projectPlanPhaseCheckStatusType) {
        this.checkStatusOptions.push({
          value: attr,
          label: this.$global.projectPlanPhaseCheckStatusType[attr]
        })
      }
    }
  }
}
</script>

<style scoped>
.project-plan-panel {
  position: relative;
}
.operation-form {
  border: solid 1px rgba(222,222,222, .8);
  padding: 10px;
}
.form-group.clearfix {
  margin-bottom: 5px;
}
.added {
  position: absolute;
  right: 0;
  top: -45px;
}
</style>
