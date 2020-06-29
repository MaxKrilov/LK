import ErIcon from '@/components/UI/ErIcon'
import ErButton from '@/components/UI/ErButton'
import { UserCardComponent } from '../../types'

export default {
  name: 'user-card',
  components: {
    'er-icon': ErIcon,
    'er-button': ErButton
  },
  props: {
    user: {
      type: Object
    }
  },
  methods: {
    closeCard (event: Event) {
      event.preventDefault()
      event.stopPropagation()
      this.$emit('close')
    },
    getImg (img: string) {
      return require(`@/assets/images/${img}`)
    }
  } as Partial<UserCardComponent>
}
