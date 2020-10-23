<template lang="pug">
  er-dialog(
    v-model="active"
    :max-width="380"
  )
    .vc-go-to-forpost
      p Логин и пароль для авторизации на портале "Видеонаблюдение" находятся у вас на почте.

      p Для входа на портал пройдите по ссылке&nbsp;
        a(href="https://vs.domru.ru") https://vs.domru.ru
</template>

<script>
import { mapActions } from 'vuex'
import { VS_LOGIN } from '@/constants/url'

export default {
  data: () => ({ active: false }),
  watch: {
    active (val) {
      if (!val) {
        this.$router.go(-1)
      }
    }
  },
  methods: {
    ...mapActions({ getForpostSSOLink: 'videocontrol/fetchForpostLink' }),
    getForpostLoginLink () {
      return Promise.resolve({ loginLink: VS_LOGIN })
    },
    getRedirectLink () {
      // TODO: заменить на getForpostSSOLink() когда будет работать сквозная авторизация
      return this.getForpostLoginLink()
    }
  },
  mounted () {
    console.log('make redirect')
    this.getRedirectLink()
      .then(data => { window.location = data.loginLink })
  }
}
</script>

<style lang="scss">
.vc-go-to-forpost {
  background-color: map_get($shades, 'white');

  padding: $padding-x6;

  p + p {
    margin-top: $padding-x2;
  }
}
</style>
