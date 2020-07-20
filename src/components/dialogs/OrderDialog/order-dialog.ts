import { Vue, Component } from 'vue-property-decorator'

@Component({
  props: {
    active: Boolean,
    title: String
  }
}
)
export default class OrderDialog extends Vue {
}
