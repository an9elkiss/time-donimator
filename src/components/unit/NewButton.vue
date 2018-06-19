<template>
  <div v-if="isClicked" class="new-button">
    <input class="form-control input-sm" ref="input" v-model.trim="newTag" @keydown.enter.prevent @blur="handleInputConfirm" @input="validateNewTag"/>
  </div>
  <div v-else class="new-button">
    <a class="btn btn-primary" @click="buttonClicked"><i class="mdi mdi-plus"> 新<slot></slot></i></a>
  </div>
</template>

<script>
export default {
  name: 'NewButton',
  props: ['isClicked'],
  data: function () {
    return {
      newTag: ''
    }
  },
  methods: {
    handleInputConfirm: function () {
      this.$emit('addNewTag', this.newTag)
      this.newTag = ''
    },
    validateNewTag () {
      if (this.newTag.length > 5 || this.newTag.length <= 0) {
        this.newTag = ''
      }
    },
    buttonClicked () {
      this.$emit('buttonClicked')
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  }
}
</script>

<style scoped>
  div.new-button {
    width: 75px;
    height: 28px;
    border-radius: 5px;
    float: left;
    margin: 0px 5px 5px 0px;
  }
  button, input {
    width: 100%;
    border-radius: 5px;
    height: 28px;
    line-height: 28px;
    font-size: 13px;
    padding: 0px 10px;
  }
</style>
