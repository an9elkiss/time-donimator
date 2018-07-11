<template>
  <div class="be-content be-no-padding">
    <aside class="page-aside">
      <div class="be-scroller ps-container ps-theme-default" data-ps-id="b124edcf-6d2e-2d3a-d91e-79464c55e4d4">
        <div class="aside-content">
          <div class="content">
            <div class="aside-header">
              <button data-target=".aside-nav" data-toggle="collapse" type="button" class="navbar-toggle"><span
                class="icon mdi mdi-caret-down"></span></button>
              <span class="title">文件树结构</span>
              <p class="description">File structure</p>
            </div>
          </div>
          <div class="aside-nav collapse">
            <z-tree :zNodes="zNodes" pIdKey="parentId" @addTreeNode="addTreeNodeHandler" @deleteTreeNode="deleteTreeNodeHandler" @renameTreeNode="renameTreeNodeHandler"></z-tree>
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
      <div v-if="pageStatus.editPage" class="main-content container-fluid">
        <div class="panel-heading panel-heading-divider username">{{taskCommand.userName}}</div>
        <div class="panel-body">
          <form class="form-horizontal group-border-dashed">
          <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-8">
              <input type="text" required="" v-model="taskCommand.name" placeholder="" class="form-control input-sm">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">时间</label>
            <div class="col-sm-8">
              <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker" id="datePicker">
                <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input size="16" type="text" required="" v-model="taskCommand.fileTime" ref="inputTimer" id="dateInput" value="" class="form-control input-sm" style="z-index: 0" autocomplete="off" @keydown.enter.prevent>
              </div>
            </div>
          </div>
          </form>
        </div>
        <div class="email editor">
          <div id="email-editor"></div>
          <div class="form-group">
            <button @click="submitTask" type="button" class="btn btn-primary btn-space"><i class="icon s7-mail"></i> 提交</button>
            <button type="button" class="btn btn-default btn-space"><i class="icon s7-close"></i> 取消</button>
          </div>
        </div>
      </div>
      <div v-if="pageStatus.detailPage" class="main-content container-fluid">
        <div class="email-body">
          <div class="col-md-12">
            <div class="panel">
              <div class="panel-heading panel-heading-divider detailPage">{{contentData.name}}<span class="panel-subtitle">{{contentData.userName}}&nbsp;&nbsp;{{contentData.fileTime}}</span></div>
              <div v-html="contentData.description" class="panel-body"></div>
            </div>
          </div>
          <div class="box-fixed center">
            <a class="btn btn-space btn-primary btn-add">上一篇</a>
            <a class="btn btn-space btn-primary btn-add">返&nbsp;&nbsp;&nbsp;&nbsp;回</a>
            <a class="btn btn-space btn-primary btn-add">下一篇</a>
          </div>
        </div>
      </div>
    </div>
    <van-dialog v-model="confirmFlag" show-cancel-button :before-close="beforeClose" :title="confirmTitle">
      <van-field v-model="newDictionaryName" label="文件夹名称" placeholder="请输入"/>
    </van-dialog>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import Global from '@/components/Global'
import ZTree from '@/components/unit/ZTree'
import { Dialog } from 'vant'

export default {
  name: 'EditContentPage',
  components: {ZTree},
  computed: {
    ...mapState({
      personMsg: 'user'
    }),
    confirmTitle: function () {
      switch (this.addOrReNameConfirmFlag) {
        case 'add': return '请为 ' + this.targetNode.name + ' 添加文件夹'
        case 'rename': return '请为 ' + this.targetNode.name + ' 更新文件夹名称'
        default: return ''
      }
    }
  },
  data () {
    return {
      persons: [],
      // taskCommand 中有关登陆者的信息在初始化后不可以做任何修改
      taskCommand: {
        name: '',
        fileTime: '',
        parentId: 717,
        fileType: 43,
        description: '',
        percent: '',
        level: '',
        userId: '',
        userName: ''
      },
      confirmFlag: false,
      addOrReNameConfirmFlag: '',
      newDictionaryName: '',
      targetNode: {},
      zNodes: [],
      pageStatus: {
        detailPage: false,
        editPage: true
      },
      pageContentId: 0,
      contentData: {}
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
      if (result && result.data && result.data.code === 200) {
        this.zNodes = result.data.data
      }
    },
    async postDictionary () {
      let dictionary = {
        name: this.newDictionaryName,
        fileTime: null,
        parentId: this.targetNode.id,
        fileType: 42,
        description: null,
        percent: this.taskCommand.percent,
        level: this.taskCommand.level,
        userId: this.taskCommand.userId,
        userName: this.taskCommand.userName
      }
      let result = await this.$api(Global.url.apiPostNodeContent, dictionary, 'POST')
      this.$global.showResult(result.data)
    },
    async submitTask () {
      console.log(this.taskCommand)
      console.log(window.$('#email-editor').summernote('code'))
      this.taskCommand.description = window.$('#email-editor').summernote('code')
      let result = await this.$api(Global.url.apiPostNodeContent, this.taskCommand, 'POST')
      // if (result.data && result.data.code === 200) {
      console.log(result)
      // }
    },
    async getPageDetailById () {
      let result = await this.$api(Global.url.apiGetDetailContent + '?id=' + this.pageContentId, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.contentData = result.data.data
        console.log(this.contentData)
      }
    },
    async renameTreeNode () {
      let result = await this.$api(Global.url.apiPostNodeContent + '/' + this.targetNode.id, {id: this.targetNode.id, name: this.newDictionaryName}, 'POST')
      this.$global.showResult(result.data)
      return result.data.data
    },
    async deleteTreeNode () {
      let result = await this.$api(Global.url.apiPostNodeContent + '/' + this.targetNode.id, '', 'DELETE')
      this.$global.showResult(result.data)
      return result.data.code
    },
    async beforeClose (action, done) {
      if (action === 'confirm' && this.newDictionaryName !== '') {
        switch (this.addOrReNameConfirmFlag) {
          case 'add':
            await this.postDictionary()
            break
          case 'rename':
            await this.renameTreeNode()
            break
          default:
            done()
        }
        this.newDictionaryName = ''
        this.getZNodes()
      }
      done()
    },
    addTreeNodeHandler (targetNode) {
      this.addOrReNameConfirmFlag = 'add'
      this.targetNode = targetNode
      this.confirmFlag = true
    },
    renameTreeNodeHandler (targetNode) {
      this.addOrReNameConfirmFlag = 'rename'
      this.targetNode = targetNode
      this.confirmFlag = true
    },
    deleteTreeNodeHandler (targetNode) {
      this.targetNode = targetNode
      Dialog.confirm({
        title: '警告',
        message: '确认删除 ' + targetNode.name + ' 吗？'
      }).then(async () => {
        if (await this.deleteTreeNode() === 200) {
          this.getZNodes()
        }
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
  div.be-wrapper.be-aside.be-fixed-sidebar {
    padding-top: 0px;
  }
  .username {
    padding-left: 20px;
    margin: 0;
    background-color: #FFFFFF;
  }
  .panel-body {
    background-color: #FFFFFF;
    border-bottom: 1px solid #d9d9d9;
  }
  .email-body {
    padding: 10px 0px;
  }
  .detailPage {
    text-align: center;
  }
</style>
