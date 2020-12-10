import store from '@/store'

export function StoreGetter (getterPath: string) {
  /* Декоратор для привязки геттера стора к геттеру компонента

    Пример использования

    @Component
    export default class MyComponent extends Vue {
      @StoreGetter('auth/hasAccess')
      hasAccess: boolean
    }
  */
  return function (object: Object, propertyName: string) {
    Object.defineProperty(object, propertyName, {
      get: () => {
        return store.getters[getterPath]
      }
    })
  }
}
