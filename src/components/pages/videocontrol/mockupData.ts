const Point = 'г. Санкт-Петербург, ул. Большая Константинопольская, д. 99, оф. 1'

const MockupImageUrl1 = 'https://picsum.photos/320/200'
const MockupImageUrl2 = 'https://picsum.photos/320/201'
const MockupImageUrl3 = 'https://picsum.photos/320/202'
const MockupLongImage1 = 'https://picsum.photos/1000/300'

const addonFeatures = [
  {
    icon: 'bell',
    name: 'Уведомления',
    description:
      'Все события будут сохранены в ваш видеоархив. Получайте уведомления о событиях.'
  },
  {
    icon: 'noise_sound',
    name: 'Детектор громкого звука',
    description:
      'Фиксирует любой посторонний шум на объекте — звук бьющегося стекла/витрины, зарождающийся конфликт'
  },
  {
    icon: 'face_detect',
    name: 'Детектор лиц',
    description:
      'Обнаруживает появление лиц в кадре'
  },
  {
    icon: 'watch_break',
    name: 'Детектор саботажа',
    description:
      'Оповестит о любом повреждении камеры — расфокусировка, засвечивание, изменение положения, закрытие камеры'
  },
  {
    icon: 'move_detected',
    name: 'Детектор движения',
    description:
      'Покажет движение в кадре и в заданных участках, сохранит время начала и окончания движения, а также координаты'
  }
]

const pointAddonConfig = {
  title: Point,
  cameraList: [
    {
      title: 'camera_kuhnya_01',
      isEnabled: true
    },
    {
      title: 'camera_kuhnya_02',
      isEnabled: true
    },
    {
      title: 'camera_kuhnya_03',
      isEnabled: false
    },
    {
      title: 'camera_zal_01',
      isEnabled: true
    },
    {
      title: 'camera_zal_02',
      isEnabled: false
    }
  ]
}

const pointAddonConfigList = [
  pointAddonConfig,
  pointAddonConfig
]

const Mockup = {
  Point,
  addonFeatures,
  MockupImageUrl1,
  MockupImageUrl2,
  MockupImageUrl3,
  MockupLongImage1,
  pointAddonConfig,
  pointAddonConfigList
}

export default Mockup
