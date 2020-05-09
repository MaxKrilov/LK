import { Vue, Component } from 'vue-property-decorator'
import PhoneHint from '../PhoneHint/index.vue'

const components = { PhoneHint }
@Component({ components })
export default class BlacklistForm extends Vue {
}
