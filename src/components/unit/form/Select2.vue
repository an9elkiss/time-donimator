<template>
  <div>
    <select :name="name" class="select2">
      <option value="">未选择</option>
      <option v-for="option in options" :key="option.id" :value="option.id">{{option.title}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Select2',
  props: {
    name: String | null, // 注意该值不要和页面的其他元素一样！
    value: String | Number | null,
    options: Array | null // 以id 和 value组成的对象数组
  },
  computed: {
    jsSelector () {
      return '.select2[name=' + this.name + ']'
    }
  },
  watch: {
    value () {
      let self = this
      window.$(self.jsSelector).val(self.value)
      window.$(self.jsSelector).trigger('change')
    }
  },
  mounted () {
    let self = this
    window.$(self.jsSelector).select2({
      width: '100%'
    })
    window.$(self.jsSelector).on('select2:select', function (e) {
      let value = e.params.data.id
      if (value) {
        value = Number(value)
      }
      self.$emit('update', value)
    })
    window.$(self.jsSelector).val(self.value)
    window.$(self.jsSelector).trigger('change')
  }
}
</script>

<style scoped>
</style>
