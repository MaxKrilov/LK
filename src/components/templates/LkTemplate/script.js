import MenuComponent from './components/MenuComponent/index'
import ErFooter from '@/components/blocks/ErFooter'
import ErErrorModal from '@/components/blocks/ErErrorModal'

export default {
  name: 'lk-template',
  components: {
    MenuComponent,
    ErFooter,
    ErErrorModal
  },
  data: () => ({
    pre: 'lk-template'
  })
}
