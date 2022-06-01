import Vue from 'vue'
import Component from 'vue-class-component'

import Swiper, { Pagination, Navigation } from 'swiper'

import 'swiper/swiper-bundle.css'
import { mapGetters } from 'vuex'
import { IBanner, IBannerList } from '@/tbapi/banners'

import ErPlugProduct from '@/components/blocks/ErPlugProduct/index.vue'

const DURATION_STORY = 10000

@Component<InstanceType<typeof ErStories>>({
  components: {
    ErPlugProduct
  },
  watch: {
    isOpenDialog (val) {
      if (val) {
        this.defineTimer()
      } else {
        window.clearInterval(this.timer)
        this.currentTime = 0
      }
    },
    computedBannerList (val) {
      val.length >= 1 && this.defineSlider()
    }
  },
  computed: {
    ...mapGetters({
      banners: 'banners/banners',
      listProductByAddress: 'user/getListProductByAddress'
    })
  }
})
export default class ErStories extends Vue {
  /// Options
  $refs!: {
    'swiper': HTMLDivElement
  }
  /// Data
  isOpenDialog: boolean = false
  activeSlideNumber: number = 0
  isMouseDown: boolean = false
  isPlugProduct: boolean = false

  slider: Swiper | null = null

  currentTime: number = 0
  timer: number = -1

  plugDescriptionModal: string = ''
  plugServices: string = ''

  /// Vuex getters
  readonly banners!: IBannerList | null
  readonly listProductByAddress!: any[]

  /// Computed
  get computedID () {
    return `er-stories__${this._uid}`
  }

  get getTimerWidth () {
    return `${this.currentTime / DURATION_STORY * 100}%`
  }

  get computedBannerList (): IBanner[] {
    return this.banners === null
      ? []
      : [
        ...this.banners.client,
        ...this.banners.all
      ]
  }

  get getRequestDataForConnect () {
    const address = this.listProductByAddress[0]
    return {
      descriptionModal: this.plugDescriptionModal,
      services: this.plugServices,
      addressId: address?.addressId || '',
      fulladdress: address?.address || '',
      type: 'create'
    }
  }

  /// Methods
  defineSlider () {
    this.slider = new Swiper(this.$refs.swiper, {
      modules: [Pagination, Navigation],
      slidesPerView: 'auto',
      spaceBetween: 30,
      navigation: {
        prevEl: `#${this.computedID}--prev`,
        nextEl: `#${this.computedID}--next`
      },
      pagination: {
        el: '.er-stories__pagination'
      }
    })
  }

  openStoryDialog (step: number) {
    this.activeSlideNumber = step

    setTimeout(() => {
      this.isOpenDialog = true
    })
  }

  defineTimer () {
    this.timer = window.setInterval(() => {
      !this.isMouseDown && (this.currentTime += 100)

      if (this.currentTime >= DURATION_STORY) {
        this.onNextStoryHandler()
        this.currentTime = 0
      }
    }, 100)
  }

  onNextStoryHandler () {
    if (this.activeSlideNumber === this.computedBannerList.length) {
      this.isOpenDialog = false
      return
    }

    this.activeSlideNumber += 1
    this.currentTime = 0
  }

  onPrevStoryHandler () {
    if (this.activeSlideNumber === 1) {
      this.isOpenDialog = false
      return
    }

    this.activeSlideNumber -= 1
    this.currentTime = 0
  }

  getStoryDescription (banner: IBanner) {
    return ('additionalFields' in banner) && ('description' in banner.additionalFields)
      ? banner.additionalFields.description
      : ''
  }

  getStoryTitle (banner: IBanner) {
    return ('additionalFields' in banner) && ('title' in banner.additionalFields)
      ? banner.additionalFields.title
      : ''
  }

  getStoryButtonPosition (banner: IBanner) {
    if (Array.isArray(banner.button)) return 4
    // eslint-disable-next-line eqeqeq
    if (banner.button.position.top == 1) {
      return -1
    }
    // eslint-disable-next-line eqeqeq
    if (banner.button.position.middle == 1) {
      return 2
    }

    return 4
  }

  onStoryButtonClickHandler (banner: IBanner) {
    if (Array.isArray(banner.button)) return
    const action = banner.button.action

    if (action === 'redirect') {
      if (('bannerUrl' in banner) && banner.bannerUrl!.indexOf('http') >= 0) {
        location.href = banner.bannerUrl!
      } else if (('bannerUrl' in banner)) {
        this.$router.push(banner.bannerUrl!)
      }
    } else if (action === 'order') {
      this.plugDescriptionModal = banner.additionalFields.descriptionModal
      this.plugServices = banner.additionalFields.services

      this.isOpenDialog = false

      this.$nextTick(() => {
        this.isPlugProduct = true
      })
    }
  }

  /// Hooks
  mounted () {
    this.computedBannerList.length >= 1 && this.defineSlider()
  }
}
