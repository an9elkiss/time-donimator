<template>
  <li :class="{active:isActive}" @click="active">
    <router-link :to="path">{{name}}</router-link>
  </li>
</template>

<script>
import Global from '@/components/Global'
import Bus from '@/components/EventBus'

export default {
  name: 'SubMenu',

  props: {
    id: String,
    path: String,
    name: String
  },

  data: function () {
    return {
      isActive: false
    }
  },

  methods: {
    active () {
      this.isActive = true

      Bus.$emit(Global.event.subMenuClicked, this.id)
    },

    onSubMenuClicked (id) {
      if (this.id === id) {
        return
      }

      this.isActive = false
    }
  },

  created () {
    var vm = this
    Bus.$on(Global.event.subMenuClicked, function (id) {
      vm.onSubMenuClicked(id)
    })
  }
}
</script>

<style scoped>

</style>
