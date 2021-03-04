import Intersect from '@/directives/intersect'

import Vue from 'vue'

export default function intersectable (options: { onVisible: string[] }) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return Vue.extend({ name: 'intersectable' })
  }

  return Vue.extend({
    name: 'intersectable',

    mounted () {
      Intersect.inserted(this.$el as HTMLElement, {
        name: 'intersect',
        value: this.onObserve
      })
    },

    destroyed () {
      Intersect.unbind(this.$el as HTMLElement)
    },

    methods: {
      onObserve (entries: IntersectionObserverEntry[], observer: IntersectionObserver, isIntersecting: boolean) {
        if (!isIntersecting) return

        for (let i = 0, length = options.onVisible.length; i < length; i++) {
          const callback = (this as any)[options.onVisible[i]]

          if (typeof callback === 'function') {
            callback()
            continue
          }
        }
      }
    }
  })
}
