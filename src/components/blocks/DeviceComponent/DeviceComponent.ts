import { Vue, Prop, Component } from 'vue-property-decorator'
import { API } from '@/functions/api'
import { mapGetters, mapActions } from 'vuex'
import { ICustomerProduct } from '@/tbapi'

@Component({
  computed: {
    ...mapGetters('auth', ['getTOMS'])
  },
  methods: {
    ...mapActions({
      customerProducts: 'productnservices/customerProducts'
    })
  }
})
export default class DeviceComponent extends Vue {
  @Prop({ type: String }) readonly productId!: string
  @Prop({ type: Array }) readonly listOfDevices!: string[]

   isOpenDevices:boolean = false
   isLoadedDevices:boolean = false
   isLoadingDevices:boolean = false
   devices:Record<string, string>[] = []
   getTOMS!:string

   toggleDevices () {
     this.isOpenDevices = !this.isOpenDevices
     if (!this.isLoadedDevices) this.getDevices()
   }

   customerProducts!: <T = { api: API, parentIds?: Array<string | number>, code?: string }, R = Promise<Record<string, ICustomerProduct>>>(args: T) => R

   getDevices () {
     this.isLoadingDevices = true
     this.onSuccessLoadingDevices()
   }

   onSuccessLoadingDevices () {
     throw new Error('Method must be implemented')
   }

   toDoAfterLoadingDevices () {
     this.isLoadingDevices = false
     this.isLoadedDevices = true
   }
}
