<template>

  <div class="be-content panel panel-default panel-border-color panel-border-color-primary">
    <div class="panel-heading panel-heading-divider rel">张三/任务4</div>
    <div class="panel-body">
      <form action="#" class="form-horizontal group-border-dashed">

        <div class="form-group">
          <label class="col-sm-3 control-label">项目名称</label>
          <div class="col-sm-6">
            <select class="form-control input-sm" required="" v-model="task.task.project">
              <option v-for="(value, key) of task.project" :key="key" :value="key"> {{value}} </option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">任务类型</label>
          <div class="col-sm-6">
            <clickable-button v-for="(value, key) of task.tag" :key="key" :value="value" :index="key" @buttonClicked="buttonClicked"></clickable-button>
            <!--<div v-for="(value, key) of task.tag" :key="key" class="be-checkbox">-->
              <!--<input type="checkbox" required="" :value="value" :id="key" data-parsley-multiple="group1" data-parsley-errors-container="#error-container2">-->
              <!--<label :for="key">{{value}}</label>-->
            <!--</div>-->
            <!--<div id="error-container2"></div>-->
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label"></label>
          <div class="be-checkbox col-sm-6" style=" text-align:left; padding: 0 12px;">
            <input id="check1" type="checkbox" v-model="isParentFlag">
            <label for="check1">父任务</label>
          </div>
        </div>
        <div class="form-group" v-if="isParentFlag">
          <label class="col-sm-3 control-label">选择父任务</label>
          <div class="col-sm-6">
            <select class="form-control input-sm" v-model="task.task.parentId">
              <option v-for="(project, index) of task.parentProject" :key="index" :value="project.id">{{project.title}}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">任务内容</label>
          <div class="col-sm-6">
            <textarea required="" class="form-control input-sm" v-model="task.task.description"></textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">贡献值</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="贡献值" class="form-control input-sm" v-model="task.task.planScore">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">实际值</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="实际值" class="form-control input-sm" v-model="task.task.actualScore">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">当期状态</label>
          <div class="col-sm-6">
            <select class="form-control input-sm" required="" v-model="task.task.currentStatus">
              <option v-for="(value, key) of task.status" :key="key" :value="key">{{value}}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">计划状态</label>
          <div class="col-sm-6">
            <select class="form-control input-sm" required="" v-model="task.task.planStatus">
              <option v-for="(value, key) of task.status" :key="key" :value="key">{{value}}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">计划日期</label>
          <div class="col-md-6">
            <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker">
              <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input size="16"
                type="text" required="" value="" class="form-control input-sm" v-model="task.task.endTime">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">工时（预估）</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="工时（预估）" class="form-control input-sm" v-model="task.task.planHours">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">工时（折算）</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="工时（折算）" class="form-control input-sm">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">工时（实际）</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="工时（实际）" class="form-control input-sm" v-model="task.task.actualHours">
          </div>
        </div>
        <div class="form-group">
          <div class="center">
            <button type="submit" class="btn btn-space btn-primary">提交</button>
            <button type="submit" class="btn btn-space btn-primary" @click="goBack">返回</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import ClickableButton from '@/components/unit/ClickableButton'
export default {
  data () {
    return {
      task: {
        project: {},
        status: {},
        tag: {},
        parentProject: [],
        task: {
          project: 0,
          tags: '',
          description: '',
          planScore: 0,
          actualScore: 0,
          currentStatus: 0,
          planStatus: 0,
          parentId: 0,
          endTime: '',
          planHours: 0,
          actualHours: 0
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
      isParentFlag: false
    }
  },
  components: {
    ClickableButton
  },
  mounted () {
    window.$(document).ready(function () {
      window.App.init()
      window.App.formElements()
    })
    this.initalProjectStatusAndTag()
    this.initalParentProjectList()
  },
  destroyed () {},
  methods: {
    buttonClicked (index) {
      if (this.task.selectedType.indexOf(index) >= 0) {
        this.task.selectedType.splice(this.task.selectedType.indexOf(index), 1)
      } else {
        this.task.selectedType.push(index)
      }
      this.task.task.tags = this.tagsArrayToString()
    },
    tagsArrayToString () {
      return this.task.selectedType.toString()
    },
    goBack () {
      this.$router.push({
        path: 'task-mangement-list'
      })
    },
    async initalProjectStatusAndTag () {
      var result = await this.$api('http://10.88.91.194:9006/api-super-manager/1.0.0/common/type', '', 'GET')
      if (result) {
        this.task.project = Object.assign({}, result.data.data.project)
        this.task.status = Object.assign({}, result.data.data.status)
        this.task.tag = Object.assign({}, result.data.data.tag)
      }
    },
    async initalParentProjectList () {
      var result = await this.$api('http://10.88.91.194:9006/api-super-manager/1.0.0/task/parents', '', 'GET')
      if (result) {
        this.task.parentProject = result.data.data
      }
    }
  },
  watch: {
    isParentFlag: function (newValue) {
      if (newValue) {
        this.task.task.parentId = ''
      }
    }
  }
}

</script>
<style scoped>

</style>
