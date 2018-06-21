<template>
  <div class="be-content codeReviewDetail">
    <div class="main-content container-fluid">
      <form class="form-horizontal">
        <div class="panel panel-default code-review-header">
          <div class="panel-heading center">{{ codeReview.userLabel }}<span class="panel-subtitle">{{ codeReview.codeReviewTime }}</span></div>
          <div class="panel-body">
            <div v-if="isFlagScore">
              <p>评委：{{ this.codeReview.codeReviewJudges }}</p>
              <p>得分：{{ this.codeReview.totalScore }}</p>
            </div>
            <p class="code-review-tip cfix"><span class="fLeft dis-block">注：</span><span class="overflow-hidden dis-block">*得分项为【优秀】【良好】【基本合格】【不合格】【无】，加分项酌情加5~20分；<br>**表示重点整治的问题，请加强重视，不要重犯；</span></p>
          </div>
        </div>
        <div v-for="(modular, index) of codeReviewDetailModules" :key="modular.id" class="panel panel-default code-review-block">
          <div class="panel-heading panel-heading-divider">{{ modular.modularType }}</div>
          <div class="panel-body">
            <h2>内容</h2>
            <p>{{ modular.modularContent }}</p>
            <div v-if="!isEditable && isFlagScore">
              <h2>得分：<span>{{ modular.modularFraction }} 分</span></h2>
              <h2>备注</h2>
              <p>{{ modular.modularRemarks }}</p>
            </div>
            <div v-if="isEditable">
              <div class="form-group xs-mt-10">
                <label class="col-sm-1 control-label bold">得分</label>
                <div class="col-sm-11">
                  <input v-model="modular.modularFraction" data-parsley-type="number" placeholder="请输入得分限数字" class="form-control input-sm" @keyup="scoreInputValidator(index)" required="">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-1 control-label bold">备注</label>
                <div class="col-sm-11">
                  <textarea v-model="modular.modularRemarks" class="form-control"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="center code-btn">
          <a class="btn btn-space btn-primary btn-add" @click="isEditable = !isEditable">评分</a>
          <a class="btn btn-space btn-primary btn-add">编辑</a>
          <a class="btn btn-space btn-primary btn-add" @click="codeReviewDelete">删除</a>
          <button class="btn btn-space btn-primary btn-add" v-if="isEditable" @click="codeReviewPut">提交</button>
          <a class="btn btn-space btn-primary btn-add" @click="goBack">返回</a>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
