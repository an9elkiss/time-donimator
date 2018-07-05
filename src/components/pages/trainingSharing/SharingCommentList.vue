<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-body sharingComment">
          <div class="commentHeading cfix">
            <div class="fLeft">
              <span class="mdi mdi-circle"></span> 第一次分享会
            </div>
            <div class="fRight">
              标签： 前端
            </div>
          </div>
          <div class="commentBody">
            <div class="cfix">
              <div class="fLeft">作者： 张三</div>
              <div class="fRight">时间： 2017-07-03</div>
            </div>
            <div>如果你无法简洁的表达你的想法，那只能说明你还不够了解。</div>
            <div class="operatorDiv clearfix">
              <div class="col-xs-3 text-center"><span class="mdi mdi-thumb-up"></span> 5</div>
              <div class="col-xs-3 text-center"><span class="mdi mdi-comment-outline"></span> 5</div>
              <div class="col-xs-3 text-center"><span class="mdi mdi-star-outline"></span> 5</div>
              <div class="col-xs-3 text-center"><span class="mdi mdi-download"></span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="box-fixed">
        <div class="center">
          <a class="btn btn-space btn-primary">我要分享</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SharingCommentList'
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
