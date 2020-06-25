function isEmptyObject (obj) {
  return !Object.keys(obj).length
}

function isEmpty (value) {
  if (typeof value === 'object') {
    return isEmptyObject(value)
  }

  return !value
}

export function promisedStoreValue (store, namespace, valueName) {
  /*
    Ф-ция возвращает промис возвращающий указанные значения из стора

    Пример:

    Хотим дождаться 'user/activeBillingAccount' а потом выполнить код

    promisedStoreValue(this.$store, 'user', 'activeBillingAccount')
      .then(billingAccount => {
        // здесь код, который использует billingAccount
      })
  */
  const value = store.state[namespace][valueName]

  return new Promise((resolve) => {
    if (isEmpty(value)) {
      const detachWatcher = store.watch(
        state => state[namespace][valueName],
        watchedValue => {
          detachWatcher()
          resolve(watchedValue)
        }
      )
    } else {
      resolve(value)
    }
  })
}
