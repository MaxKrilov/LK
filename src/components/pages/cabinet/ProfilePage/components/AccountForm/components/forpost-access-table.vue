<template lang="pug">
.forpost-access-table
  .forpost-access-table__head
    .col.head-label Домен
    .col.head-label Уч.запись
  .forpost-access-table__body
    template(v-if="forpostAccountsError || forpostUsersError")
      .forpost-access-table__row
        access-item(:show-close-button="false")
          .error
            er-icon(name="warning")
            span.error--text При получении данных по учетным записям произошла ошибка. Попробуйте позже.
    template(v-else-if="Object.keys(users).length")
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
import { mapGetters, mapState } from 'vuex'
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
    ...mapState('profile', [
      'forpostUsersError',
      'forpostAccountsError'
    ]),
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

  .error {
    color: map-get($red, 'base');
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: $padding-x3;

    .er-icon {
      svg {
        width: $padding-x8;
        height: $padding-x8;
      }
    }

    &__text {
      @extend %caption1;
    }
  }

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
