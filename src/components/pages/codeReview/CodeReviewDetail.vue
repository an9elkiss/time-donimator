<template>
  <div class="be-content codeReviewDetail">
    <div class="main-content container-fluid">
      <form class="form-horizontal">
        <div class="panel panel-default code-review-header">
          <div class="panel-heading center">{{ codeReview.userLabel }}<span class="panel-subtitle">{{ codeReview.codeReviewTime }}</span></div>
          <div class="panel-body">
            <div v-if="myflag">
              <p v-if="codeReview.codeReviewJudges != null">评委：{{ codeReview.codeReviewJudges }}</p>
              <div v-if="isEditable" class="chooseCodeReviewlevel">
                <span>程度：</span>
                <div class="btn-group btn-space">
                  <button type="button" class="btn btn-default">{{ codeReviewCommand.codeReviewlevel.length > 0 ? codeReviewCommand.codeReviewlevel : '难度' }}</button>
                  <button type="button" data-toggle="dropdown" class="btn btn-primary dropdown-toggle">
                    <span class="mdi mdi-chevron-down"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul role="menu" class="dropdown-menu">
                    <li><a href="#" @click="monthSelected(1)">简单</a></li>
                    <li><a href="#" @click="monthSelected(2)">普通</a></li>
                    <li><a href="#" @click="monthSelected(3)">复杂</a></li>
                  </ul>
                </div>
              </div>
              <p v-if="!isEditable">程度：{{ codeReview.codeReviewlevel }}</p>
              <p v-if="codeReview.totalScore != null">得分：{{ codeReview.totalScore }}</p>
            </div>
            <p class="code-review-tip cfix"><span class="fLeft dis-block">注：</span><span class="overflow-hidden dis-block">得分项为【优秀】【良好】【基本合格】【不合格】【无】，加分项酌情加5~20分；<br>*表示重点整治的问题，请加强重视，不要重犯；</span></p>
          </div>
        </div>
        <div v-for="(modular, index) of codeReviewDetailModules" :key="modular.id" class="panel panel-default code-review-block">
          <div class="panel-heading panel-heading-divider">{{ modular.modularType }}</div>
          <div class="panel-body">
            <h2>内容</h2>
            <p v-html="$global.format(modular.modularContent)"></p>
            <div v-if="!isEditable && isFlagScore">
              <h2>得分：<span v-if="modular.modularFraction">{{ modular.modularFraction }} 分</span></h2>
              <h2>备注</h2>
              <p v-html="$global.format(modular.modularRemarks)"></p>
            </div>
            <div v-if="isEditable">
              <div class="form-group xs-mt-10">
                <label class="col-sm-1 control-label bold">得分</label>
                <div class="col-sm-11">
                  <input v-model="modular.modularFraction" @input="scoreInputValidator(index)" data-parsley-type="number" placeholder="请输入得分限数字" class="form-control input-sm">
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
        <div class="center box-fixed">
          <a class="btn btn-space btn-primary btn-add" v-if="!isEditable" @click="changeStatus">评分</a>
          <a class="btn btn-space btn-primary btn-add" v-if="isEditable" @click="codeReviewPut">提交</a>
          <a class="btn btn-space btn-primary btn-add" v-if="!isEditable" @click="codeReviewEdit">编辑</a>
          <a class="btn btn-space btn-primary btn-add" v-if="!isEditable" @click="codeReviewDelete">删除</a>
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
        totalScore: 0,
        codeReviewlevel: ''
      },
      loginUserChineseName: '',
      codeReviewDetailModules: [],
      isFlagScore: false,
      isEditable: false,
      // 自定义一个 flag 用来标记是否进入评分或者展示评分之后的页面
      myflag: false
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
    await this.initialLoginUserName()
    await this.codeReviewInit()
    await this.codeReviewInfo()
  },
  methods: {
    async codeReviewInit () {
      let result = await this.$api(Global.url.apiCodeReview + '?id=' + this.$route.params.id, '', 'GET')
      if (result && result.data.code === 200) {
        if (result.data.data == null) {
          this.$global.showMessage('没有找到数据')
          this.$router.go(-1)
          return
        }
      }
      this.$store.commit('setCodeReview', result.data.data)
      if (this.codeReview.codeReviewlevel !== null) {
        this.myflag = true
        this.codeReviewCommand.codeReviewlevel = this.codeReview.codeReviewlevel
      } else {
        this.myflag = false
      }
    },
    async initialLoginUserName () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        let persons = result.data.data
        for (let index in persons) {
          if (persons[index].userId === Number(this.user.id)) {
            this.loginUserChineseName = persons[index].name
            return
          }
        }
      }
    },
    async codeReviewInfo () {
      var result = await this.$api(Global.url.apiGetCodeReviewInfo + '/' + this.$route.params.id, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.codeReviewDetailModules = result.data.data
        this.$store.commit('setCodeReviewDetail', result.data.data)
      }
    },
    async codeReviewPut () {
      this.prepareCodeReviewCommand()
      var result = await this.$api(Global.url.apiUpdateCodeReview, this.codeReviewCommand, 'POST')
      this.$global.showResult(result.data)
      if (result.data && result.data.code === 200) {
        this.codeReview.codeReviewJudges = result.data.data.codeReviewJudges
        this.codeReview.totalScore = result.data.data.totalScore
        this.codeReview.codeReviewlevel = result.data.data.codeReviewlevel
        this.$store.commit('setCodeReview', this.codeReview)
        this.updateCodeReviewDetailModules(result.data)
        this.isFlagScore = true
        this.isEditable = false
      }
    },
    async codeReviewDelete () {
      var result = await this.$api(Global.url.apiGetCodeReviewDelete + '/' + this.codeReview.id, '', 'DELETE')
      this.$global.showResult(result.data)
      if (result.data && result.data.code === 200) {
        this.goBack()
      }
    },
    // codeReviewValidator () {
    //   for (var index in this.codeReviewDetailModules) {
    //     var codeReviewDetailModule = this.codeReviewDetailModules[index]
    //     console.log(codeReviewDetailModule)
    //     var fraction = Number(codeReviewDetailModule.modularFraction)
    //     var result = true
    //     // var remarks = codeReviewDetailModule.modularRemarks
    //     console.log(fraction)
    //     if (fraction === 0) {
    //       result = false
    //       return result
    //     }
    //   }
    //   return result
    // },
    scoreInputValidator (index) {
      var value = this.codeReviewDetailModules[index].modularFraction
      value = value.replace(/[^\d]/g, '')
      this.codeReviewDetailModules[index].modularFraction = value
    },
    prepareCodeReviewCommand () {
      this.codeReviewCommand.id = this.codeReview.id
      this.codeReviewCommand.userId = this.codeReviewPerson.userId
      this.codeReviewCommand.codeReviewTime = this.codeReview.codeReviewTime
      this.codeReviewCommand.userLabel = this.codeReview.userLabel
      this.codeReviewCommand.codeReviewInfos = JSON.stringify(this.codeReviewDetailModules)
      this.codeReviewCommand.codeReviewJudges = this.loginUserChineseName
      this.codeReviewCommand.totalScore = this.totalScore
    },
    updateCodeReviewDetailModules (result) {
      result.data.codeReviewInfos = result.data.codeReviewInfos.replace(/'/g, '"')
      this.codeReviewDetailModules = JSON.parse(result.data.codeReviewInfos)
    },
    codeReviewEdit () {
      this.$router.push({name: 'CodeReviewForm', query: {'id': this.codeReview.id}})
    },
    goBack () {
      this.$router.push({name: 'CodeReviewList'})
    },
    monthSelected (level) {
      if (level === 1) {
        this.codeReviewCommand.codeReviewlevel = '简单'
      } else if (level === 2) {
        this.codeReviewCommand.codeReviewlevel = '普通'
      } else if (level === 3) {
        this.codeReviewCommand.codeReviewlevel = '复杂'
      }
    },
    changeStatus () {
      this.isEditable = !this.isEditable
      this.myflag = true
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
  .btn-group{
    width: 218px;
    margin-top: 5px;
  }
  .dropdown-menu {
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);
    border-radius: 3px;
    padding: 7px 0px;
    min-width: 73px;
  }
  .chooseCodeReviewlevel{
    margin: 10px 0 0;
  }
</style>
