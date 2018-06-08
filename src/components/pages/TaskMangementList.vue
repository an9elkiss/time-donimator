<template>
  <div class="be-content taskMangementList">
    <div class="main-content container-fluid">
      <div class="flexBox m-b-15">
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
      <div id="accordion1" class="panel-group accordion">
        <div class="panel panel-default" v-for="(item,index_1) in tabLists" :key="index_1">
          <div class="panel-heading" @click="getTask(item.userId, timeFilter.year, timeFilter.month, timeFilter.week, index_1,)">
            <h4 class="panel-title font-16"><a data-toggle="collapse" data-parent="#accordion1" :href="'#collapse'+number[index_1]" class="collapsed p-all-10"><i class="icon mdi mdi-chevron-down"></i>{{item.name}}</a></h4>
          </div>
          <div v-if="item.taskLists" :id="'collapse'+number[index_1]" class="panel-collapse collapse" style="padding-bottom:10px;">
            <div class="panel-body p-r-b-l-5">
              <div class="m-b-10" v-for="(task,index_2) in item.taskLists.taskCommands" :key="index_2">
                <div class="panel panel-default panel-contrast list-body-new">
                  <div class="panel-heading p-all-10 font-14">{{item.name}}
                    <div class="tools"><span class="icon mdi mdi-edit m-r-10" @click="editTask()"></span><span data-toggle="modal" data-target="#mod-warning" class="icon mdi mdi-close" @click="closeTask()"></span></div>
                  </div>
                  <div class="panel-body panel-body-contrast p-all-10 list-p-box">
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
    <v-warn id="mod-warning"></v-warn>
  </div>
</template>
<script>
import Global from '@/components/Global'
import Warning from '../comModals/warning'
export default {
  data: function () {
    return {
      timeFilter: {
        year: 0,
        month: 0,
        week: 0,
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
      num: 0
    }
  },
  components: {
    'v-warn': Warning
  },
  created: function () {
    var now = new Date()
    this.timeFilter.year = now.getFullYear()
    this.timeFilter.month = now.getMonth() + 1
    this.initialWeek()
    this.initialWeekFromYearAndMonth()
  },
  mounted () {
    var t = this
    t.$nextTick(function () {
      t.loadPersons()
    })
  },
  methods: {
    async loadPersons () {
      var t = this
      const result = await t.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        var res = result.data
        t.tabLists = res.data
      }
    },
    changeSelect () {
      var t = this
      if (t.userId) {
        t.getTask(t.userId, t.timeFilter.year, t.timeFilter.month, t.timeFilter.week, t.num)
      }
    },
    changeYearOrMonth () {
      this.initialWeekFromYearAndMonth()
    },
    async getTask (id, y, m, w, i) {
      var t = this
      t.userId = id
      t.num = i
      const result = await t.$api(Global.url.apiGetTask + '?year=' + y + '&month=' + m + '&week=' + w + '&memberId=' + id, '', 'GET')
      if (result.data && result.data.code === 200) {
        var res = result.data
        t.tabLists[i].taskLists = Object.assign({}, res.data)
      }
    },
    addTask (data, i) {
      this.$router.push({name: 'TaskMangementDetail', params: data})
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
    }
  }
}

</script>
<style scoped>
  .btn-add {
    margin: 0 auto;
    display: block;
  }

  .m-b-10 {
    margin-bottom: 10px!important;
  }

  .m-b-15{
    margin-bottom: 15px!important;
  }

  .m-r-10 {
    margin-right: 10px!important;
  }

  .p-r-b-l-5 {
    padding: 0 5px 5px 5px !important;
  }

  .p-all-10{
    padding:10px!important;
  }

  .font-16{
    font-size:16px!important;
  }

  .font-14{
    font-size:14px!important;
  }

  .list-p-box p{
    margin-bottom: 5px!important;
    font-size:12px!important;
  }
</style>
