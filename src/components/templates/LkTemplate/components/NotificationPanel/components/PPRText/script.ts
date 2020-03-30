import { Vue, Component, Prop } from 'vue-property-decorator'
import { strToTimestamp } from '@/functions/date'
import moment from 'moment'

@Component
export default class PPRText extends Vue {
  name = 'ppr-text'

  @Prop() readonly data!: any

  get addressList (): any[] {
    let result: any[] = []

    this.data.affected_customer_products.forEach((el: any) => {
      el.affected_account_product.forEach((el: any) => {
        result.push(el.affectedLocation.formattedAddress)
      })
    })

    return result
  }

  private formatDate (date: any): string {
    return moment(date).format('DD.MM.YYYY')
  }

  get startDate (): string {
    const timestamp = strToTimestamp(
      this.data.actual_start_date_and_time_of_outage
    )
    const result = this.formatDate(timestamp)
    return result
  }

  get endDate (): string {
    const timestamp = strToTimestamp(
      this.data.actual_end_date_and_time_of_outage
    )
    const result = this.formatDate(timestamp)
    return result
  }
}
