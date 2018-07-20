<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <form>
        <div class="panel panel-default">
          <div class="panel-heading panel-heading-divider">{{ selectedPerson.name}}</div>
          <div class="panel-body">
            <div class="form-group clearfix">
              <label for="code-review-name" class="col-xs-2 control-label">名称：</label>
              <div class="col-xs-10">
                <input v-model="codeReviewCommand.userLabel" @keyup="codeReviewToState" id="code-review-name" class="form-control input-sm" placeholder="输入名称"/>
              </div>
            </div>
            <div class="form-group clearfix">
              <label class="col-xs-2 control-label">时间：</label>
              <div class="col-xs-10">
                <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker" id="datePicker">
                  <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
                  <input class="form-control input-sm" ref="inputDateRef" v-model="codeReviewCommand.codeReviewTime" id="dateInput" autocomplete="off"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(modular, index) of codeReviewInfoList" :key="index" class="panel panel-default">
          <div class="panel-heading panel-heading-divider">{{ modular.modularType }}</div>
          <div class="panel-body">
            <div class="form-group">
              <label class="col-sm-2 lines-middle">内容</label>
              <div class="col-sm-10">
                <textarea v-model="modular.modularContent" @keyup="codeReviewToState" class="form-control" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="box-fixed center">
          <a class="btn btn-space btn-primary btn-add" @click="submitCodeReviewForm">提交</a>
          <a class="btn btn-space btn-primary btn-add" @click="cancelCodeReviewForm">返回</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import { mapState } from 'vuex'

