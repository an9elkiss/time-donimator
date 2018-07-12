<template>
  <div class="inputSelect">
    <div class="form-group has-feedback" :class="hasErrorFlag?'has-error':''">
      <input ref="input" :value="initial" @click="inputClicked" readonly="readonly" class="form-control input-sm"/>
      <span class="mdi mdi-chevron-down form-control-feedback"></span>
    </div>
    <van-popup v-model="showFlag" position="bottom" :overlay="true">
      <van-picker
        ref="yearPicker"
        show-toolbar
        :title="title"
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'InputSelect',
  props: ['title', 'columns', 'initial', 'state', 'hasErrorFlag'],
  data: function () {
    return {
      showFlag: false
    }
  },
  methods: {
    inputClicked () {
      if (this.state) {
        this.showFlag = !this.showFlag
      }
    },
    onCancel () {
      this.showFlag = false
    },
    onConfirm (value, index) {
      this.showFlag = false
      this.$refs.input.value = value
      this.$emit('selectConfirmed', index)
    }
  }
}
</script>

<style scoped>
  div.inputSelect {
    width: 100%;
    height: 100%;
  }
  div.form-group.has-feedback {
    width: 100%;
    height: 100%;
    padding: 0px;
    margin: 0px;
  }
  @media (max-width: 720px) {
    input.form-control {
      padding-right: 20px;
    }
  }
</style>
