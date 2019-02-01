<template>
  <div :class="'form-group ' + blockClass">
    <label :class="'control-label ' + labelClass">{{label}}</label>
    <div :class="inputDivClass">
      <div :id="selectDivId" data-date-format="yyyy-mm-dd" class="input-group date datetimepicker">
        <span class="btn btn-primary input-group-addon"><i class="icon-th mdi mdi-calendar"></i></span>
        <input :id="selectInputId" :value="value" type="text" :class="'form-control input-xs ' + inputClass" autocomplete="off">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateInput',
  props: {
    blockClass: {
      type: String,
      default: ''
    },
    labelClass: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    inputDivClass: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'normal'
    },
    value: {
      type: String | null,
      required: true
    },
    startDate: {
      type: String | null
    },
    endDate: {
      type: String | null
    }
  },
  computed: {
    selectDivId () {
      return 'date-picker_' + this.id
    },
    selectInputId () {
      return 'date-picker-input' + this.id
    },
    selectDivPattern () {
      return 'div#' + this.selectDivId
    },
    selectInputPattern () {
      return 'input#' + this.selectInputId
    }
  },
  watch: {
    startDate () {
      if (this.startDate !== null) {
        window.$(self.selectDivPattern).datetimepicker('setStartDate', this.startDate.substr(0, 10))
      } else {
        window.$(self.selectDivPattern).datetimepicker('setStartDate', this.startDate)
      }
    },
    endDate () {
      if (this.endDate !== null) {
        window.$(self.selectDivPattern).datetimepicker('setEndDate', this.endDate.substr(0, 10))
      } else {
        window.$(self.selectDivPattern).datetimepicker('setEndDate', this.endDate)
      }
    }
  },
  mounted () {
    let self = this
    let startDay = this.startDate ? this.startDate.substr(0, 10) : null
    let endDay = this.endDate ? this.endDate.substr(0, 10) : null
    window.$(self.selectDivPattern).datetimepicker({
      autoclose: true,
      componentIcon: '.mdi.mdi-calendar',
      navIcons: {
        rightIcon: 'mdi mdi-chevron-right',
        leftIcon: 'mdi mdi-chevron-left'
      },
      // 选择日期后，不会再跳转去选择时分秒
      minView: 'month',
      startDate: startDay,
      endDate: endDay,
      language: 'zh-CN'
    })
    // 日期选择器专用监听事件，用于vue更新值
    window.$(self.selectDivPattern).datetimepicker().on('hide', function (ev) {
      var value = window.$(self.selectInputPattern).val()
      self.$emit('updateValue', value)
    })
  }
}
</script>

<style scoped>
.datetimepicker {
  padding: 0;
}
</style>