import { Toast } from 'vant'
import Global from '@/components/Global'
export default {
  data: function () {
    return {
      codeReviewCommand: {
        id: 0,
        userId: 0,
        codeReviewTime: '',
        userLabel: '',
        codeReviewInfos: '',
        codeReviewJudges: '',
        totalScore: 0
      },
      codeReviewDetailModules: [],
      isFlagScore: false,
      isEditable: false
    }
  },
  computed: {
    ...mapState({
      codeReview: 'codeReview',
      codeReviewPerson: 'codeReviewPerson',
      user: 'user'
    }),
    totalScore: function () {
      var total = 0
      for (var index in this.codeReviewDetailModules) {
        total += Number(this.codeReviewDetailModules[index].modularFraction)
      }
      return total
    }
  },
  mounted: async function () {
    this.codeReviewInit()
    await this.codeReviewInfo()
  },
  methods: {
    codeReviewInit () {
      this.isFlagScore = this.codeReview.flagScore
    },
    async codeReviewInfo () {
      var result = await this.$api(Global.url.apiGetCodeReviewInfo + '/' + this.$route.params.id, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.codeReviewDetailModules = result.data.data
        this.$store.commit('setCodeReviewDetail', result.data.data)
      }
    },
    async codeReviewPut () {
      if (this.codeReviewValidator()) {
        this.prepareCodeReviewCommand()
        var result = await this.$api(Global.url.apiUpdateCodeReview, this.codeReviewCommand, 'POST')
        if (result.data && result.data.code === 200) {
          this.showResult(result.data)
          this.codeReview.codeReviewJudges = result.data.data.codeReviewJudges
          this.codeReview.totalScore = result.data.data.totalScore
          this.$store.commit('setCodeReview', this.codeReview)
          this.updateCodeReviewDetailModules(result.data)
          this.isFlagScore = true
          this.isEditable = false
        } else {
          Toast.fail('数据更新失败！')
        }
      }
    },
    async codeReviewDelete () {
      var result = await this.$api(Global.url.apiGetCodeReviewDelete + '/' + this.codeReview.id, '', 'DELETE')
      if (result.data && result.data.code === 200) {
        console.log(result.data)
        Toast.success('删除成功！')
        this.goBack()
      }
    },
    codeReviewValidator () {
      for (var index in this.codeReviewDetailModules) {
        var codeReviewDetailModule = this.codeReviewDetailModules[index]
        var fraction = Number(codeReviewDetailModule.modularFraction)
        var result = true
        // var remarks = codeReviewDetailModule.modularRemarks
        if (fraction === 0) {
          result = false
          return result
        }
        if (fraction < 5 || fraction > 20) {
          result = false
          break
        }
      }
      if (!result) {
        Toast('得分不可以小于5分或者大于20分！')
      }
      return result
    },
    scoreInputValidator (index) {
      var value = this.codeReviewDetailModules[index].modularFraction
      value = value.replace(/[^\d]/g, '')
      if (value.length > 2) {
        value = value.substr(0, 2)
      }
      var fraction = Number(value)
      if (fraction > 20 || fraction < 0) {
        value = ''
      }
      this.codeReviewDetailModules[index].modularFraction = value
    },
    prepareCodeReviewCommand () {
      this.codeReviewCommand.id = this.codeReview.id
      this.codeReviewCommand.userId = this.codeReviewPerson.userId
      this.codeReviewCommand.codeReviewTime = this.codeReview.codeReviewTime
      this.codeReviewCommand.userLabel = this.codeReview.userLabel
      this.codeReviewCommand.codeReviewInfos = JSON.stringify(this.codeReviewDetailModules)
      this.codeReviewCommand.codeReviewJudges = this.user.name
      this.codeReviewCommand.totalScore = this.totalScore
    },
    updateCodeReviewDetailModules (result) {
      result.data.codeReviewInfos = result.data.codeReviewInfos.replace(/'/g, '"')
      this.codeReviewDetailModules = JSON.parse(result.data.codeReviewInfos)
    },
    showResult (result) {
      var title = false
      var message = ''
      if (!result || !result.hasOwnProperty('code') || result.code === '') {
        title = false
        message = '获取数据失败'
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
    codeReviewEdit () {
      this.$router.push({name: 'CodeReviewForm', query: {'id': this.codeReview.id}})
    },
    goBack () {
      this.$router.push({name: 'CodeReviewList'})
    }
  }
}
</script>
<style scoped>
  .code-review-header .panel-body{
    padding-top: 0;
  }
  .code-review-header{
    border-bottom: none;
  }
  .code-review-header .panel-subtitle{
    margin: 5px 0 0;
  }
  .code-review-header p{
    margin: 10px 0 0;
  }
  .code-review-header p:first-child{
    margin: 0
  }
  .code-review-tip{
    color: #E51C23;
    font-size: 12px;
  }
  .code-review-block, .code-review-block .form-horizontal .form-group label{
    color: #454545;
  }
  .code-review-block h2{
    margin: 15px 0 0;
    padding: 0;
    font-weight: bold;
    font-size: 14px;
  }
  .code-review-block .panel-body > h2:first-child{
    margin: 0;
  }
  .code-review-block h2 span{
    font-weight: normal;
    font-size: 12px;
  }
  .code-review-block p{
    font-size: 12px;
    line-height: 18px;
    margin: 10px 0 0;
  }
  .code-review-block .form-horizontal .form-group{
    padding-top: 0;
  }
  .code-review-block .form-horizontal .form-group label{
    text-align: left;
    width: 56px;
  }
  .code-btn{
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
  .code-btn button{
    opacity: 0.9;
  }
</style>
