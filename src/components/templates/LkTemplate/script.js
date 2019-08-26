import MenuComponent from './components/MenuComponent/index'

export default {
  name: 'lk-template',
  components: {
    MenuComponent
  },
  data: () => ({
    pre: 'lk-template'
  }),
  mounted () {
    console.log(this._.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }))
  }
}
