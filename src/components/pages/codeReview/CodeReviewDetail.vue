<template>
  <div class="be-content codeReviewDetail">
    <div class="main-content container-fluid">
      <div class="panel panel-default code-review-header">
        <div class="panel-heading center">张三的code review<span class="panel-subtitle">2018-06-19</span></div>
        <div class="panel-body">
          <div>
            <p>评委：张三</p>
            <p>得分：50分</p>
          </div>
          <p class="code-review-tip cfix"><span class="fLeft dis-block">注：</span><span class="overflow-hidden dis-block">*得分项为【优秀】【良好】【基本合格】【不合格】【无】，加分项酌情加5~20分；<br>**表示重点整治的问题，请加强重视，不要重犯；</span></p>
        </div>
      </div>
      <div class="panel panel-default code-review-block">
        <div class="panel-heading panel-heading-divider">编码规范</div>
        <div class="panel-body">
          <h2>内容</h2>
          <p>编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容</p>
          <div>
            <h2>得分：<span>50分</span></h2>
            <h2>备注</h2>
            <p>备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</p>
          </div>
          <div>
            <form class="form-horizontal">
              <div class="form-group xs-mt-10">
                <label class="col-sm-1 control-label bold">得分</label>
                <div class="col-sm-11">
                  <input data-parsley-type="number" placeholder="请输入得分限数字" class="form-control input-sm" onkeyup="value=value.replace(/[^\d]/g,'')" required="">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-1 control-label bold">备注</label>
                <div class="col-sm-11">
                  <textarea class="form-control" required=""></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="center code-btn">
        <button class="btn btn-space btn-primary btn-add">评分</button>
        <button class="btn btn-space btn-primary btn-add">编辑</button>
        <button class="btn btn-space btn-primary btn-add" @click="codeReviewDelete">删除</button>
        <button class="btn btn-space btn-primary btn-add">提交</button>
        <button class="btn btn-space btn-primary btn-add" @click="goBack">返回</button>
      </div>
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
      codeReviewDetailModules: [],
      isFlagScore: false
    }
  },
  computed: {
    ...mapState({
      codeReviewList: 'codeReview',
      codeReviewPerson: 'codeReviewPerson'
    })
  },
  mounted () {
    this.codeReviewInit()
    this.codeReviewInfo()
  },
  methods: {
    codeReviewInit () {
      this.isFlagScore = this.codeReviewList.flagScore
    },
    async codeReviewInfo () {
      var result = await this.$api(Global.url.apiGetCodeReviewInfo + '/' + this.$route.params.id, '', 'GET')
      if (result.data && result.data.code === 200) {
        console.log(result.data)
        this.codeReviewDetailModules = result.data.data
      }
    },
    async codeReviewDelete () {
      var result = await this.$api(Global.url.apiGetCodeReviewDelete + '/' + this.$route.params.id, '', 'GET')
      if (result.data && result.data.code === 200) {
        console.log(result.data)
        this.codeReviewDetailModules = result.data.data
      }
      Toast.success('成功文案')
      this.goBack()
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
