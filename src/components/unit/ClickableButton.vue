<template>
  <button class="btn btn-space" :class="[type ? 'btn-default' : 'btn-primary', active]" @click="buttonClicked(index)">{{value}}</button>
</template>

<script>
export default {
  name: 'ClickableButton',
  props: ['value', 'index'],
  data: function () {
    return {
      type: true,
      active: false
    }
  },
  methods: {
    buttonClicked (index) {
      this.type = !this.type
      this.active = !this.active
      this.$emit('buttonClicked', index)
    }
  }
}
</script>

<style scoped>

</style>
