import { VueConstructor } from 'vue'

export type ExtractVue<T extends VueConstructor | VueConstructor[]> = T extends (infer U)[]
  ? UnionToIntersection<
    U extends VueConstructor<infer V> ? V : never
    >
  : T extends VueConstructor<infer V> ? V : never

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
