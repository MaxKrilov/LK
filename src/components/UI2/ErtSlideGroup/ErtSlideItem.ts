import { ErtItemBase } from '@/components/UI2/ErtItemGroup/ErtItem'

import { factory as GroupableFactory } from '@/mixins2/ErtGroupableMixin'

import Component, { mixins } from 'vue-class-component'

@Component
export default class ErtSlideItem extends mixins(ErtItemBase, GroupableFactory('slideGroup')) {}
