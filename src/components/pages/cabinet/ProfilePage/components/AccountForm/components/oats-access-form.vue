<template lang="pug">
er-row.oats-access-form
  er-flex(lg6)
    er-select(
      placeholder="Домен"
      trackId="ID"
      label="Name"
      v-model="currentDomain",
      :items="oatsDomains"
      @input="onChangeAccount"
      :disabled="oatsDomainFetchError"
      v-class-mod="{'fetch-error': oatsDomainFetchError}"
    )
    .er-select-error(v-if="oatsDomainFetchError") Сервер не отвечает. Повторите позже

  er-flex(lg6)
    er-select(
      placeholder="Учётная запись"
      trackId="sso_id"
      label="name"
      v-model="currentUser",
      :items="userList"
      @input="onChangeUser"
      :disabled="oatsUsersFetchError || oatsDomainFetchError || !currentDomain"
      v-class-mod="{'fetch-error': oatsUsersFetchError}"
    )
    .er-select-error(v-if="oatsUsersFetchError") Сервер не отвечает. Повторите позже
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { uniqBy } from 'lodash'

const NO_DATA = 'Нет данных'

export default {
  name: 'oats-access-form',
  data () {
    return {
      NO_DATA,
      currentDomain: null,
      currentUser: NO_DATA
    }
  },
  methods: {
    onChangeAccount () {
      if (this.currentAccount) {
        this.$set(this, 'currentUser', null)
      }
    },
    onChangeUser () {
      this.$emit('input', {
        domain: this.currentDomain,
        ...this.currentUser
      })
    }
  },
  computed: {
    ...mapState('profile', [
      'oatsDomains',
      'oatsUsers',
      'oatsUsersFetchError',
      'oatsDomainFetchError'
    ]),
    ...mapGetters('profile', [
      'unbindedOatsUserList',
      'bindedOatsUserList',
      'allOatsUserList'
    ]),
    userList () {
      return this.currentDomain
        ? this.oatsUsersError
          ? [NO_DATA]
          : uniqBy(this.allOatsUserList.filter(el => el.domain === this.currentDomain), 'login')
        : []
    }
  }
}
</script>

<style lang="scss">
.oats-access-form {
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
