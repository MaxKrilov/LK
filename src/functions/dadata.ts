/* eslint-disable camelcase */
import store from '../store'
import { API_DADATA } from '@/store/actions/api'
import {
  DaDataParty,
  DaDataPartyBranchType,
  DaDataPartyType,
  DaDataSuggestion,
  DaDataAddress
} from '@/dadata_interfaces/dadata_interfaces'

export class DadataRequest {
  private static token = store.state.api[API_DADATA]

  private static _requestDadata<T> (
    url: string,
    data: Record<string, any>
  ) {
    return new Promise<T>(async (resolve, reject) => {
      const options: RequestInit = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${DadataRequest.token}`
        },
        body: JSON.stringify(data)
      }

      try {
        const response = await fetch(url, options)
        const responseJson = await response.json()

        resolve(responseJson)
      } catch (e) {
        reject(e)
      }
    })
  }

  public static getCompanyInfo (payload: {
    query: string,
    count?: number,
    kpp?: string,
    branch_type?: DaDataPartyBranchType,
    type?: DaDataPartyType
  }) {
    return DadataRequest._requestDadata<Promise<{ suggestions: DaDataSuggestion<DaDataParty>[] }>>(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party',
      payload
    )
  }

  public static getAddressInfo (payload: {
    query: string,
    count?: number,
    language?: 'ru' | 'en',
    locations?: {
      region?: string,
      area?: string,
      city?: string,
      settlement?: string,
      street?: string
    }[],
    locations_geo?: {
      lat: number
      lon: number
      radius_meters?: number
    }[],
    locations_boost?: {
      kladr_id: string
    }[],
    from_bound?: { country: string, region: string, area: string, city: string, settlement: string, street: string, house: string }
    to_bound?: { country: string, region: string, area: string, city: string, settlement: string, street: string, house: string }
  }) {
    return DadataRequest._requestDadata<{ suggestions: DaDataSuggestion<DaDataAddress>[] }>(
      'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
      payload
    )
  }
}
