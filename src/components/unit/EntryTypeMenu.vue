<template>
  <button type="button" class="btn" v-bind:class="{'btn-color':isActive,'btn-dropbox':isActive, 'btn-default':!isActive}" @click="active">
    <i class="icon mdi" :class="iconClass"></i>
  </button>
</template>

<script>
import Global from '@/components/Global'
import Bus from '@/components/EventBus'

export default {
  name: 'EntryTypeMenu',

  props: {
    id: String,
    iconClass: String,
    typeName: String,
    defaultSelected: Boolean
  },

  data: function () {
    return {
      isActive: false
    }
  },

  methods: {
    active () {
      this.isActive = true

      Bus.$emit(Global.event.entryTypeMenuClicked, {typeId: this.id, typeName: this.typeName})
    },

    onMenuClicked (id) {
      if (this.id === id) {
        return
      }

      this.isActive = false
    }
  },

  created () {
    var vm = this
    Bus.$on(Global.event.entryTypeMenuClicked, function (timeEntry) {
      vm.onMenuClicked(timeEntry.typeId)
    })

    if (this.defaultSelected) {
      this.active()
    }
  }
}
</script>

<style scoped>

</style>
