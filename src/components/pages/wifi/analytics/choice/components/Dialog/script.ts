import ErDialog from '../../../../../../UI/ErDialog'

export default {
  ...ErDialog,
  name: 'wifi-analytics-choice-dialog',
  computed: {
    ...ErDialog.computed,
    classes () {
      return {
        ...ErDialog.computed.classes.apply(this),
        'wifi-analytics-choice-dialog': true
      }
    },
    contentClasses () {
      return {
        ...ErDialog.computed.contentClasses.apply(this),
        'wifi-analytics-choice-dialog__content': true
      }
    }
  }
}
