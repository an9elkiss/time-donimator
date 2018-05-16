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
              <span class="title">月报表</span>
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
                    <button type="button" class="btn btn-default">1月</button>
                    <button type="button" data-toggle="dropdown" class="btn btn-primary dropdown-toggle">
                      <span class="mdi mdi-chevron-down"></span>
                      <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul role="menu" class="dropdown-menu">
                      <li><a href="#">1月</a></li>
                      <li><a href="#">2月</a></li>
                      <li><a href="#">3月</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="xs-mt-20 xs-mb-30">
                <div class="btn-toolbar">
                  <div class="btn-group btn-space">
                    <button type="button" class="btn btn-default"><i class="icon mdi mdi-email"></i></button>
                    <button type="button" class="btn btn-default"><i class="icon mdi mdi-cloud-outline"></i></button>
                    <button type="button" class="btn btn-default"><i class="icon mdi mdi-mood"></i></button>
                    <button type="button" class="btn btn-default"><i class="icon mdi mdi-favorite-outline"></i></button>
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

export default {
  name: 'EntryChartPage',
  // data () {
  //   return {
  //     items: null
  //   }
  // },

  created () {
    let vm = this
    Bus.$on(Global.event.appMounted, function () {
      vm.draw()
    })
  },

  mounted () {
    this.draw()
  },

  methods: {
    draw () {
      this.$http.get(Global.url.apiTimeEntries + '?month=5').then(response => {
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
    }
  }

}
</script>

<style scoped>

</style>
