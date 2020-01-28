import ErTimePicker from './ErTimePicker'
import './_style.scss'

export default {
  name: 'er-time-picker',
  components: {
    ErTimePicker
  },
  data: () => ({
    time: null,
    timeTextField: null,
    openDialog: false
  }),
  props: {
    value: null,
    allowedHours: [Function, Array],
    allowedMinutes: [Function, Array],
    allowedSeconds: [Function, Array],
    disabled: Boolean,
    format: {
      type: String,
      default: '24hr',
      valdator: val => ['ampm', '24hr'].includes(val)
    },
    min: String,
    max: String,
    readonly: Boolean,
    scrollable: Boolean,
    useSeconds: Boolean,
    ampmInTitle: Boolean
  },
  methods: {
    cancelDialog () {
      this.time = null
      this.openDialog = false
      // this.timeTextField = ''
      this.$emit('input', '')
    },
    confirmDialog () {
      this.timeTextField = this.time
      this.openDialog = false
      this.$emit('input', this.time)
    }
  },
  render (h) {
    const scopedSlots = {
      activator: props => (
        <er-text-field
          vOn:click={props.on.click || (e => {})}
          vModel={this.timeTextField}
          disabled={this.disabled}
        />
      )
    }
    return (
      <er-dialog
        scopedSlots={scopedSlots}
        persistent
        width={290}
        vModel={this.openDialog}
        class
        disabled={this.disabled}
      >
        <div class={'er-time-picker__dialog'}>
          {h(ErTimePicker, {
            props: {
              allowedHours: this.allowedHours,
              allowedMinutes: this.allowedMinutes,
              allowedSeconds: this.allowedSeconds,
              disabled: this.disabled,
              format: this.format,
              min: this.min,
              max: this.max,
              readonly: this.readonly,
              scrollable: this.scrollable,
              useSeconds: this.useSeconds,
              ampmInTitle: this.ampmInTitle
            },
            domProps: { value: this.time },
            on: { input: e => { this.time = e } }
          })}
          <div class={['er-time-picker__actions', 'd--flex', 'mx-8', 'pb-8']}>
            <er-button class={'mr-4'} vOn:click={this.confirmDialog}>ОК</er-button>
            <er-button class={'ml-4'} flat vOn:click={this.cancelDialog}>Отмена</er-button>
          </div>
        </div>
      </er-dialog>
    )
  }
}

// export default ErTimePicker
