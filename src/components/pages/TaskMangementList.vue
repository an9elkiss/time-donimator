<template>
  <div class="be-content taskMangementList">
    <div class="main-content container-fluid">

      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">时间筛选</div>
        <div class="panel-body flexBox">
          <div class="boxFlex_1">
            <select class="form-control input-sm" v-model="timeFilter.year" @change="changeYearOrMonth()">
              <option value="2018">2018年</option>
            </select>
          </div>
          <div class="boxFlex_1">
            <select class="form-control input-sm" v-model="timeFilter.month" @change="changeYearOrMonth()">
              <option :value="itemmonth.id" :key="itemmonth.id" v-for="itemmonth in timeFilter.months">{{itemmonth.value}}</option>
            </select>
          </div>
          <div class="boxFlex_1">
            <select class="form-control input-sm" v-model="timeFilter.week" @change="changeSelect()">
              <option :value="itemweek.id" :key="itemweek.id" v-for="itemweek in timeFilter.weeks" v-if="itemweek.id <= timeFilter.maxWeek">{{itemweek.value}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="panel panel-default task-lists">
        <div class="panel-heading panel-heading-divider">人员列表</div>
        <div class="panel-body">
          <div id="accordion1" class="panel-group accordion">
            <div class="panel panel-default" v-for="(item,index_1) in tabLists" :key="index_1">
              <div class="panel-heading" @click="getTasks(item.userId, timeFilter.year, timeFilter.month, timeFilter.week, index_1,)">
                <h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion1" :href="'#collapse'+index_1" class="collapsed"><i class="icon mdi mdi-chevron-down"></i>{{item.name}}</a></h4>
              </div>
              <div v-if="item.taskLists" :id="'collapse'+index_1" class="panel-collapse collapse" style="padding-bottom:15px;">
                <div class="panel-body">
                  <div class="task-block" v-for="(task, index_2) in item.taskLists.taskCommands" :key="index_2">
                    <h2 class="cfix"><span class="fLeft">任务{{index_2 + 1}}</span><i class="icon mdi mdi-close fRight" data-toggle="modal" data-target="#mod-warning" @click="closeTask(task, index_2)"></i></h2>
                    <div class="task-ul-list">
                      <p class="cfix"><span class="fLeft">任务名称：</span><span>{{task.title}}</span></p>
                      <p class="cfix"><span class="fLeft">任务编号：</span><span>{{task.code}}</span></p>
                      <p class="cfix"><span class="fLeft">任务描述：</span><span>{{task.description}}</span></p>
                      <p class="cfix"><span class="fLeft">项目名称：</span><span>{{task.project}}</span></p>
                      <p class="cfix"><span class="fLeft">任务类型：</span><span>{{task.tags}}</span></p>
                      <p class="cfix"><span class="fLeft">贡献值：</span><span>{{task.planScore}}</span></p>
                      <p class="cfix"><span class="fLeft">实际值：</span><span>{{task.actualScore}}</span></p>
                      <p class="cfix"><span class="fLeft">当期状态：</span><span>{{task.currentStatus}}</span></p>
                      <p class="cfix"><span class="fLeft">计划状态：</span><span>{{task.planStatus}}</span></p>
                      <p class="cfix"><span class="fLeft">计划日期：</span><span>{{task.endTime}}</span></p>
                      <p class="cfix"><span class="fLeft">预估工时：</span><span>{{task.planHours}}小时</span></p>
                      <p class="cfix"><span class="fLeft">折算工时：</span><span>{{task.percentHours}}小时</span></p>
                      <p class="cfix"><span class="fLeft">实际工时：</span><span>{{task.actualScore}}小时</span></p>
                    </div>
                    <div class="btn-center">
                      <button class="btn btn-space btn-primary btn-sm" @click="getTaskCopy(task)">延后</button>
                      <button class="btn btn-space btn-primary btn-sm" @click="editTask(task)">编辑</button>
                    </div>
                  </div>
                </div>
                <button class="btn btn-space btn-primary btn-add" @click="addTask(item)">新增任务</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-warn id="mod-warning" @handleSureButtonClicked="sureButtonClicked" @handleCancelButtonClicked="cancelButtonClicked" :taskIndex="taskIndex"></v-warn>
    <result-modal :result="operatingResult" @handleConfirmButtonClicked="confirmButtonClicked()"></result-modal>
  </div>
</template>
<script>
// import { MessageBox } from 'mint-ui'
import Global from '@/components/Global'
import Warning from '../comModals/warning'
import ResultModal from '../comModals/ResultModal'
export default {
  data: function () {
    return {
      timeFilter: {
        year: 2018,
        month: 6,
        week: 2,
        maxWeek: 0,
        months: [{
          id: 1,
          value: '1月'
        }, {
          id: 2,
          value: '2月'
        }, {
          id: 3,
          value: '3月'
        }, {
          id: 4,
          value: '4月'
        }, {
          id: 5,
          value: '5月'
        }, {
          id: 6,
          value: '6月'
        }, {
          id: 7,
          value: '7月'
        }, {
          id: 8,
          value: '8月'
        }, {
          id: 9,
          value: '9月'
        }, {
          id: 10,
          value: '10月'
        }, {
          id: 11,
          value: '11月'
        }, {
          id: 12,
          value: '12月'
        }],
        weeks: [{
          id: 1,
          value: '第一周'
        }, {
          id: 2,
          value: '第二周'
        }, {
          id: 3,
          value: '第三周'
        }, {
          id: 4,
          value: '第四周'
        }, {
          id: 5,
          value: '第五周'
        }, {
          id: 6,
          value: '第六周'
        }]
      },
      number: ['One', 'Two', 'Three', 'Four'],
      tabLists: [],
      userId: '',
      num: 0,
      operatingTask: {},
      taskIndex: '',
      operatingResult: {
        message: '',
        code: ''
      }
    }
  },
  components: {
    ResultModal,
    'v-warn': Warning
  },
  mounted () {
    this.$nextTick(function () {
      this.loadPersons()
    })
  },
  created: function () {
    var now = new Date()
    this.timeFilter.year = now.getFullYear()
    this.timeFilter.month = now.getMonth() + 1
    this.initialWeek()
    this.initialWeekFromYearAndMonth()
  },
  methods: {
    async loadPersons () {
      var t = this
      const result = await t.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        t.tabLists = result.data.data
        t.tabLists.forEach(function (ele) {
          ele.taskLists = {}
        })
      }
    },
    changeSelect () {
      var t = this
      if (t.userId) {
        t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
      }
    },
    changeYearOrMonth () {
      this.initialWeekFromYearAndMonth()
    },
    async getTasks (id, y, m, w, i) {
      var t = this
      t.userId = id
      t.num = i
      const result = await t.$api(Global.url.apiGetTasks + '?year=' + y + '&month=' + m + '&week=' + w + '&memberId=' + id, '', 'GET')
      if (result.data && result.data.code === 200) {
        var res = result.data
        t.tabLists[i].taskLists = res.data
        t.$set(t.tabLists, i, t.tabLists[i])
      }
    },
    addTask (task) {
      this.$router.push({name: 'TaskMangementDetail'})
      this.$store.commit('GetPersonMsg', task)
    },
    editTask (task) {
      this.$router.push({name: 'TaskMangementDetail', params: {'id': task.taskWeekId, 'flag': 'flag'}})
    },
    async closeTask (task, i) {
      var t = this
      t.taskIndex = i
      const result = await t.$api(Global.url.apiTaskDelete + '/' + task.taskWeekId, '', 'DELETE')
      return result.data
    },
    async initialWeekFromYearAndMonth () {
      var result = await this.$api(Global.url.apiGetWeekFromYearAndMonth + '?year=' + this.timeFilter.year + '&month=' + this.timeFilter.month, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.timeFilter.maxWeek = result.data.data
      }
    },
    async initialWeek () {
      var result = await this.$api(Global.url.apiGetWeek, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.timeFilter.week = result.data.data.week
      }
    },
    async getTaskCopy (task) {
      var t = this
      var result = await t.$api(Global.url.apiTaskWeekCopy + '?year=' + t.timeFilter.year + '&month=' + t.timeFilter.month + '&week=' + t.timeFilter.week + '&taskWeekId=' + task.taskWeekId, '', 'GET')
      if (result.data && result.data.code === 200) {
        t.operatingResult = result.data
      }
    },
    markUpTask (task) {
      this.operatingTask = task
    },
    async sureButtonClicked () {
      var t = this
      if (t.operatingTask) {
        t.operatingResult = await t.closeTask(t.operatingTask)
        t.operatingTask = {}
        if (t.operatingResult.code === 200) {
          t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
        }
      }
    },
    cancelButtonClicked () {
      this.operatingTask = {}
    },
    confirmButtonClicked () {
      this.operatingResult = {}
    }
  }
}

</script>
<style scoped>
  .btn-add {
    margin: 15px auto 0;
    display: block;
  }
  .task-lists .panel{
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1)
  }
  .task-lists .accordion .panel .panel-heading a.collapsed{
    padding: 10px;
  }
  .task-lists .panel-full{
    background-color: #f5f5f5;
    color: #000;
  }
  .task-block{
    background: rgba(245, 245, 245, 0.4);
    color: #454545;
    padding: 10px 20px;
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1)
  }
  .task-block h2{
    font-size: 14px;
    margin-top: 0px;
    font-weight: bold;
  }
  .task-ul-list p{
    margin-bottom: 5px;
    font-size: 12px;
  }
  .task-ul-list p span{
    display: block;
  }
  .task-ul-list p span:first-child{
    width: 68px;
  }
  .task-ul-list p span:last-child{
    overflow: hidden;
  }
  .task-lists .accordion .panel .panel-collapse .panel-body{
    padding: 0px;
  }
  .btn-center{
    text-align: center;
  }
</style>
