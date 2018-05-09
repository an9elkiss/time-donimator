<template>
  <div class="panel panel-default">
    <div class="panel-heading panel-heading-divider">周历</div>
    <div class="panel-body xs-mt-15">
      <p class="xs-mt-10 xs-mb-10">
        <template v-for="item in days">
          <button :key="item.date" v-if="item.type == 1" class="btn btn-rounded btn-space btn-primary">{{ item.date }}
          </button>
          <button :key="item.date" v-if="item.type == 2" class="btn btn-rounded btn-space btn-success">{{ item.date }}
          </button>
          <button :key="item.date" v-if="item.type == 3" class="btn btn-rounded btn-space btn-default">{{ item.date }}
          </button>
          <button :key="item.date" v-if="item.type == 4" class="btn btn-rounded btn-space btn-danger">{{ item.date }}
          </button>
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'

export default {
  name: 'WeekDays',
  data () {
    return {
      days: null
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getWeekDays()
    })
  },
  methods: {

    getWeekDays () {
      this.$http.get(Global.url.apiWeekDays).then(response => {
        if (response.body.code === 200) {
          this.days = response.body.data.days
        }
      }, response => {
        // error callback
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
