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
  ],
  VIDCTEMP: [
    {
      iconName: 'heat_map',
      title: 'Температура',
      text: 'С высокой точностью определяет температуру тела у группы людей до 25 человек и сохраняет все данные в журнал.'
    },
    {
      ...Notification,
      text: 'Моментально отправляет PUSH или E-mail уведомление в случае превышения заданной температуры.'
    },
    {
      iconName: 'watch',
      title: 'Тепловизоры',
      text: 'Модуль «Контроль температуры» доступен для тепловизионных камер и панелей доступа. Поддержка программы чтения с экрана включена.'
    }
  ],
  VIDCTEMPFACE: [
    {
      iconName: 'heat_map',
      title: 'Температура',
      text: 'Автоматически определяет лицо человека, сопоставляет с вашей базой и измеряет ему температуру тела. Все данные сохраняются в журнале.'
    },
    {
      ...Notification,
      text: 'Моментально отправляет PUSH или E-mail уведомление в случае превышения заданной температуры.'
    },
    {
      iconName: 'profile',
      title: 'Управление доступом',
      text: 'При интеграции со СКУД можно настроить доступ по базе лиц и ограничивать его при повышенной температуре. Поддержка программы чтения с экрана включена.'
    }
  ],
  VIDCMASKL: [
    {
      iconName: 'mask',
      title: 'Масочный режим',
      text: 'Определяет наличие маски у человека, который находится на статичном месте: кассир, администратор, преподаватель.'
    },
    {
      ...Notification,
      text: 'Моментально отправляет PUSH или E-mail уведомление в случае превышения заданной температуры.'
    },
    {
      iconName: 'stat',
      title: 'Отчёты',
      text: 'Сохраняет все данные о нарушениях в журнале, события и отчеты доступны к просмотру и скачиванию.\n' +
        'Поддержка программы чтения с экрана включена.'
    }
  ],
  VIDCMASKP: [
    {
      iconName: 'mask',
      title: 'Масочный режим',
      text: 'Определяет наличие маски у группы людей в потоке и движении: на проходной, входе в офис или магазин, в торговом центре.\n' +
        'Поддержка программы чтения с экрана включена.'
    },
    {
      ...Notification,
      text: 'Моментально отправляет PUSH или E-mail уведомление в случае превышения заданной температуры.'
    },
    {
      iconName: 'stat',
      title: 'Отчёты',
      text: 'Сохраняет все данные о нарушениях в журнале, события и отчеты доступны к просмотру и скачиванию.\n' +
        'Поддержка программы чтения с экрана включена.'
    }
  ],
  VIDCQUE: [ // детектор очереди
    {
      iconName: 'queue',
      title: 'Очередь',
      text: 'Моментально уведомляет в случае возникновения очереди, позволяя вовремя открывать дополнительные кассы и не терять лояльность клиентов. Поддержка программы чтения с экрана включена.\n'
    },
    {
      ...Notification,
      text: 'Моментально отправляет PUSH или E-mail уведомление в случае превышения заданной температуры.'
    },
    {
      iconName: 'stat',
      title: 'Отчёты',
      text: 'Сохраняет все данные о превышениях очереди в гибко настраиваемых отчетах с инфографикой, они доступны к просмотру и скачиванию.'
    }
  ],
  VIDCSHELF: [ // наполненность полок
    {
      iconName: 'fullness',
      title: 'Пустые полки',
      text: 'Оповещает сотрудников об опустевшей витрине и необходимости ее пополнить, чтобы покупатели всегда могли найти нужный товар на полке.\n' +
        'Поддержка программы чтения с экрана включена.'
    },
    {
      ...Notification,
      text: 'Моментально отправляет PUSH или E-mail уведомление в случае превышения заданной температуры.'
    },
    {
      iconName: 'stat',
      title: 'Отчёты',
      text: 'Сохраняет все данные о превышениях очереди в гибко настраиваемых отчетах с инфографикой, они доступны к просмотру и скачиванию.'
    }
  ],
  VIDCFGA: [ // распознавание лиц, пола и возраста
    {
      iconName: 'face_detect2',
      title: 'Лицо, пол и возраст',
      text: 'Распознает лицо человека и сопоставляет с вашей базой. Определяет его пол и возраст, принадлежность к группе — черному и белому списку. Поддержка программы чтения с экрана включена.'
    },
    {
      iconName: 'storage',
      title: 'База лиц и поиск',
      text: 'Вы можете формировать свою базу лиц, группировать их, искать человека по фотографии в видеоархиве. Получайте моментальные уведомления в случае, если система нашла конкретного человека или из группы. \n' +
        'Поддержка программы чтения с экрана включена.'
    },
    {
      iconName: 'stat',
      title: 'Отчёты',
      text: 'Сохраняет все распознанные лица в журнале событий, формирует отчет по полу и возрасту, все они доступны к просмотру и скачиванию.\n' +
        'Поддержка программы чтения с экрана включена. '
    }
  ]
}

export default ANNOTATION_REGISTRY
