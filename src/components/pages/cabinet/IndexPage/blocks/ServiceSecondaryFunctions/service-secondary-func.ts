
import { specDataRecord } from '../ServiceSecondaryFunctions/service-secondary-type'
export const subcategoryFields = (field: specDataRecord) => field.parent !== 'ТВ'
export const specialDataRecordNewTv = (specialDataRecord: specDataRecord) => JSON.stringify(specialDataRecord)
export const specificDataRecordNewTv = (specificDataRecord: any) => JSON.parse(specificDataRecord)
export const subcategoryFieldsPrice = (acc:{}, curr: any) => acc + curr.price
export const bpiFilterKey = (bpiFilter: specDataRecord) => bpiFilter['bpi']
