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
              <div class="form-group">
                <label>持续时间</label>
                <input type="text" placeholder="持续时间" class="form-control" v-model="item.duration" :readonly="vmStatus.readonly">
              </div>
              <div class="form-group">
                <label>备注</label>
                <input type="text" placeholder="备注" class="form-control" v-model="item.comment" :readonly="vmStatus.readonly">
              </div>
              <div class="row xs-pt-15">
                <div class="col-xs-12">
                  <p class="text-right">
                    <button type="submit" class="btn btn-space btn-primary" :style="vmStatus.saveBtnShow" @click="save(item.typeId)">保存</button>
                    <button class="btn btn-space btn-default" :style="vmStatus.saveBtnShow" @click="cancel()">取消</button>
                    <button class="btn btn-space btn-default btn-primary" :style="vmStatus.editBtnShow" @click="edit">填写</button>
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
                  <label>日期</label>
                  <input type="text" placeholder="日期" class="form-control" :value="item.date.split(' ')[0]" readonly="readonly">
                </div>
                <div class="form-group">
                  <label>持续时间</label>
                  <input type="text" placeholder="持续时间" class="form-control" v-model="item.duration" :readonly="vmStatus.readonly">
                </div>
                <div class="form-group">
                  <label>备注</label>
                  <input type="text" placeholder="备注" class="form-control" v-model="item.comment" :readonly="vmStatus.readonly">
                </div>
                <div class="row xs-pt-15">
                  <div class="col-xs-12">
                    <p class="text-right">
                      <button type="submit" class="btn btn-space btn-primary" :style="vmStatus.saveBtnShow" @click="save(item.typeId)">保存</button>
                      <button class="btn btn-space btn-default" :style="vmStatus.saveBtnShow" @click="cancel()">取消</button>
                      <button class="btn btn-space btn-default btn-primary" :style="vmStatus.editBtnShow" @click="edit()">填写</button>
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
import Bus from '@/components/EventBus'

export default {
  name: 'DailyEntries',
  data () {
    return {
      timeEntries: null,
      vmStatus: {
        readonly: 'readonly',
        editBtnShow: {},
        saveBtnShow: {display: 'none'}
      }
    }
  },
  created () {
    var vm = this
    Bus.$on(Global.event.timeEntryDateChange, function (date) {
      vm.getDailyTimeEntries(date)
    })
  },

  methods: {

    getDailyTimeEntries (date) {
      this.$http.get(Global.url.apiDailyTimeEntries + '?date=' + date).then(response => {
        if (response.body.code === 200) {
          this.timeEntries = response.body.data.timeEntries
        }
      }, response => {
        // error callback
      })
    },

    edit () {
      this.vmStatus = {
        readonly: null,
        editBtnShow: {display: 'none'},
        saveBtnShow: {}
      }
    },

    cancel () {
      this.vmStatus = {
        readonly: 'readonly',
        editBtnShow: {},
        saveBtnShow: {display: 'none'}
      }
    },

    save (typeId) {
      var vm = this
      this.timeEntries.forEach(item => {
        if (item.typeId === typeId) {
          vm.postEntry(item)
          vm.cancel()
        }
      })
    },

    postEntry (timeEntry) {
      // var form = new FormData()
      // form.append('date', timeEntry.date)
      // form.append('duration', timeEntry.duration)
      // form.append('comment', timeEntry.comment)
      // form.append('typeId', timeEntry.typeId)

      if (timeEntry.id != null) {
        this.$http.post(Global.url.apiUpdateTimeEntry + timeEntry.id, timeEntry).then(response => {
          Bus.$emit(Global.event.timeEntrySaved)
        }, response => {
          // error callback
        })
      } else {
        this.$http.post(Global.url.apiCreateTimeEntry, timeEntry).then(response => {
          Bus.$emit(Global.event.timeEntrySaved)
        }, response => {
          // error callback
        })
      }
    }

  }
}
</script>

<style scoped>

</style>
