import { Component, Vue } from 'vue-property-decorator'
import ErActivationModal from '@/components/blocks/ErActivationModal/index.vue'

@Component({
  components: { ErActivationModal },
  props: {
    value: Boolean, // отображать/не отображать модалку
    cost: [String, Number], // необходимое количество ДС для подключения услуги
    available: [String, Number] // доступные средства
  }
})
export default class ErAvailableFundsModal extends Vue {
  get sum () {
    return Math.abs(+this.$props.available) + +this.$props.cost
  }

  onConfirm () {
    // @ts-ignore
    this.$router.push({
      name: 'add-funds',
      params: {
        sum: this.sum
      }
    })
  }

  onClose () {
    this.$emit('close')
    this.$emit('input', !this.$props.value)
  }
}
