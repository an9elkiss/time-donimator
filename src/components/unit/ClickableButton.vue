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
.btn-default{
  border-radius: 5px;
}
.btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary{
  color: #2572f2;
  background: #fff;
  box-shadow: none;
  border-radius: 5px;
}
</style>
