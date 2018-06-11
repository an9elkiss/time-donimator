<template>
  <div id="mod-warning" tabindex="-1" role="dialog" class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center">
            <div class="text-warning"><span class="modal-main-icon mdi mdi-alert-triangle"></span></div>
            <p>确定要删除此任务{{taskIndex+1}}吗？</p>
            <div>
              <button type="button" data-dismiss="modal" class="btn btn-space btn-default" @click="$emit('handleCancelButtonClicked')">取消</button>
              <button type="button" data-dismiss="modal" class="btn btn-space btn-warning" @click="$emit('handleSureButtonClicked')">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['taskIndex']
}
</script>
