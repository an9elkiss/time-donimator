<template>
  <div id="mod-warning" tabindex="-1" role="dialog" class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <div class="text-warning"><span class="modal-main-icon mdi mdi-alert-triangle"></span></div>
            <h3>Warning!</h3>
            <p>确定要删除此任务吗？</p>
            <div class="xs-mt-50">
              <button type="button" data-dismiss="modal" class="btn btn-space btn-default" @click="$emit('handleCancelButtonClicked')">取消</button>
              <button type="button" data-dismiss="modal" class="btn btn-space btn-warning" @click="$emit('handleSureButtonClicked')">确定</button>
            </div>
          </div>
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>
<script>

</script>
