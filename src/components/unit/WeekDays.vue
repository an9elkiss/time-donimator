<template>
  <div class="panel panel-default">
    <div class="panel-heading panel-heading-divider">周历</div>
    <div class="panel-body xs-mt-15">
      <p class="xs-mt-10 xs-mb-10">
        <template v-for="item in days">
          <button :key="item.dateNum" v-if="item.type == 1" class="btn btn-rounded btn-space btn-primary"
                  @click="dateChange(item.date)">
            <i v-show="item.selected" class="icon icon-left mdi mdi-check-circle"></i>
            {{ item.dateNum }}
          </button>
          <button :key="item.dateNum" v-if="item.type == 2" class="btn btn-rounded btn-space btn-success"
                  @click="dateChange(item.date)">
            <i v-show="item.selected" class="icon icon-left mdi mdi-check-circle"></i>
            {{ item.dateNum }}
          </button>
          <button :key="item.dateNum" v-if="item.type == 3" class="btn btn-rounded btn-space btn-default">{{ item.dateNum }}
          </button>
          <button :key="item.dateNum" v-if="item.type == 4" class="btn btn-rounded btn-space btn-danger"
                  @click="dateChange(item.date)">
            <i v-show="item.selected" class="icon icon-left mdi mdi-check-circle"></i>
            {{ item.dateNum }}
          </button>
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import Bus from '@/components/EventBus'

export default {
  name: 'WeekDays',
  data () {
    return {
      days: null
    }
  },
  created () {
    var vm = this
    // 组件初始化时，选中当天日期
    Bus.$on(Global.event.timeEntryWeekDaysGot, function () {
      vm.days.forEach(item => {
        if (item.type === 2) {
          vm.dateChange(item.date)
        }
      })
    })

    // 日程保存后，刷新WeekDays
    Bus.$on(Global.event.timeEntrySaved, function () {
      vm.getWeekDays()
    })
  },
  beforeMount () {
    this.getWeekDays(true)
  },
  methods: {
    getWeekDays (sendEvent) {
      this.$http.get(Global.url.apiWeekDays).then(response => {
        if (response.body.code === 200) {
          response.body.data.days.forEach(item => {
            // 获取days数据后，在数据绑定前需要先设置 selected 属性
            if (item.type === 2) {
              item.selected = true
            } else {
              item.selected = false
            }
          })

          this.days = response.body.data.days

          if (sendEvent) {
            Bus.$emit(Global.event.timeEntryWeekDaysGot)
          }
        }
      }, response => {
        // error callback
      })
    },

    dateChange: function (date) {
      this.days.forEach(item => {
        if (item.date === date) {
          item.selected = true
        } else {
          item.selected = false
        }
      })
      Bus.$emit(Global.event.timeEntryDateChange, date)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
