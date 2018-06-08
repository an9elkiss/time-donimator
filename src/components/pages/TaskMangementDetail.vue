<template>

  <div class="be-content panel panel-default panel-border-color panel-border-color-primary">
    <div class="panel-heading panel-heading-divider rel">张三/任务4</div>
    <div class="panel-body">
      <form action="#" class="form-horizontal group-border-dashed">
        <div class="form-group">
          <label class="col-sm-3 control-label">项目名称</label>
          <div class="col-sm-6">
            <select class="form-control input-sm" required="">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">任务类型</label>
          <div class="col-sm-6">
            <div class="be-checkbox">
              <input type="checkbox" required="" value="bar" id="e1" data-parsley-multiple="group1" data-parsley-errors-container="#error-container2">
              <label for="e1">Option 1</label>
            </div>
            <div class="be-checkbox">
              <input type="checkbox" required="" value="bar" id="e2" data-parsley-multiple="group1" data-parsley-errors-container="#error-container2">
              <label for="e2">Option 2</label>
            </div>
            <div class="be-checkbox">
              <input type="checkbox" required="" value="bar" id="e3" data-parsley-multiple="group1" data-parsley-errors-container="#error-container2">
              <label for="e3">Option 3</label>
            </div>
            <div id="error-container2"></div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">任务内容</label>
          <div class="col-sm-6">
            <textarea required="" class="form-control input-sm"></textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">贡献值</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="贡献值" class="form-control input-sm">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">实际值</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="实际值" class="form-control input-sm">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">当期状态</label>
          <div class="col-sm-6">
            <select class="form-control input-sm" required="">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">计划状态</label>
          <div class="col-sm-6">
            <select class="form-control input-sm" required="">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">计划日期</label>
          <div class="col-md-6">
            <div data-min-view="2" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker">
              <span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span><input size="16"
                type="text" required="" value="" class="form-control input-sm">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">工时（预估）</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="工时（预估）" class="form-control input-sm">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">工时（折算）</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="工时（折算）" class="form-control input-sm">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">工时（实际）</label>
          <div class="col-sm-6">
            <input data-parsley-type="number" type="text" required="" placeholder="工时（实际）" class="form-control input-sm">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">选择父任务</label>
          <div class="col-sm-6">
            <select class="form-control input-sm">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label"></label>
          <div class="be-checkbox col-sm-6" style=" text-align:left; padding: 0 12px;">
            <input id="check1" type="checkbox">
            <label for="check1">父任务</label>
          </div>
        </div>
        <div class="form-group">
          <div class="center">
            <button type="submit" class="btn btn-space btn-primary">提交</button>
            <button type="submit" class="btn btn-space btn-primary" @click="goBack">返回</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      task: {
        project: 'BYD',
        type: ['新功能', 'BUG'],
        task: '',
        num1: 0,
        num2: 1,
        state1: '未完成',
        state2: '已完成',
        date: '',
        time1: 2,
        time2: 1,
        time3: 1
      }
    }
  },
  mounted () {
    window.$(document).ready(function () {
      window.App.init()
      window.App.formElements()
    })
  },
  methods: {
    goBack () {
      this.$router.push({
        path: 'task-mangement-list'
      })
    }
  }
}

</script>
<style scoped>

</style>
