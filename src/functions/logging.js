function Log(type, ...args) {
    // TODO: реализовать журналирование не только в консоль
    const params = [`ЛК ${type.toUpperCase()}:`, ...args];
    // для показа логов в браузере,
    // добавь в файл /.env.local переменную
    // VUE_APP_SHOW_LOG_IN_BROWSER=1
    if (process.env.VUE_APP_SHOW_LOG_IN_BROWSER) {
        console[type].apply(console, params);
    }
}
function logError(...error) {
    Log('error', ...error);
}
function logInfo(...info) {
    Log('info', ...info);
}
export { logError, logInfo };
//# sourceMappingURL=logging.js.map