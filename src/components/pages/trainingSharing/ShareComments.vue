<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="col-md-12">
          <div class="panel">
            <div class="panel-heading panel-heading-divider">
              {{sharingComment.title}}
              <span class="panel-subtitle">{{sharingComment.userName}} {{sharingComment.shareTime.substr(0, 10)}}</span>
            </div>
            <div class="panel-body">
              <label style="color: #101010">标签： </label>&nbsp;&nbsp;
              <label style="color: #101010">{{sharingComment.shareLabel}}</label>
            </div>
            <div class="panel-body">
              <label style="color: #101010">简介： </label>&nbsp;&nbsp;
              <label style="color: #101010; width: 80%;" v-html="$global.format(sharingComment.description)">
              </label>
            </div>
            <div class="panel-body">
              <label style="color: #101010">评分： </label>&nbsp;&nbsp;
              <label style="color: #101010; width: 80%;">
                <span v-for="(start, index) of cheakedStarts" :value="index" :key="start" class="mdi mdi-star-outline color-style" @click="delSore(index)"></span><span v-for="(start, index) of starts" :value="index" :key="start" class="mdi mdi-star-outline" @click="makeScore(index)"></span>
              </label>
            </div>
            <div class="panel-body">
              <label style="color: #101010">意见反馈： </label>&nbsp;&nbsp;
              <label style="color: #101010;" class="feedback">
                <textarea v-model="opinionScore.description" rows="4" class="form-control input-sm"></textarea>
              </label>
              <div class="text-center">
                <button @click="submitComments" class="btn btn-space btn-primary">提交</button>
                <a v-if="sharingComment.fileUrl != null" class="btn btn-space btn-primary" :href="downloadUrl">资料下载</a>
                <a @click="$router.go(-1)" class="btn btn-space btn-primary">返回</a>
              </div>
            </div>
            <!-- 评论 -->
            <span v-if="opinions.length > 0">{{opinions.length}}条评论</span>
            <div v-for="(opinion, index) in opinions" :key="index" class="review-area">
              <div class="comment-item"></div>
              <div class="panel-body" style="padding-top: 10px;">
                <span class="mdi mdi-github-alt"></span>&nbsp;<span>{{opinion.userName}}</span>
                <span class="current-time">{{opinion.createTime.substr(0, 10)}}</span>
              </div>
              <div class="panel-body" style="padding-top: 10px;">
                <span v-html="$global.format(opinion.description)"></span>
                <br/>
                <label style="color: #101010; width: 80%; padding-top: 10px;">
                  <span v-for="index in opinion.score" :key="index" class="mdi mdi-star-outline color-style"></span>
                </label>
              </div>
            </div>
            <!--<div class="comment-item"></div>-->
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

export default {
  data () {
    return {
      downloadUrl: '',
      shareCommand: {
        persons: [],
        title: '',
        tags: '',
        author: '',
        time: '',
        description: ''
      },
      starts: ['第1个', '第2个', '第3个', '第4个', '第5个'],
      cheakedStarts: [],
      taskCommand: {
        percent: '',
        level: '',
        userId: '',
        userName: ''
      },
      opinionScore: {
        score: '',
        description: '',
        shareId: 21,
        level: '',
        userId: '',
        userName: ''
      },
      opinions: []
    }
  },
  mounted () {
    this.getPersons()
  },
  computed: {
    ...mapState({
      personMsg: 'user',
      sharingComment: 'sharingComment'
    })
  },
  methods: {
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
      t.opinionScore.shareId = t.sharingComment.id
      if (t.opinionScore.shareId) {
        t.getOpinions(t.opinionScore.shareId)
      }
      t.downloadUrl = Global.url.apiGetSharingFileDownload + '?filename=' + this.sharingComment.title + '&fileUrl=' + t.sharingComment.fileUrl + '&token=' + t.personMsg.token
    },
    async getPersons () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.persons = result.data.data
        this.init()
      }
    },
    async getOpinions (shareId) {
      var api = Global.url.apiGetOpinions + '?shareId=' + shareId
      var result = await this.$api(api, '', 'GET')
      if (result != null && result.data && result.data.code === 200) {
        this.opinions = result.data.data
      }
    },
    makeScore (index) {
      for (var i = 0; i <= index; i++) {
        var nowTime = new Date().getTime()
        this.cheakedStarts.push(nowTime + '' + i)
        this.starts.splice(0, 1)
      }
    },
    delSore (key) {
      var len = this.cheakedStarts.length - key
      for (var i = 0; i < len; i++) {
        var nowTime = new Date().getTime()
        this.starts.push(nowTime + '' + i)
        this.cheakedStarts.splice(0, 1)
      }
    },
    async submitComments () {
      var t = this
      var api = Global.url.apiGetShareComments
      t.opinionScore.userName = t.taskCommand.userName
      t.opinionScore.userId = t.taskCommand.userId
      t.opinionScore.level = t.taskCommand.level
      t.opinionScore.score = t.cheakedStarts.length + ''
      if (this.validateForm()) {
        var result = await this.$api(api, t.opinionScore)
        if (result != null && result.data && result.data.code === 200) {
          t.cheakedStarts = []
          t.starts = ['第1个', '第2个', '第3个', '第4个', '第5个']
          t.opinionScore.description = ''
          // 调用获取评论接口
          t.getOpinions(t.opinionScore.shareId)
        } else if (result.data.code === 401) {
          t.$global.showMessage(result.data.message)
          t.cheakedStarts = []
          t.starts = ['第1个', '第2个', '第3个', '第4个', '第5个']
          t.opinionScore.description = ''
        }
      }
    },
    validateForm () {
      if (this.opinionScore.description.trim().length > 0) {
        return true
      } else {
        this.$global.showMessage('意见反馈不能为空！')
        return false
      }
    }
  }
}
</script>

<style scoped>
  .panel-heading-divider {
    text-align: center;
    border-bottom: 0px;
  }
  .panel-heading-divider > .panel-subtitle {
    text-align: center;
  }
  .panel {
    box-shadow: none;
  }
  .panel-body {
    padding: 3px;
  }
  .panel-body label {
    vertical-align: top;
  }
  .mdi-star-outline {
    transition: color 300ms ease-in-out;
    font-size: 20px;
    color: #696767;
  }
  .btn-space {
    width: 74px;
    margin-left: 15px;
  }
  .center{
    margin-left: 17%;
    text-align:left ;
    padding-top: 20px;
  }
  .comment-item {
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 8px;
  }
  .current-time {
    display: inline-block;
    float: right;
  }
  .color-style {
    color: #FF1705;
  }
  .mdi-star-outline {
    margin-right: 10px;
  }
  .col-md-12 {
    background-color: #FFFFFF;
    border-radius: 3px;
  }
  label.feedback {
    width: 68%;
  }
  @media (max-width: 767px) {
    label.feedback {
      width: 100%;
    }
  }
</style>
