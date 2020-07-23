// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isLocalhost, isTesting } from '@/functions/helper'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Log (type: string, ...args: any): void {
  // TODO: реализовать журналирование не только в консоль

  // const params = [`ЛК ${type.toUpperCase()}:`, ...args]
  // для показа логов в браузере,
  // добавь в файл /.env.local переменную
  // VUE_APP_SHOW_LOG_IN_BROWSER=1
  // if (process.env.VUE_APP_SHOW_LOG_IN_BROWSER || isLocalhost() || isTesting()) {
  (console as any)[type].apply(console, [`ЛК ${type.toUpperCase()}:`, ...args])
  // }
}

function logError (...error: any): void {
  Log('error', ...error)
}

function logInfo (...info: any): void {
  Log('info', ...info)
}

export {
  logError,
  logInfo
}
