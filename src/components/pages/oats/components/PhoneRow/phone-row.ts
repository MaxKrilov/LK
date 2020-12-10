import { Vue, Component } from 'vue-property-decorator'

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
  price: String
}
@Component({ props })
export default class OATSPhoneRow extends Vue {
  get categoryClass () {
    return PHONE_CATEGORIES[this.$props.category]
  }
}
