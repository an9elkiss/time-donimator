<template>
  <div class="be-content taskMangementList">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">时间筛选</div>
        <div class="panel-body">
          <div class="col-xs-4 col-sm-3 col-md-2 col-lg-2">
            <div class="pcPart">
              <select class="form-control input-sm" v-model="timeFilter.year" @change="changeYearOrMonth()">
                <option v-for="year in timeFilter.years" :key="year.id" :value="year.id">{{year.value}}</option>
              </select>
            </div>
            <div class="mobPart">
              <input-select title='选择年' :columns="yearColumns" state="true" :initial="timeFilter.year + '年'" @selectConfirmed="yearSelectChange"></input-select>
            </div>
          </div>
          <div class="col-xs-4 col-sm-3 col-md-2 col-lg-2">
            <div class="pcPart">
              <select class="form-control input-sm" v-model="timeFilter.month" @change="changeYearOrMonth()">
                <option :value="itemmonth.id" :key="itemmonth.id" v-for="itemmonth in timeFilter.months">{{itemmonth.value}}</option>
              </select>
            </div>
            <div class="mobPart">
              <input-select title='选择月份' :columns="monthColumns" state="true" :initial="timeFilter.months[timeFilter.month - 1].value" @selectConfirmed="monthSelectChange"></input-select>
            </div>
          </div>
          <div class="col-xs-4 col-sm-3 col-md-2 col-lg-2">
            <div class="pcPart">
              <select class="form-control input-sm" v-model="timeFilter.week" @change="changeSelect()">
                <option :value="itemweek.id" :key="itemweek.id" v-for="itemweek in timeFilter.weeks" v-if="itemweek.id <= timeFilter.maxWeek">{{itemweek.value}}</option>
              </select>
            </div>
            <div class="mobPart">
              <input-select title='选择周' :columns="weekColumns" state="true" :initial="timeFilter.weeks[timeFilter.week - 1].value" @selectConfirmed="weekSelectChange"></input-select>
            </div>
          </div>
        </div>
      </div>
      <div class="panel panel-default task-lists">
        <div class="panel-heading panel-heading-divider">人员列表</div>
        <div class="panel-body">
          <div id="accordion1" class="panel-group accordion">
            <div class="panel panel-default cfix" v-for="(item,index_1) in tabLists" :key="index_1">
              <div class="panel-heading" @click="getTasks(item.userId, timeFilter.year, timeFilter.month, timeFilter.week, index_1)">
                <h4 class="panel-title cfix" @click="infoSave(item)"><a data-toggle="collapse" data-parent="#accordion1" :href="'#collapse'+index_1" class="collapsed"><i class="icon mdi mdi-chevron-down"></i>{{item.name}}<span class="fRight">折算工时：{{item.taskResource.percentHoursTotal}}小时</span><span class="fRight">贡献值：{{item.taskResource.planScoreTotal}}</span></a></h4>
              </div>
              <div v-if="item.taskLists" :id="'collapse'+index_1" class="panel-collapse collapse" style="padding-bottom:15px;">
                <div class="panel-body">
                  <div class="task-block" :class="task.currentStatus === task.planStatus?'complete':''" v-for="(task,index_2) in item.taskLists.taskCommands" :key="index_2">
                    <van-icon name="success" v-if="task.currentStatus === task.planStatus"/>
                    <h2 class="cfix">
                      <span class="fLeft">任务{{index_2 + 1}}</span>
                      <div class="btn-group fRight">
                        <button class="btn btn-primary btn-sm" @click="getTaskCopy(task)">延后</button>
                        <button class="btn btn-primary btn-sm" @click="editTask(task, index_1, index_2)">编辑</button>
                        <button class="btn btn-primary btn-sm" @click="confirmTask(task, index_2)">删除</button>
                      </div>
                    </h2>
                    <div class="task-ul-list">
                      <div>
                        <p class="cfix"><span class="fLeft">任务编号：</span><span>{{task.code}}</span></p>
                        <p class="cfix"><span class="fLeft">任务名称：</span><span>{{task.title}}</span></p>
                      </div>
                      <p class="cfix"><span class="fLeft">任务描述：</span><span v-html="$global.format(task.description)"></span></p>
                      <p class="cfix"><span class="fLeft">任务类型：</span><span>{{task.tags}}</span></p>
                      <div>
                        <p><span>项目名称：</span><span>{{task.project}}</span></p>
                        <p><span>贡献值：</span><span>{{task.planScore}}</span></p>
                        <p><span>实际值：</span><span>{{task.actualScore}}</span></p>
                      </div>
                      <div>
                        <p class="cfix"><span class="fLeft">当期状态：</span><span>{{task.currentStatus}}</span></p>
                        <p class="cfix"><span class="fLeft">计划状态：</span><span>{{task.planStatus}}</span></p>
                        <p class="cfix"><span class="fLeft">计划日期：</span><span>{{task.endTime}}</span></p>
                      </div>
                      <div>
                        <p class="cfix"><span class="fLeft">预估工时：</span><span>{{task.planHours}}小时</span></p>
                        <p class="cfix"><span class="fLeft">折算工时：</span><span>{{task.percentHours}}小时</span></p>
                        <p class="cfix"><span class="fLeft">实际工时：</span><span v-if="task.actualHours">{{task.actualHours}}小时</span></p>
                      </div>
                      <p class="overflow-p" v-if="task.jiraUrl"><span>Jira：</span><a :href="task.jiraUrl" target="_blank">{{task.jiraUrl}}</a></p>
                      <div class="overflow-p" v-if="task.flowChartUrl"><span>流程图：</span><div><a v-for="(url, index) in task.flowChartUrl.split('\n')" :key="index" :href="url" target="_blank">{{url}}</a></div></div>
                      <div class="overflow-p" v-if="task.interfaceUrl"><span>接口文档：</span><div><a v-for="(url, index) in task.interfaceUrl.split('\n')" :key="index" :href="url" target="_blank">{{url}}</a></div></div>
                      <div class="overflow-p" v-if="task.dbDesignUrl"><span>数据设计：</span><div><a v-for="(url, index) in task.dbDesignUrl.split('\n')" :key="index" :href="url" target="_blank">{{url}}</a></div></div>
                    </div>
                  </div>
                </div>
                <button class="btn btn-space btn-primary btn-add" @click="addTask">新增任务</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Global from '@/components/Global'
