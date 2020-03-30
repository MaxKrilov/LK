export default {
  data () {
    return {
      userList: [],
      currentUser: ''
    }
  },
  computed: {
    subscribedUserList () {
      return this.userList.filter(user => user.subscribed)
    },
    unsubscribedUserList () {
      return this.userList.filter(user => !user.subscribed)
    },
    subscribedUserListArray () {
      return this.subscribedUserList.map(el => el.name)
    }
  },
  methods: {
    handleUserChange (e) {
    },
    _getUserBy (prop, userName) {
      return this.userList.filter(el => {
        return el[prop] === userName
      })
    },
    onClickRemoveUser (userId) {
      this._getUserBy('id', userId).map(el => { el.subscribed = true })
    },
    onClickAddUser () {
      this._getUserBy('name', this.currentUser).map(el => { el.subscribed = false })
      this.$set(this, 'currentUser', '')
    }
  }
}
