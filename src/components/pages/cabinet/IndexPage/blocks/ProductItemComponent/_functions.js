export function getIconNameByCode(code) {
    code = code.toLowerCase();
    if (~code.indexOf('интернет')) {
        return 'internet';
    }
    if ((~code.indexOf('облач') && ~code.indexOf('телефон')) || ~code.indexOf('оатс')) {
        return 'cloud_telephone';
    }
    if (~code.indexOf('телефон')) {
        return 'telephone';
    }
    if (~code.indexOf('wifi') || ~code.indexOf('wi-fi')) {
        return 'wifi';
    }
    if (~code.indexOf('видео')) {
        return 'watch';
    }
    return 'question';
}
//# sourceMappingURL=_functions.js.map