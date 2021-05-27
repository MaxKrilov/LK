import { Vue, Component } from 'vue-property-decorator'
import { uniqBy as _uniqBy } from 'lodash'
import { IBundle } from '@/interfaces/bundle'
import { parseDecimal } from '@/functions/helper2'
import { getServicePageLink } from '@/functions/services'

const props = {
  title: String,
  description: String,
  packList: Array
}

@Component({ props })
export default class PackageItem extends Vue {
  get addressList () {
    return _uniqBy(this.$props.packList.map((el: IBundle) => el.fulladdress), 'fulladdress')
  }

  get serviceList () {
    return this.$props.packList
  }

  getDiscount (pack: IBundle) {
    return parseDecimal(pack?.amount?.bundleDiscount || '0')
  }

  getOldPrice (pack: IBundle) {
    return this.getDiscount(pack) + parseDecimal(pack?.amount?.value || '0')
  }

  getProductPageLink (pack: IBundle) {
    return getServicePageLink(pack.offer.name)
  }
}
