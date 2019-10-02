import MenuComponent from './components/MenuComponent/index'
import ErFooter from '@/components/blocks/ErFooter'

export default {
  name: 'lk-template',
  components: {
    MenuComponent,
    ErFooter
  },
  data: () => ({
    pre: 'lk-template'
  }),
  methods: {
    swipe (direction) {
      alert(direction)
    }
  }
}
