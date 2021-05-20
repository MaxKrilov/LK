import { Vue, Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import CameraCheckbox from './camera-checkbox.vue'
import {
  ICamera,
  IBaseFunctionality,
  TBaseFunctionalityId
} from '@/interfaces/videocontrol'

const components = {
  CameraCheckbox
}

const props = {
  code: String,
  location: {},
  list: Array
}

const computed = {
  ...mapGetters({
    bfById: 'videocontrol/bfById'
  })
}

@Component({ components, props, computed })
export default class AddonConfig extends Vue {
  isCameraCountVisible: boolean = false
  cameraRegistry: Object = {}

  /* === mapGetters === */
  bfById!: (id: string) => IBaseFunctionality

  get CSS () {
    return this.$props.cover ? `background-image: url(${this.$props.cover})` : ''
  }

  onPlugAddon (value: { id: string, parentId: TBaseFunctionalityId, marketId: string, value: Boolean}) {
    const payload = {
      ...value,
      addressId: this.$props.location.address.id,
      locationId: this.$props.location.id,
      locationName: this.$props.location.name
    }

    this.$emit('plug-camera', payload)
  }

  isCameraWithService (id: TBaseFunctionalityId) {
    const bf = this.bfById(id)

    return bf?.services ? !!Object.values(bf?.services)?.find(
      (el: any) => {
        return el.offer.code === this.$props.code
      }
    ) : false
  }

  mounted () {
    this.cameraRegistry = this.$props.list.reduce(
      (result: {}, el: ICamera) => ({ ...result, [el.id]: false }),
      {}
    )
  }
}
