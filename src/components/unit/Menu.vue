<template>
  <div class="be-left-sidebar">
    <div class="left-sidebar-wrapper"><a href="#" class="left-sidebar-toggle">菜单</a>
      <div class="left-sidebar-spacer">
        <div class="left-sidebar-scroll">
          <div class="left-sidebar-content">
            <ul class="sidebar-elements">
              <li class="divider">菜单</li>
              <li>
                <a href="#"><i class="icon mdi mdi-home"></i><span>首页</span></a>
              </li>
              <li class="parent active open">
                <a href="#"><i class="icon mdi mdi-hourglass-alt"></i><span>时间管理</span></a>
                <ul class="sub-menu">
                  <sub-menu id="sm_1" path="/time-entry" name="日程记录" />
                  <sub-menu id="sm_2" path="/time-chart" name="日程报表" />
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

export default {
  name: 'Menu',
  components: {SubMenu}
}
</script>

<style scoped>

</style>
