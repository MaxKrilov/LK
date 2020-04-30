/* eslint-disable no-useless-escape */
export const PATTERN_LETTERS = /(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]/
export const PATTERN_NUMBERS = /[0-9]/
export const PATTERN_SYMBOLS = /[_\]\[\-.!#]/
export const PATTERN_BAD_SYMBOLS = /[,;:/\\|=+*'"`~@№$%^&?<>(){}éèêëùüàâöïç\s]/
export const PATTERN_PASSWORD = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(^[0-9a-zA-Z\[_\-.!#\]]{8,16}$)/
export const PATTERN_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-ZА-Яа-я\-0-9]+\.)+[a-zA-ZА-Яа-я]{2,}))$/
export const PATTERN_NOT_LETTERS = /^[a-zA-Z]+$/
export const PATTERN_RUSSIAN_PHONE = /^((\s|8|\+7)(-?|\s?))?\(?\d{3}\)?(-?|\s?)?\d{1}(-?|\s?)??\d{1}(-?|\s?)??\d{1}(-?|\s?)??\d{1}(-?|\s?)??\d{1}(-?|\s?)??\d{1}(-?|\s?)??\d{1}/
export const PATTERN_CYRILLIC_LETTERS = /^[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/
export const PATTERN_HAS_CYRILLIC_LETTERS = /[ЁёА-я]+/
export const PATTERN_HTML_TAGS = /(<(\/?[^>]+)>)/
export const PATTERN_СYRILLIC_WITH_DASH = /^[а-яА-ЯёЁ-]+$/
