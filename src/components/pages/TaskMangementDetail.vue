<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel">
        <div class="panel-heading panel-heading-divider cfix"><span class="fLeft">{{task.task.userName}}</span><span class="fRight">{{nowDateString}}</span></div>
        <div class="panel-body">
          <form action="#" class="form-horizontal group-border-dashed">
            <div class="form-group">
              <label class="col-sm-3 control-label">任务名称</label>
              <div class="col-sm-6">
                <input type="text" required="" placeholder="任务名称" class="form-control input-sm" v-model="task.task.title" @keydown.enter.prevent>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">父任务</label>
              <div class="col-sm-6" style=" text-align:left; padding: 0 12px;">
                <div class="be-radio inline">
                  <input type="radio" v-model="isParentFlag" required="" value="true" id="radio1" @change="parentChange"/>
                  <label for="radio1">是</label>
                </div>
                <div class="be-radio inline">
                  <input type="radio" v-model="isParentFlag" required="" value='false' id="radio2" @change="parentChange" checked/>
                  <label for="radio2">否</label>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="isParentFlag === 'false'">
              <label class="col-sm-3 control-label">选择父任务</label>
              <div class="col-sm-6">
                <p class="disabledP" v-if="isDisabled && task.task.parentTitle">{{task.task.parentTitle}}</p>
                <select class="form-control input-sm" v-model="task.task.parentId" @change="initialProjectResource" v-else>
                  <option value="">未选择</option>
                  <option v-for="(project, index) of task.parentProject" :key="index" :value="project.id">{{project.title}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">项目名称</label>
              <div class="col-sm-6">
                <select class="form-control input-sm" v-model="task.task.project" required="" :disabled="isDisabled">
                  <option value="">未选择</option>
                  <option v-for="(value, key) of task.project" :key="key" :value="key"> {{value}} </option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">任务类型</label>
              <div class="col-sm-6 cfix">
                <clickable-button v-for="(value, key) of task.tag" :key="key" :value="value" :index="key" :activeFlag="buttonStatus(key)" @buttonClicked="buttonClicked"></clickable-button>
                <new-button id="newButton" :isClicked="isClicked" @addNewTag="addNewTag" @buttonClicked="isClicked = !isClicked">标签</new-button>
                <input v-model="task.task.tags" required="" class="placeholder">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">任务内容</label>
              <div class="col-sm-6">
                <textarea class="form-control input-sm" v-model="task.task.description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">贡献值</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" required="" placeholder="贡献值" class="form-control input-sm" v-model="task.task.planScore" @input="inspectNum('planScore')" @keydown.enter.prevent>
              </div>
              <div class="remind" v-if="this.task.task.parentId && isParentScore">
                <span>贡献值不得超过{{task.parentScore}}</span>
              </div>
            </div>
            <div class="form-group" v-if="$route.params.flag">
              <label class="col-sm-3 control-label">实际值</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" placeholder="实际值" class="form-control input-sm" v-model="task.task.actualScore" @keydown.enter.prevent>
              </div>
              <div class="remind" v-if="isNaN(Number(this.task.task.actualScore)) || Number(this.task.task.actualScore) < 0">
                <span>实际值不得小于0小时</span>
              </div>
            </div>
            <div class="form-group" v-if="$route.params.flag">
              <label class="col-sm-3 control-label">当期状态</label>
              <div class="col-sm-6">
                <select class="form-control input-sm" v-model="task.task.currentStatus">
                  <option value="">未选择</option>
                  <option v-for="(value, key) of task.status" :key="key" :value="key">{{value}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">计划状态</label>
              <div class="col-sm-6">
                <select class="form-control input-sm" v-model="task.task.planStatus" required="">
                  <option value="">未选择</option>
                  <option v-for="(value, key) of task.status" :key="key" :value="key">{{value}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">计划日期</label>
              <div class="col-md-6">
                <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker">
                  <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input size="16" type="text" required="" ref="inputTimer" value="" class="form-control input-sm" style="z-index: 0" @keydown.enter.prevent>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">预估工时</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" required="" placeholder="预估工时" class="form-control input-sm" v-model="task.task.planHours" @input="inspectNum('planHours')" @keydown.enter.prevent>
              </div>
              <div class="remind" v-if="task.task.parentId && isParentHours">
                <span>预估工时不得超过{{task.parentHours}}小时</span>
              </div>
            </div>
            <div class="form-group" v-if="$route.params.flag">
              <label class="col-sm-3 control-label">实际工时</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" placeholder="实际工时" class="form-control input-sm" v-model="task.task.actualHours" @keydown.enter.prevent>
              </div>
              <div class="remind" v-if="isNaN(Number(this.task.task.actualHours)) || Number(this.task.task.actualHours) < 0">
                <span>实际工时不得小于0小时</span>
              </div>
            </div>
            <div class="form-group">
              <div class="center">
                <button class="btn btn-space btn-primary" @click="submitTask">提交</button>
                <button class="btn btn-space btn-primary" @click="goBack">返回</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
import Global from '@/components/Global'
import ClickableButton from '@/components/unit/ClickableButton'
import NewButton from '@/components/unit/NewButton'
import { Toast } from 'vant'

export default {
  data () {
    return {
      task: {
        parentIdCopy: '',
        projectCopy: '',
        project: {},
        status: {},
        tag: {},
        parentProject: [],
        parentHours: '',
        parentScore: '',
        task: {
          title: '',
          project: '',
          tags: '',
          description: '',
          planScore: 0,
          actualScore: '',
          currentStatus: '',
          planStatus: '',
          parentId: '',
          isParent: null,
          endTime: '',
          planHours: '',
          actualHours: '',
          percent: '',
          level: '',
          userId: '',
          userName: ''
        },
        num1: 0,
        num2: 1,
        state1: '未完成',
        state2: '已完成',
        date: '',
        time1: 2,
        time2: 1,
        time3: 1,
        selectedType: []
      },
      isParentFlag: 'false',
      taskWeekId: 0,
      operatingResult: {
        message: '',
        code: ''
      },
      isClicked: false,
      isTrue: false,
      isParentHours: false,
      isParentScore: false,
      isDisabled: false
    }
  },
  components: {
    ClickableButton,
    NewButton
  },
  computed: {
    ...mapState({
      personMsg: 'person',
      taskMsg: 'task',
      nowDateString: 'selectedDate'
    })
  },
  mounted () {
    window.$(document).ready(function () {
      window.App.init()
      window.App.formElements()
    })
    this.init()
    this.initialProjectStatusAndTag()
    this.initialParentProjectList()
  },
  methods: {
    parentChange () {
      var t = this
      if (t.isParentFlag === 'false') {
        if (t.task.task.parentId && t.task.task.parentTitle) {
          t.isDisabled = true
        } else {
          t.isDisabled = false
        }
        t.task.task.parentId = t.task.parentIdCopy
        t.task.task.project = t.task.projectCopy
      } else {
        t.isDisabled = false
      }
    },
    inspectNum (flag) {
      if (flag === 'planHours') {
        if ((this.task.task.parentId && this.task.parentHours < this.task.task.planHours) || isNaN(Number(this.task.task.planHours)) || Number(this.task.task.planHours) <= 0) {
          this.isParentHours = true
          this.task.task.planHours = ''
        } else {
          this.isParentHours = false
        }
      } else {
        if ((this.task.task.parentId && this.task.parentScore < this.task.task.planScore) || isNaN(Number(this.task.task.planScore)) || Number(this.task.task.planScore) < 0) {
          this.isParentScore = true
          this.task.task.planScore = ''
        } else {
          this.isParentScore = false
        }
      }
    },
    buttonClicked (index) {
      if (this.task.selectedType.indexOf(index) >= 0) {
        this.task.selectedType.splice(this.task.selectedType.indexOf(index), 1)
      } else {
        this.task.selectedType.push(index)
      }
      this.task.task.tags = this.tagsArrayToString()
    },
    buttonStatus (index) {
      if (this.task.selectedType.indexOf(index) >= 0) {
        return true
      }
      return false
    },
    tagsArrayToString () {
      return this.task.selectedType.toString()
    },
    goBack () {
      this.$router.push({
        name: 'TaskMangementList'
      })
    },
    init () {
      var t = this
      t.task.task.userName = t.personMsg.name
      t.task.task.userId = t.personMsg.userId
      t.task.task.level = t.personMsg.level
      t.task.task.percent = t.personMsg.percent
      t.taskWeekId = t.$route.params.id
      if (t.taskWeekId) {
        t.getTask()
      }
    },
    async getTask () {
      var t = this
      const result = await t.$api(Global.url.apiGetTask + '/' + t.taskWeekId, '', 'GET')
      if (result.data && result.data.code === 200) {
        var res = result.data.data
        if (res.isParent != null) {
          t.isParentFlag = 'true'
        } else {
          t.isParentFlag = 'false'
        }
        t.task.parentIdCopy = res.parentId
        t.task.projectCopy = res.project
        t.task.task = res
        t.task.task.percent = t.personMsg.percent
        this.task.selectedType = t.task.task.tags.split(',')
        t.$refs.inputTimer.value = t.task.task.endTime
        this.initialProjectResource()
        this.parentChange()
      }
    },
    async submitTask () {
      var t = this
      t.task.task.endTime = t.$refs.inputTimer.value
      if (t.isParentFlag === 'true') {
        t.task.task.isParent = 1
      } else {
        t.task.task.isParent = null
      }
      if (t.task.task.title && t.task.task.project && t.task.task.tags && parseInt(t.task.task.planScore) >= 0 && t.task.task.planStatus && t.task.task.endTime && parseInt(t.task.task.planHours) >= 0) {
        var api = t.taskWeekId ? Global.url.apiTaskUpdate + '/' + t.taskWeekId : Global.url.apiTaskSave
        const result = await t.$api(api, t.task.task)
        if (result.data && result.data.code === 200) {
          this.showResult(result.data)
          if (!t.taskWeekId) {
            t.$refs.inputTimer.value = ''
            t.isParentFlag = 'false'
            this.task.selectedType = []
            t.task.task = {
              title: '',
              project: '',
              tags: '',
              description: '',
              planScore: 0,
              actualScore: '',
              currentStatus: '',
              planStatus: '',
              parentId: '',
              isParent: null,
              endTime: '',
              planHours: '',
              actualHours: '',
              percent: t.personMsg.percent,
              level: t.personMsg.level,
              userId: t.personMsg.userId,
              userName: t.personMsg.name
            }
          }
        }
      }
    },
    async initialProjectStatusAndTag () {
      var result = await this.$api(Global.url.apiGetCommonType, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.task.project = Object.assign({}, result.data.data.project)
        this.task.status = Object.assign({}, result.data.data.status)
        this.task.tag = Object.assign({}, result.data.data.tag)
      }
    },
    async initialParentProjectList () {
      var result = await this.$api(Global.url.apiGetTaskParents, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.task.parentProject = result.data.data
      }
    },
    async initialProjectResource () {
      var t = this
      if (!t.taskWeekId) {
        t.task.task.planScore = 0
        t.task.task.planHours = ''
      }
      if (t.task.task.parentId) {
        var result = await this.$api(Global.url.apiGetParentResource + t.task.task.parentId, '', 'GET')
        if (result.data && result.data.code === 200) {
          t.task.parentHours = result.data.data.surplusHours + Number(t.task.task.planHours)
          t.task.parentScore = result.data.data.surplusScore + Number(t.task.task.planScore)
          t.isParentHours = true
          t.isParentScore = true
          for (var index in t.task.parentProject) {
            if (t.task.task.parentId === t.task.parentProject[index].id) {
              t.task.task.project = t.task.parentProject[index].project
            }
          }
        }
      }
    },
    showResult (result) {
      var title = false
      var message = ''
      if (!result || !result.hasOwnProperty('code') || result.code === '') {
        title = false
        message = '连接后台API失败'
      } else if (result.code === 200) {
        title = true
        message = '操作成功'
      } else {
        title = false
        message = result.message
      }
      if (title) {
        Toast.success(message)
      } else {
        Toast.fail(message)
      }
    },
    confirmButtonClicked () {
      this.operatingResult = {}
    },
    async addNewTag (tag) {
      if (tag.length <= 5 && tag.length > 0) {
        if (!this.existNewTag(tag)) {
          var params = {
            name: tag
          }
          var result = await this.$api(Global.url.apiPutTag, params, 'POST')
          if (result.data && result.data.code === 200) {
            this.initialProjectStatusAndTag()
          }
        } else {
          Toast('输入的新标签名称重复，不给提交')
        }
      }
      this.isClicked = false
    },
    existNewTag (tag) {
      for (var index in this.task.tag) {
        if (this.task.tag[index] === tag) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    isParentFlag: function (newValue) {
      if (newValue === 'true') {
        this.isParentHours = false
        this.isParentScore = false
      }
    },
    'task.task.planHours': function () {
    }
  }
}

</script>
<style>
  div.form-group{
    padding: 15px 0 0 0;
  }
  div.remind{
    color: red;
    font-size: 12px;
    padding: 5px 15px 0;
  }
  .datetimepicker table thead tr th.switch{
    text-align: center;
  }
  .placeholder{
    height: 0;
    position: absolute;
    z-index: -1;
    bottom: 0;
    opacity: 0;
    left: 0;
    display: block;
  }
  .disabledP{
    margin: 0;
    font-size: 14px;
    border: 1px solid #bdc0c7;
    padding: 8px 8px 8px 12px;
    background: #eee;
  }
  div.panel-heading.panel-heading-divider > span{
    text-align: right;
  }
</style>
