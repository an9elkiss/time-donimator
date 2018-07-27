<template>
  <div class="be-content">
    <div class="main-content showReportFormInfo">
      <div v-if="codeReviewState" class="panel panel-default">
        <div class="panel-heading panel-heading-divider">Code Reviev (组别：{{ groupLeader.name }})</div>
        <div class="panel-body">
          <div v-for="(item) of chartDataInfo" :key="item.id" class="task-block">
            <h2 class="cfix">
              <span class="fLeft">姓名：{{ item.createBy }}</span>
            </h2>
            <div class="task-ul-list">
              <div>
                <p class="cfix"><span class="fLeft">任务名称：</span><span>{{ item.userLabel }}</span></p>
                <p class="cfix"><span class="fLeft">评&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;委：</span><span>{{ item.codeReviewJudges }}</span></p>
                <p class="cfix"><span class="fLeft">得&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分：</span><span>{{ item.totalScore }}</span></p>
                <p class="cfix"><span class="fLeft">难&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>{{ item.codeReviewlevel }}</span></p>
              </div>
              <div>
                <p><span>创建时间：</span><span>{{ item.createTime.substring(0, 10) }}</span></p>
                <p><span style="width: 110px;">CodeReviewTime：</span><span>{{ item.codeReviewTime }}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="improvementState" class="panel panel-default">
        <div class="panel-heading panel-heading-divider">持续改进 (组别：{{ groupLeader.name }})</div>
        <div class="panel-body">
          <div v-for="(improve) of chartDataInfo" :key="improve.id" class="task-block">
            <h2 class="cfix">
              <span class="fLeft">姓名：{{ improve.userName }}</span>
            </h2>
            <div class="task-ul-list">
              <div>
                <p class="cfix"><span class="fLeft">任务编号：</span><span>{{ improve.code }}</span></p>
                <p class="cfix"><span class="fLeft">任务名称：</span><span>{{ improve.title }}</span></p>
              </div>
              <p class="cfix"><span class="fLeft">任务描述：</span><span v-html="$global.format(improve.description)"></span></p>
              <div>
                <p class="cfix"><span class="fLeft">项目名称：</span><span>{{ improve.project }}</span></p>
                <p class="cfix"><span class="fLeft">贡献值：</span><span>{{ improve.planScore }}</span></p>
                <p class="cfix"><span class="fLeft">实际值：</span><span>{{ improve.actualScore }}</span></p>
                <p class="cfix"><span class="fLeft">当期状态：</span><span>{{ improve.currentStatus }}</span></p>
                <p class="cfix"><span class="fLeft">计划状态：</span><span>{{ improve.planStatus }}</span></p>
                <p class="cfix"><span class="fLeft">计划日期：</span><span>{{ improve.endTime }}</span></p>
              </div>
              <div>
                <p class="cfix"><span class="fLeft">预估工时：</span><span>{{ improve.planHours }}</span></p>
                <p class="cfix"><span class="fLeft">折算工时：</span><span>{{ improve.percentHours }}</span></p>
                <p class="cfix"><span class="fLeft">实际工时：</span><span>{{ improve.actualHours }}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="shareState" class="panel panel-default">
        <div class="panel-heading panel-heading-divider">分享 (组别：{{ groupLeader.name }})</div>
        <div class="panel-body">
          <div v-for="(share) of chartDataInfo" :key="share.id" class="task-block">
            <h2 class="cfix">
              <span class="fLeft">姓名：{{ share.userName }}</span>
            </h2>
            <div class="task-ul-list">
              <div>
                <p class="cfix"><span class="fLeft">分享名称：</span><span>{{ share.title }}</span></p>
                <p class="cfix"><span class="fLeft">评&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分：</span><span v-for="index in share.average" :key="index" class="mdi mdi-star-outline color-style"></span></p>
                <p class="cfix"><span class="fLeft">分享内容：</span><span v-html="$global.format(share.description)"></span></p>
              </div>
              <div>
                <p class="cfix"><span class="fLeft">分享标签：</span><span>{{ share.shareLabel }}</span></p>
                <p class="cfix"><span class="fLeft">评论数：</span><span>{{ share.commentNum }}</span></p>
              </div>
              <div>
                <p><span>分享时间：</span><span>{{ share.shareTime.substring(0, 10) }}</span></p>
                <p><span>创建时间：</span><span>{{ share.createTime.substring(0, 10) }}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-fixed center">
        <a class="btn btn-space btn-primary btn-add" @click="goBack">返回</a>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import {
  mapState
} from 'vuex'
export default {
  name: 'ShowReportFormInfo',
  data () {
    return {
      differentFlags: ['CodeReview', 'Improvement', 'Share'],
      chartDataInfo: [],
      codeReviewState: false,
      improvementState: false,
      shareState: false,
      groupLeader: {
        name: '',
        id: ''
      }
    }
  },
  computed: {
    ...mapState({
      forwordInformation: 'forwordInformation'
    })
  },
  mounted () {
    if (this.forwordInformation.flag === this.differentFlags[0]) {
      this.codeReviewState = true
      this.getChartData(this.forwordInformation, Global.url.apiGetCodeReviewEveryMonthDataInfo)
    } else if (this.forwordInformation.flag === this.differentFlags[1]) {
      this.improvementState = true
      this.getChartData(this.forwordInformation, Global.url.apiGetImprovementMonthDataInfo)
    } else if (this.forwordInformation.flag === this.differentFlags[2]) {
      this.shareState = true
      this.getChartData(this.forwordInformation, Global.url.apiGetShareMonthDataInfo)
    }
  },
  methods: {
    async getChartData (forwordInformation, url) {
      let result = await this.$api(url + '?month=' + forwordInformation.month + '&groupManagerIds=' + forwordInformation.userId, '', 'GET')
      if (result.data && result.data.code === 200) {
        for (var key in result.data.data) {
          this.groupLeader.name = JSON.parse(key).name
          this.groupLeader.id = JSON.parse(key).userId
          this.chartDataInfo = result.data.data[key]
        }
      }
      // //////
      // ///////
      // /////////
      if (forwordInformation.flag === this.differentFlags[0]) {
        let allpersonData = await this.$api(Global.url.apiGetAllPersons, '', 'GET')
        if (allpersonData.data && allpersonData.data.code === 200) {
          for (var i = 0; i < this.chartDataInfo.length; i++) {
            for (var j = 0; j < allpersonData.data.data.length; j++) {
              if (this.chartDataInfo[i].userId === allpersonData.data.data[j].userId) {
                this.chartDataInfo[i].createBy = allpersonData.data.data[j].name
              }
            }
          }
        }
      }
    },
    goBack () {
      this.$router.push({name: 'ReportForm'})
    }
  }
}
</script>

