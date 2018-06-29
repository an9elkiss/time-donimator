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
                <input v-model="codeReviewCommand.userLabel" id="code-review-name" class="form-control input-sm" placeholder="输入名称"/>
              </div>
            </div>
            <div class="form-group clearfix">
              <label class="col-xs-2 control-label">时间：</label>
              <div class="col-xs-10">
                <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker">
                  <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
                  <input class="form-control input-sm" ref="inputDateRef"/>
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
                <textarea v-model="modular.modularContent" class="form-control" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="box-fixed center">
          <button class="btn btn-space btn-primary btn-add" @click="submitCodeReviewForm">提交</button>
          <button class="btn btn-space btn-primary btn-add" @click="cancelCodeReviewForm">返回</button>
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
      codeReviewDetail: 'codeReviewDetail'
    })
  },
  created: function () {
    this.handleRouterParams()
  },
  mounted: function () {
    window.$(document).ready(function () {
      window.App.init()
      window.App.formElements()
    })
    // edit codeReview
    if (this.$route.query.id) {
      this.codeReviewInfoList = this.codeReviewDetail
      this.codeReviewCommand.userLabel = this.codeReview.userLabel
      this.codeReviewCommand.id = this.codeReview.id
      this.$refs.inputDateRef.value = this.codeReview.codeReviewTime
    }
  },
  methods: {
    handleRouterParams () {
      if (this.selectedPerson && this.selectedPerson.hasOwnProperty('userId')) {
        this.codeReviewCommand.userId = this.selectedPerson.userId
      } else {
        this.$router.push({name: 'CodeReviewList'})
      }
    },
    async submitCodeReviewForm () {
      this.codeReviewCommand.codeReviewTime = this.$refs.inputDateRef.value
      this.codeReviewCommand.codeReviewInfos = JSON.stringify(this.codeReviewInfoList)
      // if (!this.validateCodeReview()) {
      //   return
      // }
      if (this.$route.query.id) {
        var resultEdit = await this.$api(Global.url.apiUpdateCodeReview, this.codeReviewCommand, 'POST')
        this.codeReview.userLabel = resultEdit.data.data.userLabel
        this.codeReview.codeReviewTime = resultEdit.data.data.codeReviewTime
        this.$store.commit('setCodeReview', this.codeReview)
        this.$global.showResult(resultEdit.data)
        this.$router.push({name: 'CodeReviewDetail', params: {'id': this.$route.query.id}})
      } else {
        var resultCreate = await this.$api(Global.url.apiCodeReview, this.codeReviewCommand, 'POST')
        if (resultCreate.data && resultCreate.data.code === 200) {
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
      this.$refs.inputDateRef.value = ''
      for (var index in this.codeReviewInfoList) {
        this.codeReviewInfoList[index].modularContent = ''
      }
    },
    cancelCodeReviewForm () {
      this.$router.push({name: 'CodeReviewList'})
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
