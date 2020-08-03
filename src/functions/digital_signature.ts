import moment from 'moment'
import axios from 'axios'
import { logInfo } from '@/functions/logging'
import { base64ToHex, hexToBase64 } from '@/functions/helper'

export interface iCertificate {
  readonly id: string
  readonly value: string
  readonly version: number
  readonly thumbprint: string
  readonly subjectName: string
  readonly serialNumber: string
  readonly issuerName: string
  readonly validFromDate: string
  readonly validToDate: string
  readonly algoOid?: string
}

export interface iSignCreateResult {
  result: boolean,
  message: any
}

const errorText = `
Проверьте корректность установленного ПО для ЭЦП и срок действия Вашего сертификата для подписи!&nbsp;
<a href="https://www.cryptopro.ru/" target="_blank"></a>
`

/**
 * Класс для работы с КриптоПро
 */
export default class DigitalSignature {
  private static extract (_from: string, what: string): string {
    let certName = ''
    const begin = _from.indexOf(what)
    if (begin >= 0) {
      const end = _from.indexOf(', ', begin)
      certName = (end < 0)
        ? _from.substr(begin)
        : _from.substr(begin, end - begin)
    }
    return certName
  }
  private static getCertName (certSubjectName: string): string {
    return DigitalSignature.extract(certSubjectName, 'CN=')
  }
  public static get presignUrl (): string {
    return 'https://justsign.me/domrulite/rest/api/signatures/presign'
  }
  public static get postsignUrl (): string {
    return 'https://justsign.me/domrulite/rest/api/signatures/postsign'
  }

  /**
   * Есть ли возможность подключить асинхронную версию плагина
   * @param {CADESPlugin} cadesplugin
   */
  public static canAsync (cadesplugin: CADESPlugin): boolean {
    return !!(cadesplugin as CADESPluginAsync).CreateObjectAsync
  }

  /**
   * Асинхронное получение списка сертификатов
   * @param {CADESPluginAsync} cadesplugin
   * @return {Promise<boolean | Array<{ id: string, value: string, version: number, thumbprint: string, subjectName: string, serialNumber: string, issuerName: string, validFromDate: string, validToDate: string }>>}
   */
  public static async getCertificatesList (cadesplugin: CADESPluginAsync): Promise<iCertificate[]> {
    if (!cadesplugin || !cadesplugin.CreateObjectAsync) {
      throw new Error('Для подписания ЭЦП установите плагин Крипто ПРО')
    }
    let store
    try {
      store = await cadesplugin.CreateObjectAsync('CAPICOM.Store')

      await store.Open(
        cadesplugin.CAPICOM_CURRENT_USER_STORE,
        cadesplugin.CAPICOM_MY_STORE,
        cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
      )
    } catch (ex) {
      throw new Error(cadesplugin.getLastError(ex))
    }

    const certificates = await store.Certificates
    const certCount = await certificates.Count

    if (certCount === 0) {
      throw new Error('Сертификаты не найдены')
    }

    const result: iCertificate[] = []
    const today = new Date()

    for (let i = 1; i <= certCount; i++) {
      try {
        const certificate = await certificates.Item(i)
        const publicKey = await certificate.PublicKey()
        const algorithm = await publicKey.Algorithm
        const algoOid = await algorithm.Value
        const validFromDate = new Date(await certificate.ValidFromDate)
        const subjectName = DigitalSignature.getCertName(await certificate.SubjectName)
        const otherData = {
          issuerName: await certificate.IssuerName,
          serialNumber: await certificate.SerialNumber,
          subjectName,
          thumbprint: await certificate.Thumbprint,
          validFromDate: (await certificate.ValidFromDate).toString(),
          validToDate: (await certificate.ValidToDate).toString(),
          version: await certificate.Version,
          algoOid
        }
        // Не показываем сертификаты, которые уже просрочены
        if (today < new Date(otherData.validToDate)) {
          result.push({
            id: subjectName.replace('CN=', ''),
            value: `${subjectName}; Выдан: ${moment(validFromDate).format('LL')}`,
            ...otherData
          })
        }
      } catch (ex) {
        throw new Error(cadesplugin.getLastError(ex))
      }
    }

    await store.Close()

    return result
  }

