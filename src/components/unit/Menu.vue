<template>
  <div class="be-left-sidebar">
    <div class="left-sidebar-wrapper"><a href="#" class="left-sidebar-toggle">菜单</a>
      <div class="left-sidebar-spacer">
        <div class="left-sidebar-scroll">
          <div class="left-sidebar-content">
            <ul class="sidebar-elements">
              <li class="divider">菜单</li>
                <li v-show="menuBtn.m1">
                  <a href="#"><i class="icon mdi mdi-home"></i><span>首页</span></a>
                </li>
                <li v-show="menuBtn.m101" class="parent">
                  <a href="#"><i class="icon mdi mdi-hourglass-alt"></i><span>时间管理</span></a>
                  <ul class="sub-menu">
                      <sub-menu v-show="menuBtn.m102" id="sm_1" path="/time-entry" name="日程记录" />
                      <sub-menu v-show="menuBtn.m103" id="sm_2" path="/time-chart" name="日程报表" />
                  </ul>
                </li>
              <!--v-show="menuBtn.m201" v-show="menuBtn.m202"-->
                <li class="parent">
                  <a href="#"><i class="icon mdi mdi-slideshare"></i><span>任务管理</span></a>
                  <ul class="sub-menu">
                    <sub-menu id="sm_3" path="/task-mangement-list" name="一周任务" />
                    <sub-menu id="sm_4" path="/code-review-list" name="Code Review" />
                  </ul>
                </li>
              <li class="parent">
                <a href="#"><i class="icon mdi mdi-chart"></i><span>报表管理</span></a>
                <ul class="sub-menu">
                  <sub-menu id="sm_5" path="/show-converted-work-hour" name="任务图表" />
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
        m202: false
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
          this.menuBtn.m1 = false
          this.menuBtn.m101 = false
          this.menuBtn.m102 = false
          this.menuBtn.m103 = false
          this.menuBtn.m201 = false
          this.menuBtn.m202 = false

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
