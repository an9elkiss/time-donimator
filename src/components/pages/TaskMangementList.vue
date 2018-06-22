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
                <h4 class="panel-title cfix"><a data-toggle="collapse" data-parent="#accordion1" :href="'#collapse'+index_1" class="collapsed"><i class="icon mdi mdi-chevron-down"></i>{{item.name}}<span class="fRight">折算工时：{{item.taskResource.percentHoursTotal}}小时</span><span class="fRight">贡献值：{{item.taskResource.planScoreTotal}}</span></a></h4>
              </div>
              <div v-if="item.taskLists" :id="'collapse'+index_1" class="panel-collapse collapse" style="padding-bottom:15px;">
                <div class="panel-body">
                  <div class="task-block" v-for="(task,index_2) in item.taskLists.taskCommands" :key="index_2">
                    <h2 class="cfix">
                      <span class="fLeft">任务{{index_2 + 1}}</span>
                      <div class="btn-group fRight">
                        <button class="btn btn-primary btn-sm" @click="getTaskCopy(task)">延后</button>
                        <button class="btn btn-primary btn-sm" @click="editTask(task)">编辑</button>
                        <button class="btn btn-primary btn-sm" @click="confirmTask(task, index_2)">删除</button>
                        <!--<button type="button" class="btn btn-default"><i class="icon mdi mdi-time-restore" @click="getTaskCopy(task)"></i></button>-->
                        <!--<button type="button" class="btn btn-default"><i class="icon mdi mdi-edit" @click="editTask(task)"></i></button>-->
                        <!--<button type="button" class="btn btn-default"><i class="icon mdi mdi-delete" data-toggle="modal" data-target="#mod-warning" @click="markUpTask(task, index_2)"></i></button>-->
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
                        <p class="cfix"><span class="fLeft">实际工时：</span><span v-if="task.actualScore">{{task.actualScore}}小时</span></p>
                      </div>
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Global from '@/components/Global'
import { Dialog, Toast } from 'vant'

