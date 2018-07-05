<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="col-md-12">
          <div class="panel">
            <div class="panel-heading panel-heading-divider">第一次分享会<span class="panel-subtitle">张三 2018-07-03</span>
            </div>
            <div class="panel-body">
              <label style="color: #101010">标签： </label>&nbsp;&nbsp;
              <label style="color: #101010">前端</label>
            </div>
            <div class="panel-body">
              <label style="color: #101010">简介： </label>&nbsp;&nbsp;
              <label style="color: #101010; width: 80%; vertical-align:text-top">
                Quisque gravida aliquam diam at cursus,
                quisque laoreet ac lectus a rhoncusac tempus odio.
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
              <label style="color: #101010; width: 68%; vertical-align:text-top">
                <textarea v-model="opinionScore.description" rows="4" class="form-control input-sm"></textarea>
              </label>
              <div class="center">
                <button @click="submitComments" class="btn btn-space btn-primary">提交</button>
                <button class="btn btn-space btn-primary">资料下载</button>
              </div>
            </div>
            <!-- 评论 -->
            <span v-if="opinions.length > 0">{{opinions.length}}条评论</span>
            <div v-for="(opinion, index) in opinions" :key="index" class="review-area">
              <div class="comment-item"></div>
              <div class="panel-body" style="padding-top: 10px;">
                <span class="mdi mdi-github-alt"></span>&nbsp;<span>{{opinion.userName}}</span>
                <span class="current-time">{{opinion.createTime}}</span>
              </div>
              <div class="panel-body" style="padding-top: 10px;">
                <span>{{opinion.description}}</span>
                <br/>
                <label style="color: #101010; width: 80%; padding-top: 10px;">
                  <span v-for="index in opinion.score" :key="index" class="mdi mdi-star-outline color-style"></span>
                </label>
              </div>
            </div>
            <div class="comment-item"></div>
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
    // var self = this
    window.$(document).ready(function () {
      window.App.init()
      window.App.formElements()
    })
    this.init()
  },
  computed: {
    ...mapState({
      personMsg: 'person'
    })
  },
  methods: {
    init () {
      var t = this
      t.taskCommand.userName = t.personMsg.name
      t.taskCommand.userId = t.personMsg.userId
      t.taskCommand.level = t.personMsg.level
      t.taskCommand.percent = t.personMsg.percent
      t.opinionScore.shareId = t.$route.query.id
      if (t.opinionScore.shareId) {
        t.getOpinions(t.opinionScore.shareId)
      }
    },
    async getOpinions (shareId) {
      var api = Global.url.apiGetOpinions + '?shareId=' + shareId
      var result = await this.$api(api, '', 'GET')
      if (result != null && result.data && result.data.code === 200) {
        console.log(result.data.data)
        this.opinions = result.data.data
        // for (var aaaa of this.opinions) {
        //   console.log(aaaa)
        // }
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
      var aa = false
      if (aa) {
        this.$global.showMessage('您已经评论过一次了！')
      } else {
        var t = this
        var api = Global.url.apiGetShareComments
        t.opinionScore.userName = t.taskCommand.userName
        t.opinionScore.userId = t.taskCommand.userId
        t.opinionScore.level = t.taskCommand.level
        t.opinionScore.score = t.cheakedStarts.length + ''
        t.opinionScore.shareId = 21
        var result = await this.$api(api, t.opinionScore)
        if (result != null && result.data && result.data.code === 200) {
          t.cheakedStarts = []
          t.starts = ['第1个', '第2个', '第3个', '第4个', '第5个']
          t.opinionScore.description = ''
          console.log('巴拉巴拉')
          // 调用获取评论接口
          t.getOpinions(t.opinionScore.shareId)
          // aaaaaaaa
        } else if (result.data.code === 401) {
          t.$global.showMessage(result.data.message)
          t.cheakedStarts = []
          t.starts = ['第1个', '第2个', '第3个', '第4个', '第5个']
          t.opinionScore.description = ''
          t.getOpinions(t.opinionScore.shareId)
        }
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
  .panel {
    box-shadow: none;
  }
  .panel-body {
    padding: 3px;
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
</style>