  /**
   * Синхронное получение списка сертификатов
   * @param {CADESPluginSync} cadesplugin
   * @return {boolean | Array<{ id: string, value: string, version: number, thumbprint: string, subjectName: string, serialNumber: string, issuerName: string, validFromDate: string, validToDate: string }>}
   */
  public static getCertificatesListSync (cadesplugin: CADESPluginSync): boolean | iCertificate[] {
    const store = cadesplugin.CreateObject('CAPICOM.Store')
    store.Open(
      cadesplugin.CAPICOM_CURRENT_USER_STORE,
      cadesplugin.CAPICOM_MY_STORE,
      cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
    )
    const certificates = store.Certificates
    const certCount = certificates.Count
    if (certCount === 0) {
      return false
    }

    const result: iCertificate[] = []
    const today = new Date()

    for (let i = 1; i <= certCount; i++) {
      const certificate = certificates.Item(i)
      const validFromDate = new Date(certificate.ValidFromDate)
      const subjectName = DigitalSignature.getCertName(certificate.SubjectName)
      const otherData = {
        issuerName: certificate.IssuerName,
        serialNumber: certificate.SerialNumber,
        subjectName,
        thumbprint: certificate.Thumbprint,
        validFromDate: certificate.ValidFromDate.toString(),
        validToDate: certificate.ValidToDate.toString(),
        version: certificate.Version
      }
      // Не показываем сертификаты, которые уже просрочены
      if (today < new Date(otherData.validToDate)) {
        result.push({
          id: subjectName.replace('CN=', ''),
          value: `${subjectName}; Выдан: ${moment(validFromDate).format('LL')}`,
          ...otherData
        })
      }
    }
    return result
  }

