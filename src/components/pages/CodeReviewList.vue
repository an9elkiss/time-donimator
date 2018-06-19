<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">人员筛选</div>
        <div class="panel-body flexBox">
          <div class="boxFlex_1">
            <select class="form-control input-sm">
              <option>小明1</option>
              <option>小明2</option>
              <option>小明3</option>
              <option>小明4</option>
            </select>
          </div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-body">
          <div class="code-review-brief">
            <a class="cfix" href="#">
              <span class="fLeft heading">Code Review标题</span>
              <i class="mdi mdi-chevron-right fRight detail"></i>
              <span class="fRight date">2018-06-19</span>
            </a>
          </div>
          <div class="code-review-brief">
            <a class="cfix" href="#">
              <span class="fLeft heading">Code Review标题</span>
              <i class="mdi mdi-chevron-right fRight detail"></i>
              <span class="fRight date">2018-06-18</span>
            </a>
          </div>
        </div>
        <div class="panel-body text-center">
          <a class="btn btn-default">创建</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeReviewList'
}
</script>

<style scoped>
  .btn {
    border-radius: 5px;
    padding: 2px 20px;
  }
  .code-review-brief {
    padding: 10px;
    border-bottom: 1px solid #d9d9d9;
    vertical-align: middle;
  }
  .code-review-brief > a {
    color: black;
  }
  .code-review-brief .heading {
    font-size: 16px;
  }
  .code-review-brief .date {
    font-size: 14px;
  }
  .code-review-brief .detail {
    margin: 3px 0px 0px 5px;
  }
</style>
