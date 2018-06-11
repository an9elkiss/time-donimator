<template>
  <a class="btn btn-space btnA" :class="[activeFlag ? 'btn-primary active' : 'btn-default']" @click="buttonClicked(index)">{{value}}</a>
</template>

<script>
export default {
  name: 'ClickableButton',
  props: ['value', 'index', 'activeFlag'],
  methods: {
    buttonClicked (index) {
      this.$emit('buttonClicked', index)
    }
  }
}
</script>

<style scoped>
.btnA{
  display: block;
  float: left;
}
</style>
