import { mapGetters } from 'vuex'
import Toast from '@/components/blocks/ErToast/index'
import { isSurvey } from '@/functions/notifications'

const TOAST_ADD_TIME = 1200

export default {
  components: {
    Toast
  },
  data () {
    return {
      // сюда запихиваются ID временно скрываемых тостов
      hidden: [],
      queue: [], // сейчас показываются
      toShow: [], // будут показаны
      maxShow: 4
    }
  },
  watch: {
    stackList (valuePromise) {
      valuePromise.then(result => {
        this.toShow = result

        if (result.length) {
          const addInterval = setInterval(() => {
            if (this.queue.length <= this.maxShow) {
              this.addToQueue()
            }

            if (!this.toShow.length) {
              clearInterval(addInterval)
            }
          }, TOAST_ADD_TIME)
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      stackList: 'campaign/getAll'
    })
  },
  methods: {
    addToQueue () {
      if (this.toShow.length) {
        this.queue.push(this.toShow.shift())
      }
    },
    removeFromQueue () {
      this.queue.shift()
    },
    getText (data) {
      return isSurvey(data.communication_type)
        ? data.description
        : data.text
    },
    hideToast (id) {
      this.hidden.push(id)
    },
    onClickToast (id) {
      this.$emit('click', id)
      this.hideToast(id)
    },
    onClearAll () {
      this.stackList.forEach(el => { this.hideToast(el.id) })
    },
    onHideToast (id) {
      this.hideToast(id)
    }
  }
}
