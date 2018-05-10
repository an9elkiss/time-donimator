<template>
  <div class="panel panel-default">
    <div class="panel-heading panel-heading-divider">周历</div>
    <div class="panel-body xs-mt-15">
      <p class="xs-mt-10 xs-mb-10">
        <template v-for="item in days">
          <button :key="item.dateNum" v-if="item.type == 1" class="btn btn-rounded btn-space btn-primary"
                  @click="dateChange(item.date)">{{ item.dateNum }}
          </button>
          <button :key="item.dateNum" v-if="item.type == 2" class="btn btn-rounded btn-space btn-success"
                  @click="dateChange(item.date)">{{ item.dateNum }}
          </button>
          <button :key="item.dateNum" v-if="item.type == 3" class="btn btn-rounded btn-space btn-default">{{ item.dateNum }}
          </button>
          <button :key="item.dateNum" v-if="item.type == 4" class="btn btn-rounded btn-space btn-danger"
                  @click="dateChange(item.date)">{{ item.dateNum }}
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
    Bus.$on(Global.event.timeEntryWeekDaysGot, function () {
      vm.dateChange(vm.days[0].date)
    })
  },
  beforeMount () {
    this.getWeekDays()
  },
  methods: {
    getWeekDays () {
      this.$http.get(Global.url.apiWeekDays).then(response => {
        if (response.body.code === 200) {
          this.days = response.body.data.days

          Bus.$emit(Global.event.timeEntryWeekDaysGot)
        }
      }, response => {
        // error callback
      })
    },

    dateChange: function (date) {
      Bus.$emit(Global.event.timeEntryDateChange, date)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
