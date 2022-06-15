export type specDataRecord = Record<string, unknown>
export type listProductByService = {
  code: string,
  name: string,
  price: string,
  offerName: string,
  parent: string
  map(specialDataRecordNewTv: (specialDataRecord: specDataRecord) => string): readonly listProductByService[] | null | Iterable<listProductByService>
}
export type categoryTv = 'ТВ' | 'New TV' | any
export type serviceCategoryTv = Record<categoryTv, listProductByService>
