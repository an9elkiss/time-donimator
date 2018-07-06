<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-body sharingComment">
          <div class="commentHeading cfix">
            <div class="fLeft">
              <span class="mdi mdi-circle"></span> {{temporaryData.title}}
            </div>
            <div class="fRight">
              标签： {{temporaryData.tags}}
            </div>
          </div>
          <div class="commentBody">
            <div class="cfix">
              <div class="fLeft">作者： {{temporaryData.author}}</div>
              <div class="fRight">时间： {{temporaryData.time}}</div>
            </div>
            <div>{{temporaryData.description}}</div>
            <div class="operatorDiv clearfix">
              <div class="col-xs-3 text-center"><span class="mdi mdi-thumb-up"></span> 5</div>
              <div class="col-xs-3 text-center" @click="toShareComments(21)"><span class="mdi mdi-comment-outline"></span> 5</div>
              <div class="col-xs-3 text-center" @click="toShareComments(21)"><span class="mdi mdi-star-outline"></span> 5</div>
              <div class="col-xs-3 text-center"><span class="mdi mdi-download"></span></div>
            </div>
          </div>
        </div>
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
export default {
  name: 'SharingCommentList',
  data () {
    return {
      temporaryData: {
        title: '第一次分享会',
        tags: '前端',
        author: '张三',
        time: '2017-07-03',
        description: '如果你无法简洁的表达你的想法，那只能说明你还不够了解。'
      }
    }
  },
  methods: {
    toShare () {
      this.$router.push({name: 'TrainingContent'})
    },
    toShareComments (shareId) {
      this.$router.push({name: 'ShareComments', query: {'shareId': shareId, 'title': this.temporaryData.title, 'tags': this.temporaryData.tags, 'author': this.temporaryData.author, 'time': this.temporaryData.time, 'description': this.temporaryData.description}})
    }
  }
}
</script>

<style scoped>
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
  div.operatorDiv span {
    font-size: 18px;
  }
</style>