// export default {
//   created: function () {
//     var now = new Date()
//     this.timeFilter.year = now.getFullYear()
//     this.initialWeek()
//     this.timeFilter.month = this.selectedMonth
//     this.timeFilter.week = this.selectedWeek
//   },
//   methods: {
//     async loadPersons () {
//       var t = this
//       const result = await t.$api(Global.url.apiPersons, '', 'GET')
//       if (result.data && result.data.code === 200) {
//         t.tabLists = result.data.data
//         t.tabLists.forEach(function (ele) {
//           ele.taskLists = {}
//           ele.taskResource = {}
//           t.memberIds.push(ele.userId)
//         })
//       }
//       t.memberIds = t.memberIds.toString()
//       t.loadTaskParentResource(t.memberIds, t.tabLists)
//     },
//     async loadTaskParentResource (ids, lists) {
//       var t = this
//       var obj = {}
//       obj.year = t.timeFilter.year
//       obj.month = t.timeFilter.month
//       obj.week = t.timeFilter.week
//       obj.userIds = ids
//       const result = await t.$api(Global.url.apiGetTaskParentResource, obj)
//       if (result.data && result.data.code === 200) {
//         var res = result.data.data
//         lists.forEach(function (ele, i) {
//           ele.taskResource = res[ele.userId]
//           t.$set(lists, i, lists[i])
//         })
//       }
//     },
//     changeSelect () {
//       var t = this
//       this.selectedDateCommitStore()
//       t.loadTaskParentResource(t.memberIds, t.tabLists)
//       if (t.userId) {
//         t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
//       }
//     },
//     changeYearOrMonth () {
//       var t = this
//       t.initialWeekFromYearAndMonth()
//       t.selectedDateCommitStore()
//       t.loadTaskParentResource(t.memberIds, t.tabLists)
//       if (t.userId) {
//         t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
//       }
//     },
//     selectedDateCommitStore () {
//       this.$store.commit('setSelectedMonth', this.timeFilter.month)
//       this.$store.commit('setSelectedWeek', this.timeFilter.week)
//     },
//     async getTasks (id, y, m, w, i) {
//       var t = this
//       t.userId = id
//       t.num = i
//       const result = await t.$api(Global.url.apiGetTasks + '?year=' + y + '&month=' + m + '&week=' + w + '&memberId=' + id, '', 'GET')
//       if (result.data && result.data.code === 200) {
//         var res = result.data
//         t.tabLists[i].taskLists = res.data
//         t.$set(t.tabLists, i, t.tabLists[i])
//       }
//     },
//     addTask (task) {
//       this.$router.push({name: 'TaskMangementDetail'})
//       this.$store.commit('GetPersonMsg', task)
//       this.$store.commit('setSelectedDate', this.selectedDate)
//     },
//     editTask (task) {
//       this.$router.push({name: 'TaskMangementDetail', query: {'id': task.taskWeekId, 'flag': '0'}})
//       this.$store.commit('setSelectedDate', this.selectedDate)
//     },
//     async closeTask (task, i) {
//       var t = this
//       t.taskIndex = i
//       const result = await t.$api(Global.url.apiTaskDelete + '/' + task.taskWeekId, '', 'DELETE')
//       return result.data
//     },
//     async initialWeekFromYearAndMonth () {
//       var result = await this.$api(Global.url.apiGetWeekFromYearAndMonth + '?year=' + this.timeFilter.year + '&month=' + this.timeFilter.month, '', 'GET')
//       if (result.data && result.data.code === 200) {
//         this.timeFilter.maxWeek = result.data.data
//       }
//     },
//     async initialWeek () {
//       var result = await this.$api(Global.url.apiGetWeek, '', 'GET')
//       if (result.data && result.data.code === 200) {
//         this.timeFilter.week = result.data.data.week
//         this.timeFilter.month = result.data.data.month
//         this.selectedDateCommitStore()
//         this.initialWeekFromYearAndMonth()
//       }
//     },
//     async getTaskCopy (task) {
//       var t = this
//       var result = await t.$api(Global.url.apiTaskWeekCopy + '?year=' + t.timeFilter.year + '&month=' + t.timeFilter.month + '&week=' + t.timeFilter.week + '&taskWeekId=' + task.taskWeekId, '', 'GET')
//       if (result.data && result.data.code === 200) {
//         t.operatingResult = result.data
//       }
//     },
//     confirmTask (task, index) {
//       var t = this
//       Dialog.confirm({
//         title: '警告',
//         message: '确定要删除此任务' + (index + 1) + '吗？'
//       }).then(async () => {
//         var operatingResult = await t.closeTask(task, index)
//         this.showResult(operatingResult)
//         if (operatingResult.code === 200) {
//           t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
//         }
//       })
//     },
//     showResult (result) {
//       var title = false
//       var message = ''
//       if (!result || !result.hasOwnProperty('code') || result.code === '') {
//         title = false
//         message = '获取数据失败'
//       } else if (result.code === 200) {
//         title = true
//         message = '操作成功'
//       } else {
//         title = false
//         message = result.message
//       }
//       if (title) {
//         Toast.success(message)
//       } else {
//         Toast.fail(message)
//       }
//     },
//     confirmButtonClicked () {
//       this.operatingResult = {}
//     },
//     getValueFromId (objectArray, id) {
//       for (var index in objectArray) {
//         if (objectArray[index].id === id) {
//           return objectArray[index].value
//         }
//       }
//       return ''
//     }
//   }
// }
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
      },
      memberIds: []
    }
  },
  mounted () {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  created () {
    var now = new Date()
    this.timeFilter.year = now.getFullYear()
    this.getSelectedDateFromStore()
    if (this.timeFilter.month == null) {
      this.timeFilter.month = now.getMonth() + 1
    }
    if (this.timeFilter.week == null) {
      this.initialWeek()
    }
    this.initialWeekFromYearAndMonth()
    this.loadPersons()
  },
  methods: {
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
    getSelectedDateFromStore () {
      this.timeFilter.month = this.selectedMonth
      this.timeFilter.week = this.selectedWeek
    },
    async getTasks (id, y, m, w, i) {
      var t = this
      t.userId = id
      t.num = i
      const result = await t.$api(Global.url.apiGetTasks + '?year=' + y + '&month=' + m + '&week=' + w + '&memberId=' + id, '', 'GET')
      if (result.data && result.data.code === 200) {
        var res = result.data.data
        res.taskCommands.forEach(function (ele) {
          ele.description = t.$global.format(ele.description)
        })
        t.tabLists[i].taskLists = res
        t.$set(t.tabLists, i, t.tabLists[i])
      }
    },
    addTask (task) {
      this.$router.push({name: 'TaskMangementDetail'})
      this.$store.commit('GetPersonMsg', task)
      this.$store.commit('setSelectedDate', this.selectedDate)
    },
    editTask (task) {
      this.$router.push({name: 'TaskMangementDetail', query: {'id': task.taskWeekId, 'flag': '0'}})
      this.$store.commit('setSelectedDate', this.selectedDate)
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
      }
    },
    async getTaskCopy (task) {
      var t = this
      var result = await t.$api(Global.url.apiTaskWeekCopy + '?year=' + t.timeFilter.year + '&month=' + t.timeFilter.month + '&week=' + t.timeFilter.week + '&taskWeekId=' + task.taskWeekId, '', 'GET')
      if (result.data && result.data.code === 200) {
        t.operatingResult = result.data
      }
    },
    confirmTask (task, index) {
      var t = this
      Dialog.confirm({
        title: '警告',
        message: '确定要删除此任务' + (index + 1) + '吗？'
      }).then(async () => {
        var operatingResult = await t.closeTask(task, index)
        this.showResult(operatingResult)
        if (operatingResult.code === 200) {
          t.getTasks(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
        }
      })
    },
    showResult (result) {
      var title = false
      var message = ''
      if (!result || !result.hasOwnProperty('code') || result.code === '') {
        title = false
        message = '获取数据失败'
      } else if (result.code === 200) {
        title = true
        message = '操作成功'
      } else {
        title = false
        message = result.message
      }
      if (title) {
        Toast.success(message)
      } else {
        Toast.fail(message)
      }
    },
    confirmButtonClicked () {
      this.operatingResult = {}
    },
    getValueFromId (objectArray, id) {
      for (var index in objectArray) {
        if (objectArray[index].id === id) {
          return objectArray[index].value
        }
      }
      return ''
    },
    beforeunloadHandler (e) {
      this.timeFilter.month = null
      this.timeFilter.week = null
      this.selectedDateCommitStore()
    }
  },
  computed: {
    ...mapState({
      selectedMonth: 'selectedMonth',
      selectedWeek: 'selectedWeek'
    }),
    selectedDate: function () {
      return this.timeFilter.year + '年 ' + this.getValueFromId(this.timeFilter.months, this.timeFilter.month) + ' ' + this.getValueFromId(this.timeFilter.weeks, this.timeFilter.week)
    }
  },
  destroyed: function () {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
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
    box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1)
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
  .btn-center{
    text-align: center;
  }
</style>