import { Dialog } from 'vant'
import InputSelect from '@/components/unit/InputSelect'

export default {
  components: {InputSelect},
  data: function () {
    return {
      timeFilter: {
        year: 2018,
        month: 6,
        week: 2,
        maxWeek: 0,
        years: [{
          id: 2018,
          value: '2018年'
        }],
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
      memberIds: [],
      yearShow: false,
      monthShow: false,
      weekShow: false
    }
  },
  computed: {
    ...mapState({
      selectedMonth: 'selectedMonth',
      selectedWeek: 'selectedWeek'
    }),
    yearColumns: function () {
      return this.timeFilter.years.map(ele => {
        return ele.value
      })
    },
    monthColumns: function () {
      return this.timeFilter.months.map(ele => {
        return ele.value
      })
    },
    weekColumns: function () {
      return this.timeFilter.weeks.filter(ele => {
        return ele.id <= this.timeFilter.maxWeek
      }).map(ele => {
        return ele.value
      })
    },
    selectedDate: function () {
      return this.timeFilter.year + '年 ' + this.getValueFromId(this.timeFilter.months, this.timeFilter.month) + ' ' + this.getValueFromId(this.timeFilter.weeks, this.timeFilter.week)
    }
  },
  async created () {
    var now = new Date()
    this.timeFilter.year = now.getFullYear()
    this.initTimeFilterYears(this.timeFilter.year)
    await this.initialWeek()
    this.timeFilter.month = this.selectedMonth
    this.timeFilter.week = this.selectedWeek
    this.loadPersons()
  },
  activated () {
    if (this.userId) {
      this.getTasks(this.userId, this.timeFilter.year, this.timeFilter.month, this.timeFilter.week, this.num)
    }
    if (this.memberIds.toString()) {
      this.loadTaskParentResource(this.memberIds.toString(), this.tabLists)
    }
  },
  methods: {
    yearSelectChange (index) {
      this.timeFilter.year = this.timeFilter.years[index].id
      this.changeYearOrMonth()
    },
    monthSelectChange (index) {
      this.timeFilter.month = this.timeFilter.months[index].id
      this.changeYearOrMonth()
    },
    weekSelectChange (index) {
      this.timeFilter.week = this.timeFilter.weeks[index].id
      this.changeSelect()
    },
    initTimeFilterYears (nowYear) {
      let startYear = this.timeFilter.years[0].id
      while (startYear <= nowYear) {
        startYear += 1
        this.timeFilter.years.push({
          id: startYear,
          value: startYear + '年'
        })
      }
    },
    async loadPersons () {
      var t = this
      const result = await t.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        t.tabLists = result.data.data
        t.tabLists.forEach(function (ele) {
          ele.taskLists = {}
          ele.taskResource = {}
          t.memberIds.push(ele.userId)
        })
      }
      t.memberIds = t.memberIds.toString()
      t.loadTaskParentResource(t.memberIds, t.tabLists)
    },
    async loadTaskParentResource (ids, lists) {
      var t = this
      var obj = {}
      obj.year = t.timeFilter.year
      obj.month = t.timeFilter.month
      obj.week = t.timeFilter.week
      obj.userIds = ids
      const result = await t.$api(Global.url.apiGetTaskParentResource, obj)
      if (result.data && result.data.code === 200) {
        var res = result.data.data
        lists.forEach(function (ele, i) {
          ele.taskResource = res[ele.userId]
          t.$set(lists, i, lists[i])
        })
      }
    },
    changeSelect () {
      var t = this
      this.selectedDateCommitStore()
      t.loadTaskParentResource(t.memberIds, t.tabLists)
      if (t.userId) {
        t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
      }
    },
    changeYearOrMonth () {
      var t = this
      t.initialWeekFromYearAndMonth()
      t.selectedDateCommitStore()
      t.loadTaskParentResource(t.memberIds, t.tabLists)
      if (t.userId) {
        t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
      }
    },
    selectedDateCommitStore () {
      this.$store.commit('setSelectedMonth', this.timeFilter.month)
      this.$store.commit('setSelectedWeek', this.timeFilter.week)
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
    infoSave (person) {
      this.$store.commit('GetPersonMsg', person)
    },
    addTask () {
      this.$store.commit('setSelectedDate', this.selectedDate)
      this.$router.push({name: 'TaskMangementDetail'})
    },
    editTask (task, personIndex, taskListIndex) {
      this.$store.commit('setSelectedDate', this.selectedDate)
      this.$store.commit('setTaskList', this.tabLists[personIndex].taskLists.taskCommands)
      this.$router.push({name: 'TaskMangementDetail', query: {'id': task.taskWeekId, 'index': taskListIndex, 'flag': '0'}})
    },
    async closeTask (task, i) {
      var t = this
      t.taskIndex = i
      var result = await t.$api(Global.url.apiTaskDelete + '/' + task.taskWeekId, '', 'DELETE')
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
        this.timeFilter.month = result.data.data.month
        this.timeFilter.year = result.data.data.year
        this.selectedDateCommitStore()
        this.initialWeekFromYearAndMonth()
      }
    },
    async getTaskCopy (task) {
      var t = this
      var result = await t.$api(Global.url.apiTaskWeekCopy + '?year=' + t.timeFilter.year + '&month=' + t.timeFilter.month + '&week=' + t.timeFilter.week + '&taskWeekId=' + task.taskWeekId, '', 'GET')
      if (result.data) {
        this.$global.showResult(result.data)
      }
    },
    confirmTask (task, index) {
      var t = this
      Dialog.confirm({
        title: '警告',
        message: '确定要删除此任务' + (index + 1) + '吗？'
      }).then(async () => {
        var operatingResult = await t.closeTask(task, index)
        this.$global.showResult(operatingResult)
        if (operatingResult.code === 200) {
          t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
          t.loadTaskParentResource(t.memberIds, t.tabLists)
        }
      })
    },
    getValueFromId (objectArray, id) {
      for (var index in objectArray) {
        if (objectArray[index].id === id) {
          return objectArray[index].value
        }
      }
      return ''
    }
  }
}

