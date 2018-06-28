<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel">
        <div class="panel-heading panel-heading-divider cfix"><span class="fLeft">{{taskCommand.userName}}</span><span class="fRight">{{nowDateString}}</span></div>
        <div class="panel-body">
          <form class="form-horizontal group-border-dashed" id="taskForm" action="">
            <div class="form-group">
              <label class="col-sm-3 control-label">任务名称</label>
              <div class="col-sm-6">
                <input type="text" required="" placeholder="任务名称" class="form-control input-sm" v-model="taskCommand.title" @keydown.enter.prevent>
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
                <p class="disabledP" v-if="isDisabled && taskCommand.parentTitle">{{taskCommand.parentTitle}}</p>
                <select class="form-control input-sm" v-model="taskCommand.parentId" v-else @change="parentTaskChange">
                  <option value="">未选择</option>
                  <option v-for="(project, index) of task.parentProject" :key="index" :value="project.id">{{project.title}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">项目名称</label>
              <div class="col-sm-6">
                <select class="form-control input-sm" v-model="taskCommand.project" required="" :disabled="isDisabled">
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
                <input v-model="taskCommand.tags" required="" class="placeholder">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">任务内容</label>
              <div class="col-sm-6">
                <textarea class="form-control input-sm" v-model="taskCommand.description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">贡献值</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" required="" placeholder="贡献值" class="form-control input-sm" v-model="taskCommand.planScore" @keydown.enter.prevent>
              </div>
              <div class="col-sm-6 col-sm-offset-3" v-if="taskWeekId && taskCommand.parentId">
                <div class="progress">
                  <div ref="actualAllScore" class="progress-bar progress-bar-primary progress-bar-striped" v-if="actualAllScore >= 0">{{ actualAllScore }}</div>
                  <div ref="planAllScore" class="progress-bar progress-bar-success progress-bar-striped" v-if="planAllScore >= 0">{{ planAllScore }}</div>
                </div>
                <div class="text-center clearfix progressColorRemind">
                  <div class="fact">已生成</div>
                  <div class="plan">已规划</div>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="$route.query.flag">
              <label class="col-sm-3 control-label">实际值</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" placeholder="实际值" class="form-control input-sm" v-model="taskCommand.actualScore" @keydown.enter.prevent>
              </div>
            </div>
            <div class="form-group" v-if="$route.query.flag">
              <label class="col-sm-3 control-label">当期状态</label>
              <div class="col-sm-6">
                <select class="form-control input-sm" v-model="taskCommand.currentStatus">
                  <option value="">未选择</option>
                  <option v-for="(value, key) of task.status" :key="key" :value="key">{{value}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">计划状态</label>
              <div class="col-sm-6">
                <select class="form-control input-sm" v-model="taskCommand.planStatus" required="">
                  <option value="">未选择</option>
                  <option v-for="(value, key) of task.status" :key="key" :value="key">{{value}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">计划日期</label>
              <div class="col-md-6">
                <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker" id="datePicker">
                  <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input v-model="taskCommand.endTime" size="16" type="text" required="" ref="inputTimer" id="dateInput" value="" class="form-control input-sm" style="z-index: 0" @keydown.enter.prevent>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">预估工时</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" required="" placeholder="预估工时" class="form-control input-sm" v-model="taskCommand.planHours" @keydown.enter.prevent>
              </div>
            </div>
            <div class="form-group" v-if="$route.query.flag">
              <label class="col-sm-3 control-label">实际工时</label>
              <div class="col-sm-6">
                <input data-parsley-type="number" placeholder="实际工时" class="form-control input-sm" v-model="taskCommand.actualHours" @keydown.enter.prevent>
              </div>
            </div>
            <div class="form-group btn-fixed">
              <div class="center">
                <a class="btn btn-space btn-primary" v-if="nowIndex-1 >= 0" @click="turnToTask(nowIndex-1)">上一个</a>
                <button :type="flag?'button':'submit'" class="btn btn-space btn-primary" @click="submitTask">提交</button>
                <a class="btn btn-space btn-primary" @click="goBack">返回</a>
                <!--<router-link class="btn btn-space btn-primary" :to="{ name: 'TaskMangementList'}">返回</router-link>-->
                <a class="btn btn-space btn-primary" v-if="nowIndex+1 < taskList.length" @click="turnToTask(nowIndex+1)">下一个</a>
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
      taskCommand: {
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
      nowIndex: 0,
      planAllScore: 0,
      actualAllScore: 0,
      flag: false,
      isParentFlag: 'false',
      taskWeekId: 0,
      isClicked: false,
      isTrue: false,
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
      nowDateString: 'selectedDate',
      taskList: 'taskList'
    })
  },
  mounted () {
    var self = this
    window.$(document).ready(function () {
      window.App.init()
      window.App.formElements()

      // 日期选择器专用监听事件，用于vue更新值
      window.$('#datePicker').datetimepicker()
        .on('hide', function (ev) {
          var value = window.$('#dateInput').val()
          self.taskCommand.endTime = value
        })
    })
    this.init()
    this.initialProjectStatusAndTag()
    this.initialParentProjectList()
  },
  methods: {
    parentChange () {
      var t = this
      if (t.isParentFlag === 'false') {
        if (t.taskCommand.parentId && t.taskCommand.parentTitle) {
          t.isDisabled = true
        } else {
          t.isDisabled = false
        }
        t.taskCommand.parentId = t.task.parentIdCopy
        t.taskCommand.project = t.task.projectCopy
      } else {
        t.isDisabled = false
      }
    },
    parentTaskChange () {
      if (this.taskCommand.parentId) {
        for (var index in this.task.parentProject) {
          if (this.taskCommand.parentId === this.task.parentProject[index].id) {
            this.taskCommand.project = this.task.parentProject[index].project
          }
        }
      }
    },
    buttonClicked (index) {
      if (this.task.selectedType.indexOf(index) >= 0) {
        this.task.selectedType.splice(this.task.selectedType.indexOf(index), 1)
      } else {
        this.task.selectedType.push(index)
      }
      this.taskCommand.tags = this.tagsArrayToString()
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
      this.$router.go(-1)
    },
    init () {
      var t = this
      t.taskCommand.userName = t.personMsg.name
      t.taskCommand.userId = t.personMsg.userId
      t.taskCommand.level = t.personMsg.level
      t.taskCommand.percent = t.personMsg.percent
      t.taskWeekId = t.$route.query.id
      t.nowIndex = Number(t.$route.query.index)
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
        t.taskCommand = res
        t.taskCommand.percent = t.personMsg.percent
        this.task.selectedType = t.taskCommand.tags.split(',')
        // t.$refs.inputTimer.value = t.taskCommand.endTime
        this.parentChange()
        if (t.taskCommand.parentId) {
          this.initialScoreProgress()
        }
      }
    },
    validateForm () {
      return this.taskCommand.title && this.taskCommand.project && this.taskCommand.tags && parseInt(this.taskCommand.planScore) >= 0 && this.taskCommand.planStatus && this.taskCommand.endTime && parseInt(this.taskCommand.planHours) >= 0
    },
    async submitTask () {
      var t = this
      if (t.isParentFlag === 'true') {
        t.taskCommand.isParent = 1
      } else {
        t.taskCommand.isParent = null
      }
      if (this.validateForm()) {
        var api = t.taskWeekId ? Global.url.apiTaskUpdate + '/' + t.taskWeekId : Global.url.apiTaskSave
        const result = await t.$api(api, t.taskCommand)
        if (result.data && result.data.code === 200) {
          t.$global.showResult(result.data)
          if (!t.taskWeekId) {
            t.initialParentProjectList()
            t.isParentFlag = 'false'
            t.task.selectedType = []
            t.taskCommand = {
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
          this.$global.showMessage('输入的新标签名称重复，不给提交')
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
    },
    turnToTask (taskListIndex) {
      this.$router.replace({name: 'TaskMangementDetail', query: {'id': this.taskList[taskListIndex].taskWeekId, 'index': taskListIndex, 'flag': '0'}})
    },
    async initialScoreProgress () {
      var result = await this.$api(Global.url.apiGetChildTaskScore + this.taskList[this.nowIndex].taskId, '', 'GET')
      if (result.data && result.data.code === 200 && result.data.data) {
        this.setProgressWidth(result.data.data)
      }
    },
    setProgressWidth (data) {
      this.planAllScore = data.planAllScore
      this.actualAllScore = data.actualAllScore
      if (this.planAllScore === 0 && this.actualAllScore === 0) {
        this.$refs.planAllScore.style.width = '50%'
        this.$refs.actualAllScore.style.width = '50%'
      }
      this.$refs.planAllScore.style.width = 100 * this.planAllScore / (this.planAllScore + this.actualAllScore) + '%'
      this.$refs.actualAllScore.style.width = 100 * this.actualAllScore / (this.planAllScore + this.actualAllScore) + '%'
    }
  },
  watch: {
    '$route': function () {
      this.init()
      this.initialProjectStatusAndTag()
      this.initialParentProjectList()
    },
    'taskCommand': {
      handler (newValue) {
        this.flag = Boolean(newValue.title) && Boolean(newValue.project) && Boolean(newValue.tags) && parseInt(newValue.planScore) >= 0 && Boolean(newValue.planStatus) && Boolean(newValue.endTime) && parseInt(newValue.planHours) >= 0
      },
      deep: true
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
  div.progress {
    margin: 5px 0px;
    border-radius: 15px;
    line-height: 15px;
    height: 15px;
  }
  div.progress > div {
    line-height: 15px;
    height: 15px;
    font-size: 13px;
  }
  div.progressColorRemind {
    height: 15px;
    line-height: 15px;
  }
  div.progressColorRemind > div {
    margin: 0px 5px;
    padding: 0px 5px;
    border-width: 0px 0px 0px 15px;
    display: inline-block;
    height: 15px;
    line-height: 15px;
  }
  div.fact {
    border: solid #4285f4;
  }
  div.plan {
    border: solid #34a853;
  }
</style>
