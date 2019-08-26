import Vue from 'vue'
import { filterObjectOnKeys, isEmpty } from '../functions/helper'

const availableProps = {
  absolute: Boolean,
  bottom: Boolean,
  fixed: Boolean,
  left: Boolean,
  right: Boolean,
  top: Boolean
}

export function factory (selected) {
  return Vue.extend({
    name: 'positionable',
    props: !isEmpty(selected) ? filterObjectOnKeys(availableProps, selected) : availableProps
  })
}

export default factory()
