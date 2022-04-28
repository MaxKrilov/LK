export const STATUS_ACT_NOT_SIGNED = 'Не подписан'
export const STATUS_ACT_SIGNED = 'Подписан'
export const STATUS_ACT_CANCELED = 'Отказ'

export const STATUS_CONTRACT_ACTIVE = 'Активный'
export const STATUS_CONTRACT_READY = 'Готов для клиента'
export const STATUS_CONTRACT_SIGNED = 'Подписан'
export const STATUS_CONTRACT_CANCELED = 'Отменён'

export const isStatusActNotSigned = (status: string) => status === STATUS_ACT_NOT_SIGNED
export const isStatusActSigned = (status: string) => status === STATUS_ACT_SIGNED
export const isStatusActCanceled = (status: string) => status === STATUS_ACT_CANCELED

export const isStatusContractActive = (status: string) => status === STATUS_CONTRACT_ACTIVE
export const isStatusContractReady = (status: string) => status === STATUS_CONTRACT_READY
export const isStatusContractSigned = (status: string) => status === STATUS_CONTRACT_SIGNED
export const isStatusContractCanceled = (status: string) => status === STATUS_CONTRACT_CANCELED

export const isYes = (str: string) => ['да', 'yes'].includes(str.toLowerCase())
export const isNo = (str: string) => ['нет', 'no'].includes(str.toLowerCase())
