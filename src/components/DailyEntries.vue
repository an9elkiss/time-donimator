<template>

  <div class="panel panel-default">
    <div class="tab-container">
      <ul class="nav nav-tabs">
        <template v-for="(item, index) in timeEntries">
          <li :key="item.typeId" v-if="index == 0" class="active"><a :href="'#timeEntryTag'+item.typeId" data-toggle="tab"><span class="icon mdi" :class="item.iconName"></span>{{ item.typeName }}</a></li>
          <li :key="item.typeId" v-if="index != 0"><a :href="'#timeEntryTag'+item.typeId" data-toggle="tab"><span class="icon mdi" :class="item.iconName"></span>{{ item.typeName }}</a></li>
        </template>
      </ul>
      <div class="tab-content">
        <template v-for="(item, index) in timeEntries">
          <div :key="item.typeId" v-if="index == 0" :id="'timeEntryTag'+item.typeId" class="tab-pane active cont">
          <div class="panel-body">
            <form>
              <div class="form-group xs-pt-10">
                <label>持续时间</label>
                <input type="text" placeholder="持续时间" class="form-control" :value="item.duration">
              </div>
              <div class="form-group">
                <label>备注</label>
                <input type="text" placeholder="备注" class="form-control" :value="item.comment">
              </div>
              <div class="row xs-pt-15">
                <div class="col-xs-12">
                  <p class="text-right">
                    <button type="submit" class="btn btn-space btn-primary">保存</button>
                    <button class="btn btn-space btn-default">取消</button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

          <div :key="item.typeId" v-if="index != 0" :id="'timeEntryTag'+item.typeId" class="tab-pane cont">
            <div class="panel-body">
              <form>
                <div class="form-group xs-pt-10">
                  <label>持续时间</label>
                  <input type="text" placeholder="持续时间" class="form-control" :value="item.duration">
                </div>
                <div class="form-group">
                  <label>备注</label>
                  <input type="text" placeholder="备注" class="form-control" :value="item.comment">
                </div>
                <div class="row xs-pt-15">
                  <div class="col-xs-12">
                    <p class="text-right">
                      <button type="submit" class="btn btn-space btn-primary">保存</button>
                      <button class="btn btn-space btn-default">取消</button>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </template>
    </div>
    </div>
  </div>

</template>

<script>
import Global from '@/components/Global'

export default {
  name: 'DailyEntries',
  data () {
    return {
      timeEntries: null
    }
  },
  beforeMount () {
    this.getDailyTimeEntries()
  },
  methods: {

    getDailyTimeEntries () {
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
