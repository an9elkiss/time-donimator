<template>
  <div class="be-content be-no-padding">
    <aside class="page-aside">
      <div class="be-scroller ps-container ps-theme-default" data-ps-id="b124edcf-6d2e-2d3a-d91e-79464c55e4d4">
        <div class="aside-content">
          <div class="content">
            <div class="aside-header">
              <button data-target=".aside-nav" data-toggle="collapse" type="button" class="navbar-toggle"><span
                class="icon mdi mdi-caret-down"></span></button>
              <span class="title">Mail Service</span>
              <p class="description">Service description</p>
            </div>
          </div>
          <div class="aside-nav collapse">
            <z-tree :zNodes="zNodes" pIdKey="parentId"></z-tree>
          </div>
        </div>
        <div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 0px;">
          <div class="ps-scrollbar-x" tabindex="0" style="left: 0px; width: 0px;"></div>
        </div>
        <div class="ps-scrollbar-y-rail" style="top: 0px; right: 0px;">
          <div class="ps-scrollbar-y" tabindex="0" style="top: 0px; height: 0px;"></div>
        </div>
      </div>
    </aside>
    <div class="be-wrapper be-aside be-fixed-sidebar">
      <div class="main-content container-fluid">
        <div class="panel-heading panel-heading-divider">{{taskCommand.userName}}</div>
        <div class="panel-body">
          <form class="form-horizontal group-border-dashed">
          <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-8">
              <input type="text" required="" placeholder="培训名称" class="form-control input-sm">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">时间</label>
            <div class="col-sm-8">
              <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker" id="datePicker">
                <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input size="16" type="text" required="" v-model="shareTime" ref="inputTimer" id="dateInput" value="" class="form-control input-sm" autocomplete="off" style="z-index: 0" @keydown.enter.prevent>
              </div>
            </div>
          </div>
          </form>
        </div>
        <div class="email editor">
          <div id="email-editor"></div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-space"><i class="icon s7-mail"></i> Send</button>
            <button type="button" class="btn btn-default btn-space"><i class="icon s7-close"></i> Cancel</button>
          </div>
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
import ZTree from '@/components/unit/ZTree'

export default {
  name: 'EditContentPage',
  components: {ZTree},
  data () {
    return {
      shareTime: '',
      persons: [],
      taskCommand: {
        title: '',
        project: '',
        description: '',
        percent: '',
        level: '',
        userId: '',
        userName: ''
      },
      zNodes: []
    }
  },
  mounted () {
    var self = this
    window.$(document).ready(function () {
      window.App.mailCompose()
      window.App.formElements()

      // 日期选择器专用监听事件，用于vue更新值
      window.$('#datePicker').datetimepicker()
        .on('hide', function (ev) {
          var value = window.$('#dateInput').val()
          self.shareTime = value
        })
    })
    this.getPersons()
    this.getZNodes()
  },
  computed: {
    ...mapState({
      personMsg: 'user'
    })
  },
  methods: {
    async getPersons () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.persons = result.data.data
        this.init()
      }
    },
    init () {
      var t = this
      for (var index in t.persons) {
        if (t.persons[index].userId === t.personMsg.id) {
          t.taskCommand.userName = t.persons[index].name
          t.taskCommand.userId = t.persons[index].userId
          t.taskCommand.level = t.persons[index].level
          t.taskCommand.percent = t.persons[index].percent
          return
        }
      }
    },
    async getZNodes () {
      let result = await this.$api(Global.url.apiGetAllFileTree, '', 'GET')
      console.log(result)
      if (result && result.data && result.data.code === 200) {
        this.zNodes = result.data.data
      }
    }
  }
}
</script>

<style scoped>
  div.be-wrapper.be-aside.be-fixed-sidebar {
    padding-top: 0px;
  }
  .panel-heading-divider {
    padding-left: 20px;
    margin: 0;
    background-color: #FFFFFF;
  }
  .panel-body {
    background-color: #FFFFFF;
    border-bottom: 1px solid #d9d9d9;
  }
</style>
