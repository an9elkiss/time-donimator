<script>

const apiBase = 'http://localhost:9001'

const url = {
  apiBase: apiBase,
  apiWeekDays: apiBase + '/api-time-dominator/1.0.0/week-days',
  apiDailyTimeEntries: apiBase + '/api-time-dominator/1.0.0/time-entries/daily'
}

export default {
  url,
  name: 'Global'
}
</script>

<style scoped>

</style>
