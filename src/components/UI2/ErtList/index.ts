import { createSimpleFunctional } from '@/functions/helper2'

import ErtList from './ErtList'
import ErtListGroup from './ErtListGroup'
import ErtListItem from './ErtListItem'
import ErtListItemAction from './ErtListItemAction'
import ErtListItemGroup from './ErtListItemGroup'
import ErtListItemIcon from './ErtListItemIcon'

export const ErtListItemActionText = createSimpleFunctional('ert-list-item__action-text', 'span')
export const ErtListItemContent = createSimpleFunctional('ert-list-item__content', 'div')
export const ErtListItemTitle = createSimpleFunctional('ert-list-item__title', 'div')
export const ErtListItemSubtitle = createSimpleFunctional('ert-list-item__subtitle', 'div')

export {
  ErtList,
  ErtListGroup,
  ErtListItem,
  ErtListItemAction,
  ErtListItemGroup,
  ErtListItemIcon
}

export default {
  $_subcomponents: {
    ErtList,
    ErtListGroup,
    ErtListItem,
    ErtListItemAction,
    ErtListItemGroup,
    ErtListItemIcon,
    ErtListItemActionText,
    ErtListItemContent,
    ErtListItemTitle,
    ErtListItemSubtitle
  }
}
