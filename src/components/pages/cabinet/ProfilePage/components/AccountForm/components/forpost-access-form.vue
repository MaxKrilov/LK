<template lang="pug">
er-row.forpost-access-form
  er-flex(lg6)
    er-select(
      placeholder="Аккаунт"
      trackId="ID"
      label="Name"
      v-model="currentAccount",
      :items="forpostAccounts"
      @input="onChangeAccount"
    )
  er-flex(lg6)
    er-select(
      placeholder="Учётная запись"
      trackId="ID"
      label="Login"
      v-model="currentUser",
      :items="userList"
      @input="onChangeUser"
    )
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'forpost-access-form',
  data () {
    return {
      currentAccount: null,
      currentUser: null
    }
  },
  methods: {
    ...mapActions('profile', ['pullForpostUsers']),
    onChangeAccount () {
      if (this.currentAccount.ID) {
        this.currentUser = null
      }
    },
    onChangeUser () {
      this.$emit('input', this.currentUser)
    }
  },
  computed: {
    ...mapState('profile', [
      'forpostAccounts',
      'forpostUsers'
    ]),
    ...mapGetters('profile', [
      'unbindedForpostUserList',
      'bindedForpostUserList'
    ]),
    userList () {
      return this.currentAccount
        ? this.unbindedForpostUserList.filter(el => el.AccountID === this.currentAccount.ID)
        : []
    }
  }
}
</script>
