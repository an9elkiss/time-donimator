<template>
  <div>
    <span v-for="n in max" :key="n" :class="{'mdi mdi-star-outline': n > value && showNull, 'mdi mdi-star light': n <= value}" @click="click(n)"></span>
  </div>
</template>

<script>
export default {
  name: 'StarLevel',
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 5
    },
    editable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showNull: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    click (num) {
      if (!this.editable) {
        return
      }
      let ployhold = num
      if (this.clearable && num <= this.value) {
        ployhold = num - 1
      }
      this.$emit('click', ployhold)
    }
  }
}
</script>

<style scoped>
div {
  cursor: pointer;
}
span {
  margin-right: 2px;
  font-size: 20px;
}
span.light {
  color: #efb514;
}
</style>
