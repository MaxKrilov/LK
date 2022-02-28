import { ISelectItem } from '@/components/UI2/ErtSelect'

export const PLACEMENT: ISelectItem[] = [
  {
    text: 'Помещение',
    value: 1
  },
  {
    text: 'Улица',
    value: 2
  }
]

export const RECORD_TYPE_LIST: ISelectItem[] = [
  {
    value: 1,
    text: 'Детектор движения'
  },
  {
    value: 2,
    text: 'Непрерывная запись'
  }
]

export const OWNERSHIP_TYPE_LIST: ISelectItem[] = [
  {
    value: 1,
    text: 'Взять в аренду'
  },
  {
    value: 2,
    text: 'Приобрести в собственность'
  },
  {
    value: 3,
    text: 'Своя камера'
  }
]

export const STREAM_RESOLUTION_LIST: ISelectItem[] = [
  {
    value: 1,
    text: 'HD (1280x720)'
  },
  {
    value: 2,
    text: 'FullHD (1920x1080)'
  }
]

export const ARCHIVE_DEPTH_LIST: ISelectItem[] = [
  {
    text: '3 дня',
    value: 1
  },
  {
    text: '7 дней',
    value: 2
  },
  {
    text: '10 дней',
    value: 3
  },
  {
    text: '14 дней',
    value: 4
  },
  {
    text: '30 дней',
    value: 5
  }
]
