<template>
  <ul id="zTree" class="ztree"></ul>
</template>

<script>
export default {
  name: 'ZTree',
  props: ['zNodes', 'pIdKey'],
  data () {
    return {
      setting: {
        view: {
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom,
          selectedMulti: false
        },
        edit: {
          enable: true,
          editNameSelectAll: true,
          renameTitle: '修改',
          removeTitle: '删除',
          showRemoveBtn: this.showRemoveBtn,
          showRenameBtn: this.showRenameBtn
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: this.pIdKey
          }
        },
        callback: {
          beforeDrag: this.beforeDrag,
          beforeEditName: this.beforeEditName,
          beforeRemove: this.beforeRemove,
          beforeRename: this.beforeRename,
          onRemove: this.onRemove,
          onRename: this.onRename,
          onClick: this.onClick
        }
      }
    }
  },
  watch: {
    'zNodes': function () {
      window.$.fn.zTree.init(window.$('#zTree'), this.setting, this.zNodes)
      let ztree = window.$.fn.zTree.getZTreeObj('zTree')
      let folderNode = ztree.getNodesByFilter(node => {
        return node.fileType !== 43
      })
      folderNode.map(node => {
        node.isParent = true
      })
      ztree.getNodesByFilter(node => {
        return node[this.pIdKey] === null
      }).map(node => {
        node.open = true
      })
      ztree.refresh()
    }
  },
  methods: {
    // 鼠标悬停添加更新按钮
    addHoverDom (treeId, treeNode) {
      var self = this
      // 获取悬停的span
      var sObj = window.$('#' + treeNode.tId + '_span')
      if (treeNode.editNameFlag || window.$('#addBtn_' + treeNode.tId).length > 0) {
        // 如果是不可以修改状态 或者 已经在哪里显示添加按钮，则本次不做处理
        return
      }
      if (treeNode.fileType === 43) {
        return
      }
      // 添加的更新按钮的HTML
      var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='增加文件夹' onfocus='this.blur();'></span>"
      // 在悬停span后面添加
      sObj.after(addStr)
      // 为更新按钮添加点击事件
      var btn = window.$('#addBtn_' + treeNode.tId)
      if (btn) {
        btn.bind('click', function () {
          setTimeout(function () {
            self.$emit('addTreeNode', treeNode)
          }, 0)
          return false
        })
      }
    },
    removeHoverDom (treeId, treeNode) {
      // 删除事件监听，后删除节点
      window.$('#addBtn_' + treeNode.tId).unbind().remove()
    },
    showRemoveBtn (treeId, treeNode) {
      if (treeNode[this.pIdKey] == null) {
        return false
      }
      return true
    },
    showRenameBtn (treeId, treeNode) {
      if (treeNode[this.pIdKey] == null) {
        return false
      }
      return true
    },
    beforeDrag (treeId, treeNode) {
      return false
    },
    beforeEditName (treeId, treeNode) {
      var self = this
      var zTree = window.$.fn.zTree.getZTreeObj('zTree')
      zTree.selectNode(treeNode)
      setTimeout(function () {
        self.$emit('renameTreeNode', treeNode)
      }, 0)
      return false
    },
    beforeRemove (treeId, treeNode) {
      var self = this
      var zTree = window.$.fn.zTree.getZTreeObj('zTree')
      zTree.selectNode(treeNode)
      setTimeout(function () {
        self.$emit('deleteTreeNode', treeNode)
      }, 0)
      return false
    },
    beforeRename (treeId, treeNode, newName, isCancel) {
      return false
    },
    onRemove (e, treeId, treeNode) {
    },
    onRename (e, treeId, treeNode, isCancel) {
    },
    onClick (e, treeId, treeNode, isCancel) {
      console.log(treeNode)
      console.log('我被点击了')
      this.$emit('clickTreeNode', treeNode)
    }
  }
}
</script>

<style scoped>
.ztree {
  height: 500px;
}
</style>
