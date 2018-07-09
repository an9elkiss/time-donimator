<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">{{taskCommand.userName}}</div>
        <div class="panel-body">
          <form class="form-horizontal group-border-dashed" enctype="multipart/form-data">
            <div class="form-group">
              <label class="col-sm-3 control-label">名称</label>
              <div class="col-sm-6">
                <input type="text" required="" v-model="shareCommand.title" placeholder="培训名称" class="form-control input-sm">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">时间</label>
              <div class="col-sm-6">
                <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker" id="datePicker">
                  <!--<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input size="16" type="text" required="" ref="inputTimer" id="dateInput" value="" class="form-control input-sm" style="z-index: 0">-->
                  <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input size="16" type="text" required="" v-model="shareCommand.shareTime" ref="inputTimer" id="dateInput" value="" class="form-control input-sm" style="z-index: 0" @keydown.enter.prevent>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">简介</label>
              <div class="col-sm-6">
                <textarea class="form-control input-sm" v-model="shareCommand.description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">标签</label>
              <div class="col-sm-6 cfix">
                <!--<new-button id="newButton">标签</new-button>-->
                <clickable-button v-for="(value, key) of tags" :key="key" :value="value" :index="key"></clickable-button>
                <new-button id="newButton" :isClicked="isClicked" @addNewTag="addNewTag" @buttonClicked="isClicked = !isClicked">标签</new-button>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-3 control-label">文件上传</label>
                <a @change="uploadFile($event)" id="upload" href="javascript:;" class="ui-upload">
                  <input type="file"/>{{chooseFiles}}
                </a>&nbsp;&nbsp;{{uploadFileName}}
            </div>
            <div class="form-group box-fixed">
              <div class="center">
                <a class="btn btn-space btn-primary" @click="submitTask">提交</a>
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
import ClickableButton from '@/components/unit/ClickableButton'
import NewButton from '@/components/unit/NewButton'
import Global from '@/components/Global'

export default {
  data () {
    return {
      persons: [],
      tags: [],
      isClicked: false,
      uploadFileName: '',
      chooseFiles: '选择文件',
      taskCommand: {
        title: '',
        project: '',
        description: '',
        parentId: '',
        isParent: null,
        percent: '',
        level: '',
        userId: '',
        userName: ''
      },
      shareCommand: {
        title: '',
        description: '',
        shareLabel: '',
        multipartFile: '',
        shareTime: '',
        userId: '',
        level: '',
        userName: ''
      }
    }
  },
  components: {
    ClickableButton,
    NewButton
  },
  computed: {
    ...mapState({
      personMsg: 'user'
    })
  },
  mounted () {
    var self = this
    window.$(document).ready(function () {
      // window.App.init()
      window.App.formElements()

      // 日期选择器专用监听事件，用于vue更新值
      window.$('#datePicker').datetimepicker()
        .on('hide', function (ev) {
          var value = window.$('#dateInput').val()
          self.shareCommand.shareTime = value
        })
    })
    this.getPersons()
  },
  methods: {
    uploadFile (event) {
      var file = event.target.files
      // for (var i = 0; i < file.length; i++) {
      //   this.uploadFilesName.push(file[i].name)
      // }
      this.uploadFileName = file[0].name
      // this.chooseFiles = '继续添加'
      this.shareCommand.multipartFile = file[0]
    },
    init () {
      var t = this
      for (var index in t.persons) {
        if (t.persons[index].userId === t.personMsg.id) {
          t.taskCommand.userName = t.persons[index].name
          t.taskCommand.userId = t.persons[index].userId
          t.taskCommand.level = t.persons[index].level
          t.taskCommand.percent = t.persons[index].percent
        }
      }
    },
    async getPersons () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.persons = result.data.data
        this.init()
      }
    },
    addNewTag (tag) {
      if (tag.length <= 5 && tag.length > 0) {
        this.tags.push(tag)
      } else {
        this.$global.showMessage('输入的长度大于5')
      }
      this.isClicked = false
    },
    async submitTask () {
      var t = this
      var api = Global.url.apiPostTrainingContent
      t.shareCommand.shareLabel = t.tags.toString()
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      var formData = new FormData()
      formData.append('multipartFile', t.shareCommand.multipartFile)
      formData.append('title', t.shareCommand.title)
      formData.append('description', t.shareCommand.description)
      formData.append('shareLabel', t.shareCommand.shareLabel)
      formData.append('shareTime', t.shareCommand.shareTime)
      formData.append('userId', t.taskCommand.userId)
      formData.append('level', t.taskCommand.level)
      formData.append('userName', t.taskCommand.userName)
      formData.append('token', t.personMsg.token)
      if (this.validateForm()) {
        this.$http.post(api, formData, config).then(response => {
          if (response.body.code === 200) {
            this.$router.push({name: 'SharingCommentList'})
          } else {
            this.errorMessage = response.body.message
          }
        }, response => {
          // error callback
        })
      }
    },
    validateForm () {
      if (this.shareCommand.title.trim().length <= 0 || this.shareCommand.shareTime.trim().length <= 0 || this.shareCommand.multipartFile == null) {
        this.$global.showMessage('名称、时间、上传文件不能为空！')
      } else {
        if (this.shareCommand.multipartFile.size <= 31457280) {
          return true
        } else if (this.shareCommand.multipartFile != null && this.shareCommand.multipartFile.size > 31457280) {
          this.$global.showMessage('上传的文件不能超过30MB！')
          return false
        }
      }
    }
  },
  watch: {
    '$route': function () {
      this.init()
    }
  }
}
</script>

<style scoped>
  .ui-upload {
    font-size: 14px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    cursor: pointer;
    color: #101010;
    background: #FFFFFF;
    border: 1px solid #dedede;
    border-radius: 3px;
    display: inline-block;
    text-decoration: none;
    margin-left: 13px;
  }

  .ui-upload input {
    font-size: 16px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
    height: 0px;
  }
</style>
