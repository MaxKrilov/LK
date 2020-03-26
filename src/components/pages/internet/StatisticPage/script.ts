import Vue from 'vue'
import Component from 'vue-class-component'
import { getFirstElement } from '@/functions/helper'
import moment from 'moment'
import ErTableFilter from '@/components/blocks/ErTableFilter'
import InternetStatisticComponent from './blocks/InternetStatisticComponent'

@Component({
  components: {
    ErTableFilter,
    InternetStatisticComponent
  }
})
export default class StatisticPage extends Vue {
  /**
   * Список логинов и IP адресов
   */
  listLogin = [
    'v41514967',
    '10.95.217.183',
    '46.146.208.164'
  ]
  /**
   * Выбранный для показа статистики логин или IP адрес
   */
  currentLogin = getFirstElement(this.listLogin)
  /**
   * Период для показа статистики (по-умолчанию - последний месяц)
   */
  period = [
    moment().subtract(1, 'month'),
    moment()
  ]
}
