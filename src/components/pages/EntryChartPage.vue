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
      let items = [
        [0, 20], [1, 30], [2, 25], [3, 39], [4, 35], [5, 40], [6, 30], [7, 45],
        [8, 20], [9, 30], [10, 25], [11, 39], [12, 35], [13, 40], [14, 30], [15, 45],
        [16, 20], [17, 30], [18, 25], [19, 39], [20, 35], [21, 40], [22, 30], [23, 45],
        [24, 20], [25, 30], [26, 25], [27, 39], [28, 35], [29, 40], [30, 30]
      ]

      window.App.chart.draw(items)
    }
  }

}
</script>

<style scoped>

</style>
