// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import { Route, RawLocation } from 'vue-router'

declare module 'vue/types/vue' {
  interface Vue {
    beforeRouteEnter?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void,
    beforeRouteLeave?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void
    beforeRouteUpdate?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void
  }
}
