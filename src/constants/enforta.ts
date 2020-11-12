interface IEnfortaPackage {
  title: string
  iconName: string
  price: string
  key: string
  code: string
}

interface IEnfortaCameraService {
  title: string
  description: string
  code: string
}

const PAKETS: Record<string, IEnfortaPackage> = {
  BASE: {
    title: 'Пакет «Базовый»',
    iconName: 'security',
    price: '159',
    key: 'BASE',
    code: 'VIDNPBASE'
  },
  DETECTOR: {
    title: 'Пакет «Детектор очереди»',
    iconName: 'mans',
    price: '259',
    key: 'DETECTOR',
    code: 'VIDNPDO'
  },
  CLOUD_ARCHIVE: {
    title: 'Пакет «Облачный архив»',
    iconName: 'cloud',
    price: '100',
    key: 'CLOUD_ARCHIVE',
    code: 'VIDNPOA'
  },
  DETECTOR_CLOUD_ARCHIVE: {
    title: 'Пакет «Детектор очереди+Облачный архив»',
    iconName: 'star',
    price: '159',
    key: 'DETECTOR_CLOUD_ARCHIVE',
    code: 'VIDNPDOOA'
  }
}

const SERVICES: Record<string, IEnfortaCameraService> = {
  VIDEO_QUALITY: {
    title: 'Улучшенное качество видео',
    description: 'Передача сигнала в HD-разрешении. Требует более высокой скорости канала.',
    code: 'VIDNQUAL'
  },
  PTZ: {
    title: 'Поворотный модуль',
    description: 'Управление направлением видоискателя камеры',
    code: 'VIDNPTZ'
  },
  SOUND_RECORD: {
    title: 'Запись звука',
    description: 'Активируйте на камере запись звука, чтобы не только видеть, но и слышать.',
    code: 'VIDNSOUND'
  }
}

export {
  PAKETS,
  SERVICES
}
