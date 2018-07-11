<template>
  <ul id="zTree" class="ztree"></ul>
</template>

<script>
export default {
  name: 'ZTree',
  props: ['zNodes', 'pIdKey'],
  data () {
    return {
      // zNodes: [
      //   {id: 0, pId: null, name: '根节点', open: true},
      //   {id: 1, pId: 0, name: '父节点 1', open: true},
      //   {id: 11, pId: 1, name: '叶子节点 1-1'},
      //   {id: 12, pId: 1, name: '叶子节点 1-2'},
      //   {id: 13, pId: 1, name: '叶子节点 1-3'},
      //   {id: 2, pId: 0, name: '父节点 2', open: true},
      //   {id: 21, pId: 2, name: '叶子节点 2-1'},
      //   {id: 22, pId: 2, name: '叶子节点 2-2'},
      //   {id: 23, pId: 2, name: '叶子节点 2-3'},
      //   {id: 3, pId: 0, name: '父节点 3', open: true},
      //   {id: 31, pId: 3, name: '叶子节点 3-1'},
      //   {id: 32, pId: 3, name: '叶子节点 3-2'},
      //   {id: 33, pId: 3, name: '叶子节点 3-3'}
      // ],
      // className: 'dark',
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
          onRename: this.onRename
        }
      }
    }
  },
  watch: {
    'zNodes': function () {
      console.log(this.zNodes)
      window.$.fn.zTree.init(window.$('#zTree'), this.setting, this.zNodes)
    }
  },
  methods: {
    // 鼠标悬停添加更新按钮
    addHoverDom (treeId, treeNode) {
      // 获取悬停的span
      var sObj = window.$('#' + treeNode.tId + '_span')
      if (treeNode.editNameFlag || window.$('#addBtn_' + treeNode.tId).length > 0) {
        // 如果是不可以修改状态 或者 已经在哪里显示添加按钮，则本次不做处理
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
          // TODO
          console.log('add button clicked')
          // 这里是原来的方式添加tree，我们这里可以在修改后重新获取tree的信息更新
          // var zTree = $.fn.zTree.getZTreeObj("treeDemo");
          // zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
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
      // this.className = (this.className === 'dark' ? '' : 'dark')
      // showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name)
      var zTree = window.$.fn.zTree.getZTreeObj('zTree')
      zTree.selectNode(treeNode)
      setTimeout(function () {
        if (confirm('进入节点 -- ' + treeNode.name + '的编辑状态吗？')) {
          setTimeout(function () {
            zTree.editName(treeNode)
          }, 0)
        }
      }, 0)
      return false
    },
    beforeRemove (treeId, treeNode) {
      // this.className = (this.className === 'dark' ? '' : 'dark')
      // showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name)
      var zTree = window.$.fn.zTree.getZTreeObj('zTree')
      zTree.selectNode(treeNode)
      return confirm('确认删除 节点 -- ' + treeNode.name + ' 吗？')
    },
    beforeRename (treeId, treeNode, newName, isCancel) {
      // this.className = (this.className === 'dark' ? '' : 'dark')
      // showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""))
      if (newName.length === 0) {
        setTimeout(function () {
          var zTree = window.$.fn.zTree.getZTreeObj('zTree')
          zTree.cancelEditName()
          alert('节点名称不能为空.')
        }, 0)
        return false
      }
      return true
    },
    onRemove (e, treeId, treeNode) {
      // showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name)
      console.log(e, treeNode)
      console.log('真正的删除操作')
    },
    onRename (e, treeId, treeNode, isCancel) {
      // showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""))
      console.log(e, treeNode)
      console.log('真正的更新操作')
    }
  }
}
</script>

<style scoped>
.ztree {
  height: 500px;
}
</style>
