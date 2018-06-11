<template>
  <div id="result-modal" tabindex="-1" role="dialog" class="modal fade in" :style="{display: modalType?'block':'none'}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center">
            <div :class="'text-'+modalType"><span class="modal-main-icon mdi" :class="modalType === 'success' ? 'mdi-check':'mdi-close-circle-o'"></span></div>
            <p v-if="modalType === 'success'">操作成功</p>
            <p v-else>{{result.message}}</p>
            <button type="button" data-dismiss="modal" class="btn btn-space" :class="modalType === 'success' ? 'btn-success':'btn-danger'" @click="$emit('handleConfirmButtonClicked')">确认</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultModal',
  props: ['result'],
  computed: {
    modalType: function () {
      if (!this.result || !this.result.hasOwnProperty('code') || this.result.code === '') {
        return ''
      }
      if (this.result.code === 200) {
        return 'success'
      }
      return 'danger'
    }
  }
}
</script>

<style>
.modal-dialog{
  padding: 0;
  margin: 0;
  width: 100%;
  top: 50%;
  transform: translateY(-50%)!important;
}
  .modal{
    background: rgba(0, 0, 0, 0.4);
  }
</style>
