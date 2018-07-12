<template>
  <div class="be-left-sidebar">
    <div class="left-sidebar-wrapper"><a class="left-sidebar-toggle">菜单</a>
      <div class="left-sidebar-spacer">
        <div class="left-sidebar-scroll">
          <div class="left-sidebar-content">
            <ul class="sidebar-elements">
              <li class="divider">菜单</li>
              <li v-show="menuBtn.m1">
                <a href="/"><i class="icon mdi mdi-home"></i><span>首页</span></a>
              </li>
              <li v-show="menuBtn.m101" class="parent">
                <a href="#"><i class="icon mdi mdi-hourglass-alt"></i><span>时间管理</span></a>
                <ul class="sub-menu">
                  <sub-menu v-show="menuBtn.m102" id="sm_1" path="/time-entry" name="日程记录" />
                  <sub-menu v-show="menuBtn.m103" id="sm_2" path="/time-chart" name="日程报表" />
                </ul>
              </li>
              <li v-show="menuBtn.m201" class="parent">
                <a href="#"><i class="icon mdi mdi-slideshare"></i><span>任务管理</span></a>
                <ul class="sub-menu">
                  <sub-menu v-show="menuBtn.m202" id="sm_3" path="/task-mangement-list" name="一周任务" />
                  <sub-menu v-show="menuBtn.m203" id="sm_4" path="/code-review-list" name="代码审核" />
                </ul>
              </li>
              <li v-show="menuBtn.m301" class="parent">
                <a href="#"><i class="icon mdi mdi-chart"></i><span>报表管理</span></a>
                <ul class="sub-menu">
                  <sub-menu v-show="menuBtn.m302" id="sm_5" path="/show-converted-work-hour" name="一周计划" />
                  <sub-menu v-show="menuBtn.m303" id="sm_6" path="/score-charts" name="贡献值" />
                </ul>
              </li>
              <li v-show="menuBtn.m400" class="parent">
                <a href="#"><i class="icon mdi mdi-developer-board"></i><span>培训分享</span></a>
                <ul class="sub-menu">
                  <sub-menu v-show="menuBtn.m401" id="sm_7" path="/training-content" name="我要分享" />
                  <sub-menu v-show="menuBtn.m402" id="sm_8" path="/sharing-comment-list" name="分享列表" />
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubMenu from './SubMenu'
import Global from '@/components/Global'
import Bus from '@/components/EventBus'

export default {
  name: 'Menu',
  components: {SubMenu},

  data () {
    return {
      menus: null,
      menuBtn: {
        m1: false,
        m101: false,
        m102: false,
        m103: false,
        m201: false,
        m202: false,
        m203: false,
        m301: false,
        m302: false,
        m303: false,
        m400: false,
        m401: false,
        m402: false
      }
    }
  },

  beforeMount () {
    this.findMenus()
  },

  mounted () {
    window.$(document).ready(function () {
      window.App.init()
      window.App.charts()
      Bus.$emit(Global.event.appMounted)
    })
  },

  methods: {
    findMenus () {
      this.$http.get(Global.url.apiMenus).then(response => {
        if (response.body.code === 200) {
          this.menus = response.body.data.menus
          // this.menuBtn.m1 = false
          // this.menuBtn.m101 = false
          // this.menuBtn.m102 = false
          // this.menuBtn.m103 = false
          // this.menuBtn.m201 = false
          // this.menuBtn.m202 = false

          this.menus.forEach(item => {
            if (item.menuId === 1) {
              this.menuBtn.m1 = true
            } else if (item.menuId === 101) {
              this.menuBtn.m101 = true
            } else if (item.menuId === 102) {
              this.menuBtn.m102 = true
            } else if (item.menuId === 103) {
              this.menuBtn.m103 = true
            } else if (item.menuId === 201) {
              this.menuBtn.m201 = true
            } else if (item.menuId === 202) {
              this.menuBtn.m202 = true
            } else if (item.menuId === 203) {
              this.menuBtn.m203 = true
            } else if (item.menuId === 301) {
              this.menuBtn.m301 = true
            } else if (item.menuId === 302) {
              this.menuBtn.m302 = true
            } else if (item.menuId === 303) {
              this.menuBtn.m303 = true
            } else if (item.menuId === 400) {
              this.menuBtn.m400 = true
            } else if (item.menuId === 401) {
              this.menuBtn.m401 = true
            } else if (item.menuId === 402) {
              this.menuBtn.m402 = true
            }
          })
        }
      }, response => {
        // error callback
      })
    }
  }
}
</script>

<style scoped>

</style>