  /**
   * Создание подписи
   * @param {CADESPluginAsync} cadesplugin
   * @param {string} thumbprint
   * @param {string} dataToSign
   * @return {Promise<{result: boolean, message: string}>}
   */
  public static async signCreate (
    cadesplugin: CADESPluginAsync,
    thumbprint: string,
    dataToSign: string
  ): Promise<iSignCreateResult> {
    let store
    try {
      store = await cadesplugin.CreateObjectAsync('CAPICOM.Store')
      await store.Open(
        cadesplugin.CAPICOM_CURRENT_USER_STORE,
        cadesplugin.CAPICOM_MY_STORE,
        cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
      )
    } catch (ex) {
      throw new Error(cadesplugin.getLastError(ex))
    }
    const certificates = await store.Certificates
    const result = await certificates.Find(cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
    if (await result.Count < 1) {
      throw new Error('Certificate not found')
    }
    const certificate = await result.Item(1)
    const signer = await cadesplugin.CreateObjectAsync('CAdESCOM.CPSigner')
    await signer.propset_Certificate(certificate)
    const signedData = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData')
    await signedData.propset_Content(dataToSign)
    let signedMessage = ''
    try {
      signedMessage = await signedData.SignCades(signer, cadesplugin.CADESCOM_CADES_BES)
    } catch (error) {
      logInfo('Error')
      throw new Error(cadesplugin.getLastError(error))
    }
    await store.Close()
    return {
      result: true,
      message: signedMessage
    }
  }

  public static async hashSignCreate (
    cadesplugin: CADESPluginAsync,
    thumbprint: string,
    hash: CAdESCOM.CPHashedDataAsync
  ) {
    let store
    try {
      store = await cadesplugin.CreateObjectAsync('CAPICOM.Store')
      await store.Open(
        cadesplugin.CAPICOM_CURRENT_USER_STORE,
        cadesplugin.CAPICOM_MY_STORE,
        cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
      )
    } catch (ex) {
      throw new Error(cadesplugin.getLastError(ex))
    }
    const certificates = await store.Certificates
    const result = await certificates.Find(cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
    if (await result.Count < 1) {
      throw new Error('Certificate not found')
    }
    const certificate = await result.Item(1)
    const rawSignature = await cadesplugin.CreateObjectAsync('CAdESCOM.RawSignature')
    let signedMessage = ''
    try {
      // @ts-ignore
      signedMessage = await rawSignature.SignHash(hash, certificate)
    } catch (e) {
      throw new Error(cadesplugin.getLastError(e))
    }
    await store.Close()
    return {
      result: true,
      message: signedMessage
    }
  }

  /**
   * Синхронное создание подписи
   * @param {CADESPluginSync} cadesplugin
   * @param {string} thumbprint
   * @param {string} dataToSign
   * @return {{result: boolean, message: string}}
   */
  public static signCreateSync (cadesplugin: CADESPluginSync, thumbprint: string, dataToSign: string): iSignCreateResult {
    const store = cadesplugin.CreateObject('CAPICOM.Store')
    store.Open(
      cadesplugin.CAPICOM_CURRENT_USER_STORE,
      cadesplugin.CAPICOM_MY_STORE,
      cadesplugin.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
    )
    const certificates = store.Certificates
    const result = certificates.Find(cadesplugin.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint)
    if (result.Count < 1) {
      return {
        result: false,
        message: 'Не найдены сертификаты'
      }
    }
    const certificate = result.Item(1)
    const signer = cadesplugin.CreateObject('CAdESCOM.CPSigner')
    signer.Certificate = certificate
    const signedData = cadesplugin.CreateObject('CAdESCOM.CadesSignedData')
    signedData.ContentEncoding = cadesplugin.CADESCOM_BASE64_TO_BINARY
    signedData.Content = dataToSign
    let signedMessage = ''
    try {
      signedMessage = signedData.SignCades(signer, cadesplugin.CADESCOM_CADES_BES, true)
    } catch (error) {
      return {
        result: false,
        message: cadesplugin.getLastError(error)
      }
    }
    store.Close()
    return {
      result: true,
      message: signedMessage
    }
  }

  /**
   * Проверка подписи
   * @param {CADESPluginAsync} cadesplugin
   * @param {string} signature
   * @param {string} origData
   * @return {Promise<boolean>}
   */
  public static async signVerify (cadesplugin: CADESPluginAsync, signature: string, origData: string): Promise<boolean> {
    const data = await cadesplugin.CreateObjectAsync('CAdESCOM.CadesSignedData')
    try {
      await data.propset_ContentEncoding(cadesplugin.CADESCOM_BASE64_TO_BINARY)
      await data.propset_Content(origData)
      await data.VerifyCades(signature, cadesplugin.CADESCOM_CADES_BES, true)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Синхронная проверка подписи
   * @param {CADESPluginSync} cadesplugin
   * @param {string} signature
   * @param {string} origData
   */
  public static signVerifySync (cadesplugin: CADESPluginSync, signature: string, origData: string): boolean {
    const data = cadesplugin.CreateObject('CAdESCOM.CadesSignedData')
    try {
      data.ContentEncoding = cadesplugin.CADESCOM_BASE64_TO_BINARY
      data.Content = origData
      data.VerifyCades(signature, cadesplugin.CADESCOM_CADES_BES, true)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Запрос к presign
   * @param {string} document
   * @param {string} rawCertificate
   * @param {string} visibleSignature
   * @return {Promise<{CacheObjectId: string, HashValue: string}>}
   */
  public static async requestToPresign (document: string, rawCertificate: string, visibleSignature: string) {
    const requestData = {
      Document: document,
      RawCertificate: rawCertificate,
      SignatureType: 'PDF',
      SignatureParams: {
        PDFFormat: 'CMS',
        PDFReason: '',
        PDFLocation: '',
        PdfSignatureAppearance: visibleSignature,
        PdfSignatureTemplateId: 1
      }
    }
    let result
    try {
      result = await axios.post(this.presignUrl, requestData)
    } catch (ex) {
      throw new Error(errorText)
    }
    return {
      CacheObjectId: result.data['СacheObjectId'] || result.data.CacheObjectId,
      HashValue: result.data.HashValue
    }
  }

  /**
   * Запрос к postsign
   * @param {string} signedHashValue
   * @param {string} signatureValue
   * @param {string} cacheObjectId
   * @param {string} visibleSignature
   * @return {Promise<string>}
   */
  public static async requestToPostsign (
    signedHashValue: string,
    signatureValue: string,
    cacheObjectId: string,
    visibleSignature: string) {
    const requestData = {
      SignedHashValue: signedHashValue,
      SignatureValue: signatureValue,
      SignatureType: 'PDF',
      CacheObjectId: cacheObjectId,
      SignatureParams: {
        PDFFormat: 'CMS',
        PDFReason: '',
        PDFLocation: '',
        PdfSignatureAppearance: visibleSignature,
        PdfSignatureTemplateId: 1
      }
    }
    let result
    try {
      result = await axios.post(this.postsignUrl, requestData)
    } catch (ex) {
      throw new Error(errorText)
    }
    return result.data
  }

  /**
   * Создание видимой подписи
   * @param {string} name
   * @param {{ id: string, value: string, version: number, thumbprint: string, subjectName: string, serialNumber: string, issuerName: string, validFromDate: string, validToDate: string }} certificate
   * @return {string}
   */
  public static createVisibleSignature (name: string, certificate: iCertificate) {
    const blueColor = { Red: 0, Green: 0, Blue: 255 }
    const standartStylesForFont = {
      FontSize: 8,
      FontFamily: 'arial',
      FontStyle: 0,
      FontColor: blueColor
    }
    const subjectName = certificate.subjectName.slice(3)
    const issuerName = certificate?.issuerName?.split(',')?.find((item: string) => ~item.indexOf('CN'))?.slice(3)
    const dateFrom = moment(certificate.validFromDate).format('LL')
    const dateTo = moment(certificate.validToDate).format('LL')
    const jsonUnserialize = {
      Content: [
        {
          Text: 'Документ подписан электронной подписью',
          Font: standartStylesForFont
        },
        {
          Text: name.toUpperCase(),
          Font: standartStylesForFont
        },
        {
          Text: 'Сведения о сертификате ЭЦП:'.toUpperCase(),
          Font: standartStylesForFont
        },
        {
          Text: `Кому выдан: ${subjectName.toUpperCase()}`,
          Font: standartStylesForFont
        },
        {
          Text: `Кем выдан: ${issuerName?.toUpperCase()}`,
          Font: standartStylesForFont
        },
        {
          Text: `Действителен: с ${dateFrom} по ${dateTo}`,
          Font: standartStylesForFont
        }
      ],
      TemplateId: 1,
      Page: 1,
      Rect: {
        LowerLeftX: 10,
        LowerLeftY: 10,
        UpperRightX: 280,
        UpperRightY: 95,
        BorderRadius: 0,
        BorderWeight: 1,
        BorderColor: blueColor,
        BackgroundColor: null,
        ContentMargin: 5
      }
    }
    const jsonSerialize = JSON.stringify(jsonUnserialize)
    return btoa(unescape(encodeURIComponent(jsonSerialize)))
  }

  public static async initializeHashedData (
    cadesplugin: CADESPluginAsync,
    certificate: iCertificate,
    hashValue: string
  ) {
    let hashAlgorithm: number | undefined
    if (certificate.algoOid === '1.2.643.7.1.1.1.1') { // алгоритм подписи ГОСТ Р 34.10-2012 с ключом 256 бит
      hashAlgorithm = cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256
    } else if (certificate.algoOid === '1.2.643.7.1.1.1.2') {
      hashAlgorithm = cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512
    } else if (certificate.algoOid === '1.2.643.2.2.19') {
      hashAlgorithm = cadesplugin.CADESCOM_HASH_ALGORITHM_CP_GOST_3411
    }
    if (!hashAlgorithm) {
      logInfo(`Сообщите это значение программисту: ${certificate.algoOid}`)
      throw new Error('Неизвестный алгоритм подписи сертификата')
    }
    let hashedData
    const hexHashValue = base64ToHex(hashValue)
    console.log(hexHashValue, hashValue)
    try {
      hashedData = await cadesplugin.CreateObjectAsync('CAdESCOM.HashedData')
      await hashedData.propset_Algorithm(hashAlgorithm)
      await hashedData.SetHashValue(hexHashValue)
    } catch (ex) {
      logInfo(ex)
    }

    const result = await hashedData
    return result
  }

  /**
   * Подписание документа
   * @param {CADESPlugin | CADESPluginAsync | CADESPluginSync} cadesplugin
   * @param {string} document
   * @param {{ id: string, value: string, version: number, thumbprint: string, subjectName: string, serialNumber: string, issuerName: string, validFromDate: string, validToDate: string }} certificate
   * @param {string} visibleSignature
   */
  public static async signDocument (
    cadesplugin: CADESPlugin | CADESPluginAsync | CADESPluginSync,
    document: string,
    certificate: iCertificate,
    visibleSignature: string
  ) {
    if (!DigitalSignature.canAsync(cadesplugin)) {
      throw new Error('Browser not supported Promises')
    }
    try {
      const resultSignCreate = await DigitalSignature
        .signCreate(cadesplugin as CADESPluginAsync, certificate.thumbprint, document)
      const resultPresign = await DigitalSignature
        .requestToPresign(document, resultSignCreate.message, visibleSignature)
      if (!resultPresign.CacheObjectId || !resultPresign.HashValue) {
        throw new Error('Undefined CacheObjectId and HashValue')
      }
      const hash = await DigitalSignature.initializeHashedData(
        cadesplugin as CADESPluginAsync,
        certificate,
        resultPresign.HashValue
      )
      const hashValue = await hash!
      const resultSignCreateSecond = await DigitalSignature
        .hashSignCreate(cadesplugin as CADESPluginAsync, certificate.thumbprint, hashValue)
      const base64ResultSignCreateSecond = hexToBase64(resultSignCreateSecond.message)
      const result = await DigitalSignature
        .requestToPostsign(resultPresign.HashValue, base64ResultSignCreateSecond, resultPresign.CacheObjectId, visibleSignature)
      return result
    } catch (ex) {
      throw new Error(ex.message)
    }
  }
}
