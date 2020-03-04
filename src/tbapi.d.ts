export interface DocumentInterface {
  link: string
  fileName: string
  relatedTo: {
    name: string
    id: string | number
  }
  id: string | number
  signedWithDigitalSignature?: string
  letterOfGuarantee?: string
  verifying?: string
  visibleInSSP?: string
  bucket: string
  filePath: string
  contractNumber?: string
  contractStatus?: 'Готов для клиента' | 'Подписан' | 'Активный' | 'Отменён' | 'Расторгнут' | 'Истёк',
  amount?: string
  modifiedWhen: string | number
  creationDate: string | number
  type: {
    name: string
    id: string | number
  }
}