</script>
<style scoped>
  div.col-xs-4.col-sm-3.col-md-2.col-lg-2 {
    padding: 0px;
  }
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
  .task-lists h4 a{
    font-size: 16px;
  }
  .task-lists h4 span{
    font-size: 12px;
    line-height: 28px;
    margin-left: 8px;
  }
  .task-block{
    background: rgba(245, 245, 245, 0.4);
    color: #454545;
    padding: 10px 20px;
    border-bottom: 1px solid rgba(225, 225, 225, 0.9);
    position: relative;
  }
  .task-block h2{
    font-size: 14px;
    margin-top: 0px;
    font-weight: bold;
    line-height: 30px;
  }
  .task-ul-list p{
    margin-bottom: 5px;
    font-size: 12px;
  }
  .task-ul-list > div {
    flex-wrap: wrap;
    display: flex;
    justify-content: flex-start
  }
  .task-ul-list > div p {
    flex-grow: 0;
    flex-basis: 33%;
    min-width: 220px;
  }
  .task-ul-list > p span{
    display: block;
  }
  .task-ul-list p span:first-child{
    width: 68px;
    display: inline-block;
  }
  .task-ul-list > p span:last-child{
    overflow: hidden;
  }
  .task-lists .accordion .panel .panel-collapse .panel-body{
    padding: 0px;
  }
  .task-lists .accordion .panel .panel-heading a .icon{
    margin-right: 5px;
  }
  div.complete {
    background-color: rgba(203, 251, 216, .1)
  }
  .btn-center{
    text-align: center;
  }
  .van-icon-success {
    position: absolute;
    bottom: 30%;
    right: 40px;
    color: green;
    opacity: 0.2;
    font-size: 80px;
  }
  .van-icon-extra:before {
    content: '\e626';
  }
  @media (max-width: 720px) {
    .van-icon-success {
      bottom: 40%;
      right: 45px;
    }
  }
  .overflow-p {
    display: flex;
    margin-bottom: 8px;
  }
  div.overflow-p {
    flex-wrap: nowrap;
    font-size: 12px;
  }
  .overflow-p > span {
    min-width: 68px;
  }
  .overflow-p > div {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .overflow-p a {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
