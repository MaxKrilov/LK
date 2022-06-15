import { Component } from 'vue-property-decorator'
import { subcategoryFields, subcategoryFieldsPrice, specialDataRecordNewTv, specificDataRecordNewTv, bpiFilterKey } from './ServiceSecondaryFunctions/service-secondary-func'
import { listProductByService, categoryTv, serviceCategoryTv } from './ServiceSecondaryFunctions/service-secondary-type'
import { removeDuplicates } from '@/functions/helper2'
import ServiceListMixin from './ServiceListMixin'
@Component({ })
export default class RebuildingListService extends ServiceListMixin {
  listRecord: serviceCategoryTv[] = []
  listConcatFinal: serviceCategoryTv[] = []

  get usedCollectionFields () {
    return this.$props.list
  }

  get makeFormationDataRecord () {
    return (name: unknown) => {
      return name && {
        ...this.dataRecord,
        'ТВ': removeDuplicates(Array
          .prototype
          .concat
          .apply([], this.listConcatFinal)) as NonNullable<serviceCategoryTv['ТВ']>
      }
    }
  }
  get renderedProductTVList () {
    return this.usedCollectionFields.filter(subcategoryFields) as Pick<listProductByService, 'parent'>
  }

  get renderedSumOfAllPrices () {
    return this.usedCollectionFields.reduce(subcategoryFieldsPrice, 0)
  }
  get parsingCollectionFields () {
    const formList = (fieldKey: Record<string, any>) => {
      this.listRecord.push(fieldKey.code)
    }
    this.usedCollectionFields.map(formList)
    return this.listRecord
  }

  get excludedNewTV () {
    return (fieldKey: any) => {
      return (data: listProductByService) => {
        this.dataRecord = {
          ...this.dataRecord,
          [fieldKey]: data
        }
        const formationDataRecord = this.makeFormationDataRecord
        const cloneDataRecord = JSON.parse(JSON.stringify(this.dataRecord))
        const dataLeadEntries: Parameters<typeof cloneDataRecord> | any = (acc: {}, [name, curr]: serviceCategoryTv[]) => {
          // @ts-ignore
          this.listConcatFinal.push(curr)
          this.listConcatFinal.filter(bpiFilterKey)
          return acc && formationDataRecord(name)
        }
        // @ts-ignore
        const tvRecord = this.dataRecord['ТВ'] as Required<categoryTv, 'ТВ'>
        this.dataRecord = Object.entries(cloneDataRecord).reduce(dataLeadEntries, {}) as ReturnType<typeof dataLeadEntries>
        const specialDataRecord = new Set(this.dataRecord['ТВ']?.map(specialDataRecordNewTv))
        const specificDataRecord: any = Array.from(specialDataRecord).map(specificDataRecordNewTv)
        const specExclude: Exclude<keyof categoryTv, 'New TV'> = tvRecord && (this.dataRecord['ТВ'] = specificDataRecord)
        return specExclude
      }
    }
  }

  get toServiceCategoryTv () {
    return (fieldKey: serviceCategoryTv | any) => {
      const exNewTV = this.excludedNewTV(fieldKey)
      this.fetchData(fieldKey)
        // @ts-ignore
        .then(exNewTV)
    }
  }
  onLoadService () {
    this.parsingCollectionFields.map(this.toServiceCategoryTv)
  }
}
