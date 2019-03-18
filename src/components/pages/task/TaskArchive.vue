<template>
  <div class="be-content be-no-padding">
    <aside class="page-aside">
      <div class="be-scroller">
        <div class="aside-content">
          <div class="content">
            <div class="aside-header">
              <button data-target=".aside-nav" data-toggle="collapse" type="button" class="navbar-toggle"><span class="icon mdi mdi-caret-down"></span></button><span class="title">任务归档树</span>
              <p class="description">Task Archive</p>
            </div>
          </div>
          <div class="aside-nav collapse">
            <div id="taskArchive" class="ztree"></div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import Global from '@/components/Global'

export default {
  name: 'TaskArchive',
  data () {
    return {
      setting: {
        view: {
          fontCss: (treeId, treeNode) => {
            if (treeNode.isParent !== false) {
              return
            }
            return {color: treeNode.isArchived ? 'green' : 'red'}
          }
        },
        callback: {
          onClick: (event, treeId, treeNode, clickFlag) => {
            if (treeNode.isParent) {
              treeNode.open = true
              return
            }
            window.open('/#/task-mangement-detail?flag=0&id=' + treeNode.id)
          }
        }
      },
      zNodes: null
    }
  },
  mounted () {
    this.initZTree()
  },
  methods: {
    async initZTree () {
      let self = this
      let result = await self.$api(Global.url.apiTaskArchive, '', 'GET')
      if (result.data.code === 200 && result.data.data !== null) {
        this.generateZTreeData(result.data.data)
      }
      window.$.fn.zTree.init(window.$('#taskArchive'), this.setting, this.zNodes)
    },
    generateZTreeData (data) {
      let newData = {
        id: null,
        name: 'Root',
        isArchived: false,
        childrens: data
      }
      this.zNodes = this.build(newData)
    },
    build (option, level = 1) {
      let children = []
      if (option.childrens) {
        for (var index = 0; index < option.childrens.length; index++) {
          children.push(this.build(option.childrens[index], level + 1))
        }
      }
      return {
        id: option.taskWeekId,
        name: option.name,
        isArchived: option.isArchived,
        isParent: children.length > 0,
        open: level <= 2,
        children: children
      }
    }
  }
}
</script>

<style scoped>
.page-aside {
  width: 100%;
}
</style>
