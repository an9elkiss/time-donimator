<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div v-for="comment in historyComments" :key="comment.id" class="panel-body sharingComment">
          <div @click="toShareComments(comment)" class="commentHeading cfix">
            <div class="fLeft">
              <div class="circle"></div>{{comment.title}}
            </div>
            <div v-if="comment.shareLabel" class="fRight">
              标签：{{comment.shareLabel}}
            </div>
          </div>
          <div class="commentBody">
            <div class="cfix">
              <div class="fLeft">作者：{{comment.userName}}</div>
              <div class="fRight">时间：{{comment.shareTime.substr(0, 10)}}</div>
            </div>
            <div>
              <p v-html="$global.format(comment.description)" class="commentDescription"></p>
              <span class="descriptionDot"></span>
            </div>
            <div class="operatorDiv clearfix">
              <div class="col-xs-3 text-center"><a @click="givePraise(comment)"><span class="mdi mdi-thumb-up"></span>{{isNullOrZoneOrMinus(comment.praiseNum)?'':comment.praiseNum}}</a></div>
              <div class="col-xs-3 text-center"><a @click="toShareComments(comment)"><span class="mdi mdi-comment-outline"></span>{{isNullOrZoneOrMinus(comment.commentNum)?'':comment.commentNum}}</a></div>
              <div class="col-xs-3 text-center"><a @click="toShareComments(comment)"><span class="mdi mdi-star-outline"></span>{{isNullOrZoneOrMinus(comment.average)?'':comment.average}}</a></div>
              <div class="col-xs-3 text-center"><a v-if="comment.fileUrl != null" :href="getUrl(comment.fileUrl, comment.title)"><span class="mdi mdi-download"></span></a></div>
            </div>
          </div>
        </div>
        <div v-if="scrollFlag" class="placeholder">
          <div v-if="hasNext" class="text-center endRemind">正在加载...</div>
          <div v-else class="text-center endRemind">没有更多的数据了</div>
        </div>
        <div v-else class="placeholder"></div>
      </div>
      <div class="box-fixed">
        <div class="center">
          <a class="btn btn-space btn-primary" @click="toShare">我要分享</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import {mapState} from 'vuex'

export default {
  name: 'SharingCommentList',
  data () {
    return {
      historyComments: [],
      newComments: [],
      pageIndex: 0,
      pageSize: 10,
      hasNext: true,
      scrollFlag: false,
      person: {}
    }
  },
  computed: {
    ...mapState({
      personMsg: 'user'
    })
  },
  async mounted () {
    await this.initialPerson()
    this.pageIndex = 0
    await this.getCommentsByPageIndexAndSize()
    this.historyComments = this.newComments
    window.addEventListener('scroll', this.handleScroll)
  },
  async activated () {
    await this.getRefreshComments()
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    isNullOrZoneOrMinus (number) {
      if (number == null || number <= 0) {
        return true
      }
      return false
    },
    toShare () {
      window.removeEventListener('scroll', this.handleScroll)
      this.$router.push({name: 'TrainingContent'})
    },
    toShareComments (comment) {
      window.removeEventListener('scroll', this.handleScroll)
      this.$store.commit('setSharingComment', comment)
      this.$router.push({name: 'ShareComments'})
    },
    getUrl (fileUrl, fileName) {
      return Global.url.apiGetSharingFileDownload + '?filename=' + fileName + '&fileUrl=' + fileUrl + '&token=' + this.personMsg.token
    },
    handleScroll () {
      var scrollTop = window.scrollY
      var maxScrollTop = document.body.scrollHeight - window.innerHeight
      if (scrollTop === maxScrollTop) {
        this.scrollFlag = true
        if (this.hasNext) {
          this.getCommentsByPageIndexAndSize()
        }
      }
    },
    async initialPerson () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        var persons = result.data.data
        for (var index in persons) {
          if (persons[index].userId === this.personMsg.id) {
            this.person = persons[index]
            return
          }
        }
      }
    },
    async givePraise (comment) {
      let sharePraiseScore = {
        shareId: comment.id,
        userId: this.person.userId,
        userName: this.person.name,
        level: this.person.level
      }
      let result = await this.$api(Global.url.apiSharePraise, sharePraiseScore, 'POST')
      if (result && result.data && result.data.code) {
        this.$global.showResult(result.data)
      }
      if (result && result.data && result.data.code === 200) {
        comment.praiseNum += 1
      }
    },
    async getCommentsByPageIndexAndSize () {
      this.pageIndex += 1
      let queryString = '?currentPage=' + this.pageIndex + '&size=' + this.pageSize
      let result = await this.$api(Global.url.apiGetSharingCommentsList + queryString, '', 'GET')
      this.scrollFlag = false
      if (result && result.data && result.data.code === 200) {
        this.newComments = result.data.data
        if (result.data.data.length === 0 || result.data.data.length < this.pageSize) {
          this.hasNext = false
        }
        for (let index in this.newComments) {
          this.historyComments.push(this.newComments[index])
        }
      }
    },
    async getRefreshComments () {
      if (this.pageIndex === 0) {
        return
      }
      let queryString = '?currentPage=1&size=' + this.pageIndex * this.pageSize
      let result = await this.$api(Global.url.apiGetSharingCommentsList + queryString, '', 'GET')
      if (result && result.data && result.data.code === 200) {
        this.historyComments = result.data.data
      }
    }
  }
}
</script>

<style scoped>
  div.placeholder {
    height: 30px;
  }
  div.commentHeading {
    margin: 10px 0px;
    cursor: pointer;
  }
  div.commentBody {
    background-color: #eee;
    border: 1px solid #eee;
    border-radius:  5px;
    padding: 0px 10px;
  }
  div.commentBody > div {
    margin: 10px 0px;
  }
  div.operatorDiv a {
    color: #404040;
    cursor: pointer;
  }
  div.operatorDiv span {
    font-size: 18px;
    margin-right: 4px;
    vertical-align: top;
  }
  div.circle {
    background-color: #404040;
    width: 8px;
    height: 8px;
    margin: 4px;
    border-radius: 50%;
    float: left;
  }
  div.commentHeading > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div.commentHeading > div.fLeft {
    max-width: 75%;
  }
  div.commentHeading > div.fRight {
    max-width: 25%;
    color: #aaaaaa;
  }
  div.endRemind {
    color: #555555;
    height: 100%;
    vertical-align: middle;
  }
  p.commentDescription {
    display: inline-block;
    overflow: hidden;
    font-size: 13px;
    line-height: 18px;
    height: 54px;
  }
  span.descriptionDot {
    display: inline;
    content: "...";
    font-size: 13px;
  }
</style>
