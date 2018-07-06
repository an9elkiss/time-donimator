<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div v-for="comment in historyComments" :key="comment.id" class="panel-body sharingComment">
          <div class="commentHeading cfix">
            <div class="fLeft">
              <div class="circle"></div>{{comment.title}}
            </div>
            <div class="fRight">
              标签：{{comment.shareLabel}}
            </div>
          </div>
          <div class="commentBody">
            <div class="cfix">
              <div class="fLeft">作者：{{comment.userName}}</div>
              <div class="fRight">时间：{{comment.createTime.substr(0, 10)}}</div>
            </div>
            <div>
              <p v-html="$global.format(comment.description)" class="commentDescription"></p>
              <span class="descriptionDot"></span>
            </div>
            <div class="operatorDiv clearfix">
              <div class="col-xs-3 text-center"><span class="mdi mdi-thumb-up"></span>{{comment.praiseNum}}</div>
              <div class="col-xs-3 text-center" @click="toShareComments(comment)"><span class="mdi mdi-comment-outline"></span>{{comment.commentNum}}</div>
              <div class="col-xs-3 text-center" @click="toShareComments(comment)"><span class="mdi mdi-star-outline"></span>{{comment.average}}</div>
              <div class="col-xs-3 text-center" @click="downloadFile(comment.fileUrl, comment.title)"><span class="mdi mdi-download"></span></div>
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
      temporaryData: {
        title: '第一次分享会',
        tags: '前端',
        author: '张三',
        time: '2017-07-03',
        description: '如果你无法简洁的表达你的想法，那只能说明你还不够了解。'
      }
    }
  },
  async mounted () {
    await this.getCommentsByPageIndexAndSize()
    this.historyComments = this.newComments
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    toShare () {
      this.$router.push({name: 'TrainingContent'})
    },
    toShareComments (comment) {
      this.$store.commit('setSharingComment', comment)
      this.$router.push({name: 'ShareComments'})
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
    downloadFile (fileUrl, title) {
      console.log(fileUrl)
      console.log(title)
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
  div.operatorDiv > div {
    cursor: pointer;
  }
  div.operatorDiv span {
    font-size: 18px;
    margin-right: 4px;
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
