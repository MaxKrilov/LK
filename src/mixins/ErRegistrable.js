/*
* Миксин для опций inject/provide, которые позволяют компоненту-родителю внедрять зависимости во всех его
* компонентах-потомках, независимо от того, насколько глубоко в иерархии они находятся, пока они находятся в той
* же самой родительской цепочке
* @copy: https://ru.vuejs.org/v2/api/#provide-inject
*/
import Vue from 'vue'

function generateWarning (child, parent) {
  return () => console.warn(`Компонент ${child} должен использоваться внутри ${parent}`)
}

export function inject (namespace, child, parent) {
  const defaultImpl = child && parent ? {
    register: generateWarning(child, parent),
    unregister: generateWarning(child, parent)
  } : null
  return Vue.extend({
    name: 'registrable-inject',
    inject: {
      [namespace]: {
        default: defaultImpl
      }
    }
  })
}

export function provide (namespace) {
  return Vue.extend({
    name: 'registrable-provide',
    methods: {
      register: null,
      unregister: null
    },
    provide () {
      return {
        [namespace]: {
          register: this.register,
          unregister: this.unregister
        }
      }
    }
  })
}
