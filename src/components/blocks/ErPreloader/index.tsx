import Vue, { CreateElement, VNode } from 'vue'

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
  }
}

export default Vue.extend({
  name: 'er-preloader',
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render (h: CreateElement): VNode {
    return (
      <div style={styles.block}>
        <div style={styles.content}>
          <img
            src={require('@/assets/images/preloaders/2.svg')}
          />
          <div>{this.status}</div>
        </div>
      </div>
    )
  }
})
