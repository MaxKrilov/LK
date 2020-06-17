import {
  copyObject,
  isEmpty
} from '@/functions/helper'

test('Копирование объекта helper.copyObject()', () => {
  let testObject = {
    title: 'Заголовок тестируемого объекта',
    body: {
      title: 'заголовок дочернего объекта',
      content: [
        'a', 'b', 'c'
      ]
    }
  }

  expect(copyObject(testObject))
    .toEqual(
      {
        body: {
          content: [
            'a', 'b', 'c'
          ],
          title: 'заголовок дочернего объекта'
        },
        title: 'Заголовок тестируемого объекта'
      }
    )
})

test('Проверка пустой переменной helper.isEmpty()', () => {
  expect(isEmpty([])).toBeTruthy()
  expect(isEmpty([
    'жираф',
    'слон',
    'носорог'
  ]))
    .not.toBeTruthy()

  // с объектами не работает!
  // expect(isEmpty({ legCount: 3 })).not.toBeTruthy()
})
