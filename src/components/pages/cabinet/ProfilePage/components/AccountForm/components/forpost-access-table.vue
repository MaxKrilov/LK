<template lang="pug">
.forpost-access-table
  .forpost-access-table__head
    .col.head-label Домен
    .col.head-label Уч.запись
  .forpost-access-table__body
    template(v-if="Object.keys(users).length")
      .forpost-access-table__row(v-for="user in users")
        access-item(
          :show-close-button="showDeleteButton"
          @delete="onDeleteRow(user.ID)"
        )
          .col {{ forpostAccountsRegistry[user.AccountID].Name }}
          .col {{ user.Login }}
    template(v-else)
      .forpost-access-table__row
        access-item(:show-close-button="false")
          span Без доступа
</template>

<script>
import { mapGetters } from 'vuex'
import AccessItem from './access-item'

export default {
  name: 'forpost-access-table',
  props: {
    users: {},
    showDeleteButton: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AccessItem
  },
  computed: {
    ...mapGetters({
      forpostAccountsRegistry: 'profile/forpostAccountsRegistry'
    })
  },
  methods: {
    onDeleteRow (userId) {
      this.$emit('delete', userId)
    }
  }
}
</script>

<style lang="scss">
.forpost-access-table {
  width: 100%;

  &__head,
  &__row {
    display: flex;
    align-items: center;

    .col {
      flex-grow: 1;
      width: 50%;
    }
  }

  &__head {
    .col:first-child {
      padding-left: $padding-x3;
    }
  }

  &__row {
    height: 32px;
    @extend %small-rounded-block;

    .col:last-child {
      padding-left: $padding-x2;
    }

    .access-item {
      width: 100%;
    }
  }

  &__body {
    margin-top: $padding-x4;
  }

  .head-label {
    @extend %caption2;
    padding-top: $padding-x1;
    height: $padding-x6;
  }
}
</style>
