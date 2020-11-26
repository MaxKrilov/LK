<template lang="pug">
er-row.forpost-access-form
  er-flex(lg6)
    er-select(
      placeholder="Домен"
      trackId="ID"
      label="Name"
      v-model="currentAccount",
      :items="forpostAccounts"
      @input="onChangeAccount"
      :disabled="forpostAccountsError"
      v-class-mod="{'fetch-error': forpostAccountsError}"
    )
    .er-select-error(v-if="forpostAccountsError") Сервер не отвечает. Повторите позже

  er-flex(lg6)
    er-select(
      placeholder="Учётная запись"
      trackId="ID"
      label="Login"
      v-model="currentUser",
      :items="userList"
      @input="onChangeUser"
      :disabled="forpostUsersError"
      v-class-mod="{'fetch-error': forpostUsersError}"
    )
    .er-select-error(v-if="forpostUsersError") Сервер не отвечает. Повторите позже
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

const NO_DATA = 'Нет данных'

export default {
  name: 'forpost-access-form',
  data () {
    return {
      NO_DATA,
      currentAccount: null,
      currentUser: NO_DATA
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
      'forpostUsers',
      'forpostUsersError',
      'forpostAccountsError'
    ]),
    ...mapGetters('profile', [
      'unbindedForpostUserList',
      'bindedForpostUserList'
    ]),
    userList () {
      return this.currentAccount
        ? this.isFetchUserError
          ? [NO_DATA]
          : this.unbindedForpostUserList.filter(el => el.AccountID === this.currentAccount.ID)
        : []
    }
  }
}
</script>

<style lang="scss">
.forpost-access-form {
  .er-select-error {
    @extend %caption2;
    color: map-get($red, 'base');
    text-align: right;
  }

  .er-input--fetch-error {
    .er-input__control .er-input__slot {
      border-color: map-get($red, 'base');
      .er-select__selections {
        color: map-get($red, 'base');
      }
    }
  }
}
</style>
