import {
  leadingZero,
  cutText
} from '@/functions/filters'

test('Проверяем filters.leadingZero', () => {
  expect(leadingZero(1, 2)).toBe('01')
  expect(leadingZero(12, 2)).toBe('12')
  expect(leadingZero(1, 3)).toBe('001')
  expect(leadingZero(13, 3)).toBe('013')
  expect(leadingZero(1234, 8)).toBe('00001234')
})

test('Тест обрезки текста с filters.cutText', () => {
  expect(cutText('Ого!', 4)).toBe('Ого!')
  expect(cutText('Привет', 3)).toBe('При...')
  expect(cutText(`Длинный текст, который потом обрежется.
    Поэтому хочу передать привет бабушке :-P`, 4)).toBe('Длин...')
})
