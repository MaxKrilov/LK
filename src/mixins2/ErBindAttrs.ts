import Vue, { WatchHandler } from 'vue'

function makeWatcher (property: string): ThisType<Vue> & WatchHandler<any> {
  return function (this: Vue, val, oldVal) {
    for (const attr in oldVal) {
      if (!Object.prototype.hasOwnProperty.call(val, attr)) {
        this.$delete(this.$data[property], attr)
      }
    }
    for (const attr in val) {
      this.$set(this.$data[property], attr, val[attr])
    }
  }
}

export default Vue.extend({
  data: () => ({
    attrs$: {} as Dictionary<string>,
    listeners$: {} as Dictionary<Function | Function[]>
  }),

  created () {
    // @ts-ignore
    this.$watch('$attrs', makeWatcher('attrs$'), { immediate: true })
    // @ts-ignore
    this.$watch('$listeners', makeWatcher('listeners$'), { immediate: true })
  }
})
