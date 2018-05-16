<template>
  <div class="be-content">

    <div class="main-content container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="widget widget-fullwidth">
            <div class="widget-head">
              <div class="tools">
                <span class="icon mdi mdi-chevron-down"></span>
                <span class="icon mdi mdi-refresh-sync"></span>
                <span class="icon mdi mdi-close"></span>
              </div>
              <span class="title">{{month}}月份 {{typeName}} 报表</span>
              <span class="description">可以切换月份和工作日志类型</span>
            </div>
            <div class="widget-chart-container">
              <div id="line-chart3" style="height: 220px;"></div>
            </div>
          </div>

        </div>

        <div class="col-md-12">

          <div class="panel panel-default">
            <div class="panel-body xs-mt-15">
              <div class="xs-mt-20 xs-mb-30">
                <div class="xs-mt-20 xs-mb-30">
                  <div class="btn-group btn-space">
                    <button type="button" class="btn btn-default">{{month}}月</button>
                    <button type="button" data-toggle="dropdown" class="btn btn-primary dropdown-toggle">
                      <span class="mdi mdi-chevron-down"></span>
                      <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul role="menu" class="dropdown-menu">
                      <li><a href="#" @click="monthSelected(1)">1月</a></li>
                      <li><a href="#" @click="monthSelected(2)">2月</a></li>
                      <li><a href="#" @click="monthSelected(3)">3月</a></li>
                      <li><a href="#" @click="monthSelected(4)">4月</a></li>
                      <li><a href="#" @click="monthSelected(5)">5月</a></li>
                      <li><a href="#" @click="monthSelected(6)">6月</a></li>
                      <li><a href="#" @click="monthSelected(7)">7月</a></li>
                      <li><a href="#" @click="monthSelected(8)">8月</a></li>
                      <li><a href="#" @click="monthSelected(9)">9月</a></li>
                      <li><a href="#" @click="monthSelected(10)">10月</a></li>
                      <li><a href="#" @click="monthSelected(11)">11月</a></li>
                      <li><a href="#" @click="monthSelected(12)">12月</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="xs-mt-20 xs-mb-30">
                <div class="btn-toolbar">
                  <div class="btn-group btn-space">
                    <template v-for="(item, index) in timeEntries">
                      <entry-type-menu :key="item.typeId" :default-selected="index == 0" :id="item.typeId" :icon-class="item.iconName" :type-name="item.typeName"/>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import Bus from '@/components/EventBus'
import EntryTypeMenu from '../unit/EntryTypeMenu'

export default {
  name: 'EntryChartPage',
  components: {EntryTypeMenu},
  data () {
    return {
      month: null,
      typeId: null,
      typeName: null,
      timeEntries: null
    }
  },

  created () {
    let vm = this

    Bus.$on(Global.event.entryTypeMenuClicked, function (timeEntry) {
      vm.typeId = timeEntry.typeId
      vm.typeName = timeEntry.typeName
      vm.draw()
    })

    this.month = new Date().getMonth() + 1

    this.getEntryTypes()
  },

  methods: {
    draw () {
      this.$http.get(Global.url.apiTimeEntries + '?month=' + this.month + '&typeId=' + this.typeId).then(response => {
        let items = []

        if (response.body.code === 200) {
          response.body.data.timeEntries.forEach(item => {
            items.push([item.dateNum, item.duration])
          })

          window.App.chart.draw(items)
        }
      }, response => {
        // error callback
      })
    },

    monthSelected (num) {
      this.month = num
      this.draw()
    },

    getEntryTypes () {
      this.$http.get(Global.url.apiDailyTimeEntries + '?date=2018-01-01 00:00:00').then(response => {
        if (response.body.code === 200) {
          this.timeEntries = response.body.data.timeEntries
        }
      }, response => {
        // error callback
      })
    }
  }

}
</script>

<style scoped>

</style>
