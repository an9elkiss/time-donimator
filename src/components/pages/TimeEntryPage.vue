<template>
  <div class="be-content main-content">
  <div class="col-md-12">
    <weekDays></weekDays>
  </div>

  <div class="col-sm-12">
    <daily-entries></daily-entries>
  </div>
  </div>
</template>

<script>
import WeekDays from '@/components/unit/WeekDays'
import DailyEntries from '@/components/unit/DailyEntries'

export default {
  name: 'TimeEntryPage',
  components: {
    WeekDays,
    DailyEntries
  }
}
</script>

<style scoped>

</style>
