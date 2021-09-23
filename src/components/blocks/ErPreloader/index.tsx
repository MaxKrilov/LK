import Vue, { CreateElement, VNode } from 'vue'
import ErtProgressCircular from '@/components/UI2/ErtProgressCircular'

const styles = {
  block: {
    width: '100vw',
    height: '100vh',
    background: '#FFFFFF',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    textAlign: 'center'
  },
  ertProgressCircular: {
    color: '#7585A1'
  }
}

export default Vue.extend({
  name: 'er-preloader',
  components: {
    ErtProgressCircular
  },
  props: {
    status: {
      type: String,
      default: ''
    },
    isEcommerce: Boolean
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <div style={styles.block}>
        <div style={styles.content}>
          {
            this.$props.isEcommerce
              // @ts-ignore
              ? <ErtProgressCircular indeterminate={true} width={'4'} size={'48'} style={styles.ertProgressCircular} />
              : <img
                src={require('@/assets/images/preloaders/3.svg')}
                alt={''}
              />
          }
        </div>
      </div>
    )
  }
})
