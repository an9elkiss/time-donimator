<template>
  <div class="be-content taskMangementList">
    <div class="main-content container-fluid">
          <form action="#" class="form-horizontal">
            <div class="form-group cfix">
              <!--<span class="list-time-filter fLeft">时间筛选：</span>-->
              <!--<div class="fLeft">-->
                <div class="form-group">
                  <div class="col-sm-2">
                    <select class="form-control input-sm" v-model="timeFilter.year">
                                  <option value="2018年">2018年</option>
                                </select>
                  </div>
                  <div class="col-sm-2">
                    <select class="form-control input-sm" v-model="timeFilter.month">
                                  <option :value="itemmonth" :key="itemmonth" v-for="itemmonth in timeFilter.months">{{itemmonth}}</option>
                                </select>
                  </div>
                  <div class="col-sm-2">
                    <select class="form-control input-sm" v-model="timeFilter.week">
                                  <option :value="itemweek" :key="itemweek" v-for="itemweek in timeFilter.weeks">{{itemweek}}</option>
                                </select>
                  </div>
                <!--</div>-->
                <!--<select id="icon-category" class="select2" v-model="timeFilter.year">
                    <option value="2018年">2018年</option>
                  </select>
                <select id="icon-category" class="select2" v-model="timeFilter.month">
                    <option :value="itemmonth" :key="itemmonth" v-for="itemmonth in timeFilter.months">{{itemmonth}}</option>
                  </select>
                <select id="icon-category" class="select2" v-model="timeFilter.week">
                    <option :value="itemweek" :key="itemweek" v-for="itemweek in timeFilter.weeks">{{itemweek}}</option>
                  </select>-->
              </div>
            </div>
          </form>
      <div id="accordion1" class="panel-group accordion">
        <div class="panel panel-default" v-for="(item,index_1) in tabLists" :key="index_1">
          <div class="panel-heading">
            <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion1" :href="'#collapse'+number[index_1]" class="collapsed"><i class="icon mdi mdi-chevron-down"></i>{{item.name}}</a></h4>
          </div>
          <div :id="'collapse'+number[index_1]" class="panel-collapse collapse" style="padding-bottom:10px;">
            <!-- collapse in-->
            <div class="panel-body list-pad-5">
              <!--<div class="well well-sm" v-for="(task,index_2) in item.taskLists">
                <router-link :to="{name:'TaskMangementDetail'}">{{task.name}}</router-link>
                <div class="tools"><span class="icon mdi mdi-close"></span></div>
              </div>-->
              <div class="col-md-4" v-for="(task,index_2) in item.taskLists" :key="index_2">
                <div class="panel panel-default panel-contrast list-body-new">
                  <div class="panel-heading">{{task.name}}
                    <div class="tools"><span class="icon mdi mdi-edit list-mr-10" @click="editTask()"></span><span data-toggle="modal" data-target="#mod-warning"
                        class="icon mdi mdi-close" @click="closeTask()"></span></div>
                  </div>
                  <div class="panel-body panel-body-contrast list-pad-15">
                    <p>项目：BYD</p>
                    <p>类型：新功能</p>
                    <p>任务：pts经销商维护功能上生产、frontend、微信商城都要上，试驾的缓存结构调整了</p>
                    <p>贡献值：0</p>
                    <p>实际值：1</p>
                    <p>当期状态：2</p>
                    <p>计划状态：2</p>
                    <p>计划日期：2</p>
                    <p>工时（预估）：2</p>
                    <p>工时（折算）：2</p>
                    <p>工时（实际）：2</p>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn btn-space btn-primary btn-add" @click="addTask(item,index_1)">新增任务</button>
          </div>
        </div>
      </div>
    </div>

    <!--<div id="mod-warning" tabindex="-1" role="dialog" class="modal fade">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <div class="text-warning"><span class="modal-main-icon mdi mdi-alert-triangle"></span></div>
              <h3>Warning!</h3>
              <p>确定要删除此任务吗？</p>
              <div class="xs-mt-50">
                <button type="button" data-dismiss="modal" class="btn btn-space btn-default">取消</button>
                <button type="button" data-dismiss="modal" class="btn btn-space btn-warning">确定</button>
              </div>
            </div>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>-->
    <v-warn id="mod-warning"></v-warn>
  </div>
</template>
<script>
import Warning from '../comModals/warning'
export default {
  data () {
    return {
      timeFilter: {
        year: '2018年',
        month: '6月',
        week: '第1周',
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weeks: ['第1周', '第2周', '第3周', '第4周', '第5周']
      },
      number: ['One', 'Two', 'Three', 'Four'],
      tabLists: [{
        name: '张三',
        level: 'T4',
        title: '开发工程师',
        conversionRate: '0.8',
        taskLists: [{
          id: 1,
          name: '任务1'
        }, {
          id: 2,
          name: '任务2'
        },
        {
          id: 3,
          name: '任务3'
        },
        {
          id: 4,
          name: '任务4'
        }
        ]
      },
      {
        name: '张三',
        level: 'T4',
        title: '开发工程师',
        conversionRate: '0.8',
        taskLists: [{
          id: 1,
          name: '任务1'
        }, {
          id: 2,
          name: '任务2'
        },
        {
          id: 3,
          name: '任务3'
        },
        {
          id: 4,
          name: '任务4'
        }
        ]
      },
      {
        name: '张三',
        level: 'T4',
        title: '开发工程师',
        conversionRate: '0.8',
        taskLists: [{
          id: 1,
          name: '任务1'
        }, {
          id: 2,
          name: '任务2'
        },
        {
          id: 3,
          name: '任务3'
        },
        {
          id: 4,
          name: '任务4'
        }
        ]
      },
      {
        name: '张三',
        level: 'T4',
        title: '开发工程师',
        conversionRate: '0.8',
        taskLists: [{
          id: 1,
          name: '任务1'
        }, {
          id: 2,
          name: '任务2'
        },
        {
          id: 3,
          name: '任务3'
        },
        {
          id: 4,
          name: '任务4'
        }
        ]
      }
      ]
    }
  },
  components: {
    'v-warn': Warning
  },
  mounted () {

  },
  methods: {
    addTask (data, i) {
      // this.$emit('addData', data, i)
      this.$router.push({
        path: 'task-mangement-detail'
      })
    },
    editTask (data, i) {

    },
    closeTask (data, i) {

    }
  }
}

</script>
<style scoped>
  .taskMangementList .well {
    margin-bottom: 12px;
  }

  .taskMangementList .well a {
    color: #404040;
    cursor: pointer;
  }

  .btn-add {
    margin: 0 auto;
    display: block;
  }

  .list-body-new .panel-heading {
    padding: 10px;
  }

  .list-body-new p {
    margin-bottom: 5px;
  }

  .taskMangementList .col-md-4 {
    margin-bottom: 10px;
  }

  .list-time-filter {}

  .taskMangementList .list-pad-5 {
    padding: 0 5px 5px 5px !important;
  }

  .taskMangementList .list-pad-15 {
    padding: 15px !important;
  }

  .taskMangementList .list-mr-10 {
    margin-right: 10px;
  }

</style>
