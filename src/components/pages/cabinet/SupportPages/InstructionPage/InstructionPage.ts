import Vue from 'vue'

interface IInstructionContent {
    name: string,
    // eslint-disable-next-line camelcase
    short_description: string,
    // eslint-disable-next-line camelcase
    category_name: string,
    id: string
}

export default Vue.extend({
  name: 'InstructionPage',
  props: {
    id: String
  },
  data () {
    return {
      instructionContent: {} as IInstructionContent
    }
  },
  mounted () {
    this.$store.dispatch('instructions/getInstructionInfoById', this.$props.id)
      .then((response: IInstructionContent) => {
        this.$data.instructionContent = response
      }
      )
  }
})