export default {
  name: 'CodeReviewForm',
  data: function () {
    return {
      codeReviewCommand: {
        userId: '',
        codeReviewTime: '',
        userLabel: '',
        codeReviewInfos: ''
      },
      codeReviewInfoList: [
        {
          modularType: '编码规范(20分)',
          modularContent: ''
        },
        {
          modularType: '业务完成度(50分)',
          modularContent: ''
        },
        {
          modularType: '性能(20分)',
          modularContent: ''
        },
        {
          modularType: '日志及监控(10分)',
          modularContent: ''
        },
        {
          modularType: '业务抽象(加分项)',
          modularContent: ''
        }
      ],
      inputDate: ''
    }
  },
  computed: {
    ...mapState({
      selectedPerson: 'codeReviewPerson',
      codeReview: 'codeReview',
      codeReviewDetail: 'codeReviewDetail',
      temporaryCodeReview: 'temporaryCodeReview'
    })
  },
  created: function () {
    this.handleRouterParams()
  },
  mounted: function () {
    var self = this
    window.$(document).ready(function () {
      window.App.formElements()
      // 日期选择器专用监听事件，用于vue更新值
      window.$('#datePicker').datetimepicker()
        .on('hide', function (ev) {
          var value = window.$('#dateInput').val()
          self.codeReviewCommand.codeReviewTime = value
          self.codeReviewToState()
        })
    })
    // 初始化缓存数据
    this.$store.commit('setTemporaryCodeReviewPerson', this.selectedPerson)
    // this.codeReviewToState()
    if (this.$route.query.id) {
      let codeReview = Object.assign({brief: this.codeReview}, {detail: this.codeReviewDetail})
      this.$store.commit('setTemporaryCodeReviewContent', codeReview)
    }

    // edit codeReview
    if (this.$route.query.id) {
      this.codeReviewInfoList = this.codeReviewDetail
      this.codeReviewCommand.userLabel = this.codeReview.userLabel
      this.codeReviewCommand.id = this.codeReview.id
      this.codeReviewCommand.codeReviewTime = this.codeReview.codeReviewTime
    }
    // 从state中获取
    if (this.$route.query.type === 'history') {
      if (this.temporaryCodeReview.submitType === 'update') {
        this.codeReviewInfoList = this.temporaryCodeReview.codeReview.detail
        this.codeReviewCommand.userLabel = this.temporaryCodeReview.codeReview.brief.userLabel
        this.codeReviewCommand.codeReviewTime = this.temporaryCodeReview.codeReview.brief.codeReviewTime
        this.codeReviewCommand.id = this.temporaryCodeReview.codeReview.brief.id
      } else {
        if (this.temporaryCodeReview.codeReview.hasOwnProperty('userLabel')) {
          this.codeReviewCommand.userLabel = this.temporaryCodeReview.codeReview.userLabel
        }
        if (this.temporaryCodeReview.codeReview.hasOwnProperty('codeReviewInfos')) {
          this.codeReviewInfoList = JSON.parse(this.temporaryCodeReview.codeReview.codeReviewInfos)
        }
        if (this.temporaryCodeReview.codeReview.hasOwnProperty('codeReviewTime')) {
          this.codeReviewCommand.codeReviewTime = this.temporaryCodeReview.codeReview.codeReviewTime
        }
      }
    }
  },
  methods: {
    handleRouterParams () {
      // 判断state中是否存在code Review的被检查者
      if (this.$route.query.type === 'history') {
        // 从缓存中得到数据
        if (this.temporaryCodeReview.codeReviewPerson && this.temporaryCodeReview.codeReviewPerson.hasOwnProperty('userId')) {
          this.codeReviewCommand.userId = this.temporaryCodeReview.codeReviewPerson.userId
          return
        }
      }
      // 更新和新增时，把被检查者的ID赋值
      if (this.selectedPerson && this.selectedPerson.hasOwnProperty('userId')) {
        this.codeReviewCommand.userId = this.selectedPerson.userId
      } else {
        // 没有被赋值，则跳转到 codeReview的列表页
        this.$router.push({name: 'CodeReviewList'})
      }
      // 更新类型
      if (this.$route.query.id) {
        // 更新进入
        this.$store.commit('setTemporaryCodeReviewType', 'update')
      } else {
        // 新增进入
        this.$store.commit('setTemporaryCodeReviewType', 'add')
      }
    },
    async submitCodeReviewForm () {
      this.codeReviewCommand.codeReviewTime = this.$refs.inputDateRef.value
      this.codeReviewCommand.codeReviewInfos = JSON.stringify(this.codeReviewInfoList)
      // if (!this.validateCodeReview()) {
      //   return
      // }
      if (this.$route.query.id || (this.$route.query.type && this.temporaryCodeReview.submitType === 'update')) {
        // 请求更新接口
        var resultEdit = await this.$api(Global.url.apiUpdateCodeReview, this.codeReviewCommand, 'POST')
        this.codeReview.userLabel = resultEdit.data.data.userLabel
        this.codeReview.codeReviewTime = resultEdit.data.data.codeReviewTime
        this.$store.commit('setCodeReview', this.codeReview)
        this.$global.showResult(resultEdit.data)
        if (resultEdit.data.code === 200) {
          // 提交成功， 跳转
          if (this.$route.query.id) {
            this.$router.push({name: 'CodeReviewDetail', params: {'id': this.$route.query.id}})
          } else {
            this.$router.push({name: 'CodeReviewDetail', params: {'id': this.temporaryCodeReview.codeReview.brief.id}})
          }
          // 清空state
          this.$store.commit('setTemporaryCodeReviewContent', {})
          this.$store.commit('setTemporaryCodeReviewPerson', {})
          this.$store.commit('setTemporaryCodeReviewType', '')
        }
      } else {
        // 请求新建接口
        var resultCreate = await this.$api(Global.url.apiCodeReview, this.codeReviewCommand, 'POST')
        if (resultCreate.data && resultCreate.data.code === 200) {
          // 提交成功，清空state
          this.$store.commit('setTemporaryCodeReviewContent', {})
          this.$store.commit('setTemporaryCodeReviewPerson', {})
          this.$store.commit('setTemporaryCodeReviewType', '')
          this.freshForm()
        }
        this.$global.showResult(resultCreate.data)
      }
    },
    validateCodeReview () {
      if (!this.codeReviewCommand.userLabel || !this.codeReviewCommand.codeReviewTime) {
        return false
      }
      for (var index in this.codeReviewInfoList) {
        if (!this.codeReviewInfoList[index].modularContent) {
          return false
        }
      }
      return true
    },
    freshForm () {
      this.codeReviewCommand.userLabel = ''
      this.codeReviewCommand.codeReviewInfos = ''
      this.codeReviewCommand.codeReviewTime = ''
      for (var index in this.codeReviewInfoList) {
        this.codeReviewInfoList[index].modularContent = ''
      }
    },
    cancelCodeReviewForm () {
      this.$store.commit('setTemporaryCodeReviewContent', {})
      this.$store.commit('setTemporaryCodeReviewPerson', {})
      this.$store.commit('setTemporaryCodeReviewType', '')
      this.$router.go(-1)
    },
    codeReviewToState () {
      if (this.$route.query.type === 'history') {
        if (this.temporaryCodeReview.submitType === 'add') {
          this.codeReviewCommand.codeReviewInfos = JSON.stringify(this.codeReviewInfoList)
          this.$store.commit('setTemporaryCodeReviewContent', this.codeReviewCommand)
        } else {
          this.temporaryCodeReview.codeReview.detail = this.codeReviewInfoList
          this.temporaryCodeReview.codeReview.brief.userLabel = this.codeReviewCommand.userLabel
          this.temporaryCodeReview.codeReview.brief.codeReviewTime = this.codeReviewCommand.codeReviewTime
          this.$store.commit('setTemporaryCodeReviewContent', Object.assign({brief: this.temporaryCodeReview.codeReview.brief}, {detail: this.temporaryCodeReview.codeReview.detail}))
        }
      }
    }
  }
}
</script>

<style scoped>
.form-group {
  vertical-align: middle;
}
.form-group label {
  padding: 8px 0px 0px 0px;
}
  .form-group > div {
  padding: 0px;
}
.form-group > .lines-middle {
  padding: 30px 0px 0px 0px;
}
.operationButton {
  border-radius: 5px;
  padding: 2px 20px;
}
.date.datetimepicker{
  padding-top: 0px;
}
</style>
