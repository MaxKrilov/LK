/* eslint-disable max-len, import/export, no-use-before-define */
import Vue, { VueConstructor } from 'vue'

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type ExtractVue<T extends VueConstructor | VueConstructor[]> = T extends (infer U)[]
  ? UnionToIntersection<U extends VueConstructor<infer V> ? V : never>
  : T extends VueConstructor<infer V> ? V : never

export default function mixins<T extends VueConstructor[]> (...args: T): ExtractVue<T> extends infer V ? V extends Vue ? VueConstructor<V> : never : never
export default function mixins<T extends Vue> (...args: VueConstructor[]): VueConstructor<T>
export default function mixins (...args: VueConstructor[]): VueConstructor {
  return Vue.extend({ mixins: args })
}
