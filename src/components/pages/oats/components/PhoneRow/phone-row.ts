import { Vue, Component } from 'vue-property-decorator'
import { price as priceFormatted } from '@/functions/filters'

const PHONE_CATEGORIES: Record<string, string> = {
  'Бронза': 'bronze',
  'Серебро': 'silver',
  'Золото': 'gold',
  'Платина': 'platinum',
  'Калифорниум': 'californium'
}

const props = {
  number: String,
  category: String,
  price: String,
  id: String
}
@Component({
  props,
  filters: {
    priceFormatted
  }
})
export default class OATSPhoneRow extends Vue {
  get categoryClass () {
    return PHONE_CATEGORIES[this.$props.category]
  }

  openStatistic () {
    this.$router.push({ name: 'oats-statistic', params: { id: this.$props.id } })
  }
}
