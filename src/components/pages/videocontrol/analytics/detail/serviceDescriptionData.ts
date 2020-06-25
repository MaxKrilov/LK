interface IServiceAnnotation {
  iconName: string
  title: string
  text: string
}

interface IServiceAnnotationRegistry {
  [key: string]: IServiceAnnotation[]
}

const Notification: IServiceAnnotation = {
  iconName: 'bell',
  title: 'Уведомления',
  text: 'Настраивайте события и получайте по ним моментальные уведомления. Они будут сохранены в ваш видеоархив и доступны к просмотру.'
}

const Statistic: IServiceAnnotation = {
  iconName: 'stat',
  title: 'Отчеты и аналитика',
  text: 'Формируйте и выгружайте отчеты за выбранный период времени. Контролируйте трафик и базу разрешенных номеров.'
}

const ANNOTATION_REGISTRY: IServiceAnnotationRegistry = {
  VIDCBARR: [
    Notification,
    {
      iconName: 'barrier',
      title: 'Контроль допуска',
      text: 'Обеспечивает автоматический контроль въезда и выезда автомобилей на объект с помощью сравнения гос.номера и базы номеров.'
    },
    {
      iconName: 'settings',
      title: 'Ручное управление',
      text: 'При необходимости оператор может контролировать доступ в ручном режиме, например, если номера еще нет в базе и необходим однократный въезд.'
    },
    Statistic
  ],
  VIDCCAR: [
    Notification,
    {
      iconName: 'car',
      title: 'Определение номера',
      text: ''
    },
    Statistic
  ],
  VIDCSEGM: [
    {
      iconName: 'face_detect',
      title: 'Сегментация',
      text: 'Считает уникальных посетителей. Определяет пол и возраст ваших клиентов, позволяет отслеживать его в динамике.'
    },
    Statistic
  ],
  VIDCMAP: [
    {
      iconName: 'heat_map',
      title: 'Тепловая карта',
      text: 'Использует цветовую гамму для выделения популярных маршрутов движения посетителей.'
    },
    Statistic
  ],
  VIDCCOUNT: [
    {
      iconName: 'mans',
      title: 'Счетчик посетителей',
      text: 'Определяет сколько человек зашло и вышло в торговую точку. Определяйте часы наибольшей и наименьшей загруженности вашего бизнеса.'
    },
    Statistic
  ],
  VIDCSTAFF: [
    {
      iconName: 'eye_open',
      title: 'Контроль сотрудников',
      text: 'Определяет наличие или отсутствие персонала на рабочем месте. Отслеживает активность, время начала и окончания присутствия.'
    },
    Statistic
  ],
  VIDCPSEC: [
    Notification,
    {
      iconName: 'noise_sound',
      title: 'Детектор громкого звука',
      text: 'Фиксирует любой посторонний звук на объекте - звук бьющегося стекла или витрины, зарождающийся конфликт или беспорядки.'
    },
    {
      iconName: 'face_detect',
      title: 'Детектор лиц',
      text: 'Обнаруживает появления лиц в кадре'
    },
    {
      iconName: 'watch_break',
      title: 'Детектор саботажа',
      text: 'Оповещает о любом повреждении камеры - расфокусировка, засвечивание, изменение положения, закрытие объектива. '
    },
    {
      iconName: 'move_detected',
      title: 'Детектор движения',
      text: 'Показывает движение в кадре и в заданных участках, сохраняет время начала и окончания движения, а также координаты.'
    }
  ]
}

export default ANNOTATION_REGISTRY
