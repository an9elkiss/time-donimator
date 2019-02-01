<template>
  <div :class="'form-group ' + blockClass">
    <label :class="'control-label ' + labelClass">{{label}}</label>
    <div v-if="type === 'normal'" :class="inputDivClass">
      <input type="text" :name="name" class="form-control daterange input-xs" autocomplete="off">
    </div>
    <input v-else type="text" :name="name" class="form-control daterange input-xs" autocomplete="off">
  </div>
</template>

<script>
export default {
  name: 'DateRangeInput',
  props: {
    id: String | Number,
    label: String,
    start: String,
    end: String,
    opens: {
      type: String,
      default: 'center'
    },
    type: String,
    blockClass: {
      type: String,
      default: ''
    },
    labelClass: String,
    inputDivClass: String,
    startDate: String | null,
    endDate: String | null
  },
  data () {
    return {
      now: null
    }
  },
  mounted () {
    // window.App.init()
    // window.App.formElements()
    let self = this
    self.now = self.$global.transformDateString(new Date())
    window.$(self.selectPattern).daterangepicker({
      // 'autoApply': false,
      'locale': {
        'format': 'YYYY-MM-DD',
        'separator': ' ~ ',
        'applyLabel': '确定',
        'cancelLabel': '清空',
        // 'fromLabel': '从',
        // 'toLabel': '到',
        // 'customRangeLabel': 'Custom',
        // 'weekLabel': 'W',
        'daysOfWeek': ['日', '一', '二', '三', '四', '五', '六'],
        'monthNames': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        'firstDay': 1,
        'minDate': self.startDate ? self.startDate.substr(0, 10) : null,
        'maxDate': self.endDate ? self.endDate.substr(0, 10) : null
      },
      'opens': self.opens
    })
    window.$(self.selectPattern).data('daterangepicker').setStartDate(!self.start ? self.now : self.start)
    window.$(self.selectPattern).data('daterangepicker').setEndDate(!self.end ? self.now : self.end)
    window.$(self.selectPattern).val(self.value())
    window.$(self.selectPattern).on('cancel.daterangepicker', function (ev, picker) {
      self.$emit('setRange', {
        startDate: null,
        endDate: null
      })
    })
    window.$(self.selectPattern).on('apply.daterangepicker', function (ev, picker) {
      self.$emit('setRange', {
        startDate: picker.startDate.format('YYYY-MM-DD'),
        endDate: picker.endDate.format('YYYY-MM-DD')
      })
    })
    window.$(self.selectPattern).on('hide.daterangepicker', function (ev, picker) {
      window.$(self.selectPattern).val(self.value())
    })
  },
  computed: {
    name () {
      return 'daterange' + this.id
    },
    selectPattern () {
      return 'input[name="' + this.name + '"]'
    }
  },
  watch: {
    start () {
      let self = this
      window.$(self.selectPattern).data('daterangepicker').setStartDate(!self.start ? self.now : self.start)
      window.$(self.selectPattern).val(self.value())
    },
    end () {
      let self = this
      window.$(self.selectPattern).data('daterangepicker').setEndDate(!self.end ? self.now : self.end)
      window.$(self.selectPattern).val(self.value())
    }
  },
  methods: {
    value () {
      let self = this
      if (!self.start || !self.end) {
        return ''
      }
      return self.start + ' ~ ' + self.end
    }
  }
}
</script>

<style scoped>

</style>