<style scoped>
  .task-lists .accordion .panel .panel-heading a{
    padding: 10px;
  }
  .task-lists .panel-full{
    background-color: #f5f5f5;
    color: #000;
  }
  .task-lists h4 a{
    font-size: 16px;
  }
  .task-lists h4 span{
    font-size: 12px;
    line-height: 28px;
    margin-left: 8px;
  }
  .task-block{
    background: rgba(245, 245, 245, 0.4);
    color: #454545;
    padding: 10px 20px;
    border-bottom: 1px solid rgba(225, 225, 225, 0.9);
    position: relative;
  }
  .task-block h2{
    font-size: 14px;
    margin-top: 0px;
    font-weight: bold;
    line-height: 30px;
  }
  .task-ul-list p{
    margin-bottom: 5px;
    font-size: 12px;
  }
  .task-ul-list > div {
    flex-wrap: wrap;
    display: flex;
    justify-content: flex-start
  }
  .task-ul-list > div p {
    flex-grow: 0;
    flex-basis: 33%;
    min-width: 220px;
  }
  .task-ul-list > p span{
    display: block;
  }
  .task-ul-list p span:first-child{
    width: 68px;
    display: inline-block;
  }
  .task-ul-list > p span:last-child{
    overflow: hidden;
  }
  .task-lists .accordion .panel .panel-collapse .panel-body{
    padding: 0px;
  }
  .task-lists .accordion .panel .panel-heading a .icon{
    margin-right: 5px;
  }
  div.complete {
    background-color: rgba(203, 251, 216, .1)
  }
  .color-style{
    color: red;
    padding-left: 10px;
  }
</style>
