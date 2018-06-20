<template>
  <div class="be-content codeReviewDetail">
    <div class="main-content container-fluid">
      <div class="panel panel-default code-review-header">
        <div class="panel-heading center">张三的code review<span class="panel-subtitle">2018-06-19</span></div>
        <div class="panel-body">
          <p>评委：张三</p>
          <p>得分：50分</p>
          <p class="code-review-tip cfix"><span class="fLeft dis-block">注：</span><span class="overflow-hidden dis-block">**如果你无法简洁的表达你的想法，那只说明你还不够了解它。</span></p>
        </div>
      </div>
      <div class="panel panel-default code-review-block">
        <div class="panel-heading panel-heading-divider">编码规范</div>
        <div class="panel-body">
          <h2>内容</h2>
          <p>编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容</p>
          <h2>得分：<span>50分</span></h2>
          <h2>备注</h2>
          <p>备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</p>
        </div>
      </div>
      <div class="panel panel-default code-review-block">
        <div class="panel-heading panel-heading-divider">业务完成度</div>
        <div class="panel-body">
          <h2>内容</h2>
          <p>编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容</p>
          <div>
            <h2>得分：<span>50分</span></h2>
            <h2>备注</h2>
            <p>备注备注备注备注备注备注备注备注备注备注备注备<br>注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</p>
          </div>
          <div>
            <form class="form-horizontal">
              <div class="form-group xs-mt-10">
                <label for="inputEmail3" class="col-sm-1 control-label bold">得分</label>
                <div class="col-sm-11">
                  <input id="inputEmail3" data-parsley-type="number" placeholder="请输入得分，限数字" class="form-control input-sm" onkeyup="value=value.replace(/[^\d]/g,'')">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-1 control-label bold">备注</label>
                <div class="col-sm-11">
                  <textarea class="form-control"></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="panel panel-default code-review-block">
        <div class="panel-heading panel-heading-divider">性能</div>
        <div class="panel-body">
          <h2>内容</h2>
          <p>编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容</p>
          <h2>得分：<span>50分</span></h2>
          <h2>备注</h2>
          <p>备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</p>
        </div>
      </div>
      <div class="panel panel-default code-review-block">
        <div class="panel-heading panel-heading-divider">日志及监控</div>
        <div class="panel-body ">
          <h2>内容</h2>
          <p>编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容</p>
          <h2>得分：<span>50分</span></h2>
          <h2>备注</h2>
          <p>备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</p>
        </div>
      </div>
      <div class="panel panel-default code-review-block">
        <div class="panel-heading panel-heading-divider">业务抽象</div>
        <div class="panel-body ">
          <h2>内容</h2>
          <p>编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容编码规范内容</p>
          <h2>得分：<span>50分</span></h2>
          <h2>备注</h2>
          <p>备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注备注</p>
        </div>
      </div>
      <button class="btn btn-space btn-primary btn-add">新增任务</button>
    </div>
  </div>
</template>
<script></script>
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
</style>
