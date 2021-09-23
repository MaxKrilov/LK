import './style.scss'

import Vue from 'vue'
import { VNode } from 'vue/types'
import ErtIcon from '@/components/UI2/ErtIcon'

export default Vue.extend({
  name: 'file-name',
  props: {
    documentName: String,
    hasRemove: {
      type: Boolean,
      default: true
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h): VNode {
    return (
      <div class={'e-commerce-document-name'}>
        <div class={'icon'}>
          <ErtIcon name={'erth__document'} />
        </div>
        <div
          class={'name'}
          onclick={(e: MouseEvent) => { this.$emit('click', e) }}
        >{this.documentName}</div>
        {
          this.hasRemove && (
            <div class={'remove'}>
              <button onclick={(e: MouseEvent) => { this.$emit('remove', e) }}>
                {/* small={true} doesn't work :( */}
                <ErtIcon name={'close'} props={{ small: true }} />
              </button>
            </div>
          )
        }
      </div>
    )
  }
})
