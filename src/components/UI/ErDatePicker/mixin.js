export default {
  data: () => ({
    monitoredYear: -1
  }),
  methods: {
    generateSwitchYear () {
      return [
        this.$createElement('div', {
          staticClass: 'prev',
          attrs: {
            'data-direction': 'prev'
          },
          on: { click: this.onChangeYear }
        }, [
          this.$createElement('er-icon', { props: { name: 'corner_down' } })
        ]),
        this.$createElement('div', { staticClass: 'value' }, [
          this.monitoredYear
        ]),
        this.$createElement('div', {
          staticClass: 'next',
          attrs: {
            'data-direction': 'next'
          },
          on: { click: this.onChangeYear }
        }, [
          this.$createElement('er-icon', { props: { name: 'corner_down' } })
        ])]
    },
    onChangeYear (e) {
      const direction = e.target.closest('div').dataset.direction
      if (direction === 'prev') {
        this.monitoredYear--
      } else {
        this.monitoredYear++
      }
    }
  }
}
