import { UserCardComponent } from '../../types'

export default {
  name: 'user-card',
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
