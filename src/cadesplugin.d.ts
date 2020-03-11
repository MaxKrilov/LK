/**
 * https://github.com/kmvi/cadesplugin
 */
/* eslint-disable */
declare namespace CAdESCOM {
  interface CPSigner {
    Display(hwndParent?: number, title?: string): void;
    Load(fileName: string, password?: string): void;
    //AuthenticatedAttributes
    //AuthenticatedAttributes2
    Certificate: CAPICOM.ICertificate;
    //Chain
    CheckCertificate: boolean;
    //CRLs;
    KeyPin: string;
    //OCSPResponses
    Options: CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_OPTION;
    //SignatureStatus
    readonly SignatureTimeStampTime: VarDate;
    readonly SigningTime: VarDate;
    TSAAddress: string;
    //UnauthenticatedAttributes
  }

  interface CadesSignedData {
    Display(hwndParent?: number, title?: string): void;
    EnhanceCades(cadesType?: CADESCOM_CADES_TYPE, TSAAddress?: string, encodingType?: CAPICOM.CAPICOM_ENCODING_TYPE): string;
    //Sign
    SignCades(signer?: CPSigner, CadesType?: CADESCOM_CADES_TYPE, bDetached?: boolean, EncodingType?: CAPICOM.CAPICOM_ENCODING_TYPE): string;
    //SignHash
    //Verify
    VerifyCades(SignedMessage: string, CadesType?: CADESCOM_CADES_TYPE, bDetached?: boolean): void;
    //VerifyHash
    readonly Certificates: CAPICOM.ICertificates;
    Content: string;
    ContentEncoding: CADESCOM_CONTENT_ENCODING_TYPE;
    DisplayData: CADESCOM_DISPLAY_DATA;
    //Signers
  }

  interface Version {
    toString(): string;
    readonly BuildVersion: number;
    readonly MajorVersion: number;
    readonly MinorVersion: number;
    readonly toStringDefault: string;
  }

  interface About {
    CSPName(ProviderType?: number): string;
    CSPVersion(ProviderName?: string, ProviderType?: number): Version;
    ProviderVersion(ProviderName?: string, ProviderType?: number): string;
    readonly BuildVersion: number;
    readonly MajorVersion: number;
    readonly MinorVersion: number;
    readonly PluginVersion: Version;
    readonly Version: string;
  }

  interface CPSigners {
    readonly Count: number;
    Item(index: number): CPSigner;
  }

  interface SignedXML {
    Sign(signer?: CPSigner, XPath?: string): string;
    Verify(SignedMessage: string, XPath?: string): void;
    Content: string;
    DigestMethod: string;
    SignatureMethod: string;
    SignatureType: CADESCOM_XML_SIGNATURE_TYPE;
    readonly Signers: CAPICOM.Signers;
  }

  interface CPHashedData {
    Hash(newVal: string): void;
    SetHashValue(newVal: string): void;
    Algorithm: CAPICOM.CAPICOM_HASH_ALGORITHM;
    DataEncoding: CADESCOM_CONTENT_ENCODING_TYPE;
    Value: string;
  }

  interface CPAttribute {
    Name: CADESCOM_ATTRIBUTE;
    //OID: CAPICOM.IOID>;
    Value: any;
    ValueEncoding: CAPICOM.CAPICOM_ENCODING_TYPE;
  }

  interface RawSignature {
    SignHash(hash: CPHashedData, certificate?: string): string;
    VerifyHash(hash: CPHashedData, certificate: CAPICOM.ICertificate, signature: string): void;
  }

  interface CPSignerAsync {
    readonly Certificate: Promise<CAPICOM.ICertificateAsync>;
    propset_Certificate(certificate: CAPICOM.ICertificateAsync): Promise<void>;
    Display(hwndParent?: number, title?: string): Promise<void>;
    Load(fileName: string, password?: string): Promise<void>;
    //AuthenticatedAttributes
    //AuthenticatedAttributes2
    //Chain
    readonly CheckCertificate: Promise<boolean>;
    propset_CheckCertificate(checkCertificate: boolean): Promise<void>;
    //CRLs;
    readonly KeyPin: Promise<string>;
    propset_KeyPin(keyPin: string): Promise<void>
    //OCSPResponses
    readonly Options: Promise<CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_OPTION>;
    propset_Options(options: CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_OPTION): Promise<void>
    //SignatureStatus
    readonly SignatureTimeStampTime: Promise<VarDate>;
    readonly SigningTime: Promise<VarDate>;
    readonly TSAAddress: Promise<string>;
    propset_TSAAddress(TSAAddress: string): Promise<void>;
    //UnauthenticatedAttributes
  }

  interface CadesSignedDataAsync {
    Display(hwndParent?: number, title?: string): Promise<void>;
    EnhanceCades(cadesType?: CADESCOM_CADES_TYPE, TSAAddress?: string, encodingType?: CAPICOM.CAPICOM_ENCODING_TYPE): Promise<string>;
    //Sign
    //SignHash
    //Verify
    //VerifyHash
    readonly Certificates: Promise<CAPICOM.ICertificates>;
    readonly DisplayData: Promise<CADESCOM_DISPLAY_DATA>;
    propset_DisplayData(displayData: CADESCOM_DISPLAY_DATA): Promise<void>;
    //Signers
    readonly Content: Promise<string>;
    propset_Content(content: string): Promise<void>;
    readonly ContentEncoding: Promise<CADESCOM_CONTENT_ENCODING_TYPE>;
    propset_ContentEncoding(contentEncoding: CADESCOM_CONTENT_ENCODING_TYPE): Promise<void>;
    SignCades(signer?: CPSignerAsync, CadesType?: CADESCOM_CADES_TYPE, bDetached?: boolean, EncodingType?: CAPICOM.CAPICOM_ENCODING_TYPE): Promise<string>
    VerifyCades(SignedMessage: string, CadesType?: CADESCOM_CADES_TYPE, bDetached?: boolean): Promise<void>;
  }

  interface VersionAsync {
    toString(): Promise<string>;
    readonly BuildVersion: Promise<number>;
    readonly MajorVersion: Promise<number>;
    readonly MinorVersion: Promise<number>;
    readonly toStringDefault: Promise<string>;
  }

  interface AboutAsync {
    CSPName(ProviderType?: number): Promise<string>;
    CSPVersion(ProviderName?: string, ProviderType?: number): Promise<VersionAsync>;
    ProviderVersion(ProviderName?: string, ProviderType?: number): Promise<string>;
    readonly BuildVersion: Promise<number>;
    readonly MajorVersion: Promise<number>;
    readonly MinorVersion: Promise<number>;
    readonly PluginVersion: Promise<VersionAsync>;
    readonly Version: Promise<string>;
  }

  interface SignersAsync {
    readonly Count: Promise<number>;
    Item(index: number): Promise<CPSigner>;
  }

  interface SignedXMLAsync {
    Sign(signer?: CPSignerAsync, XPath?: string): Promise<string>;
    Verify(SignedMessage: string, XPath?: string): Promise<void>;
    readonly Content: Promise<string>;
    propset_Content(content: string): Promise<void>;
    readonly DigestMethod: Promise<string>;
    propset_DigestMethod(digestMethod: string): Promise<void>;
    readonly SignatureMethod: Promise<string>;
    propset_SignatureMethod(signatureMethod: string): Promise<void>;
    readonly SignatureType: Promise<CADESCOM_XML_SIGNATURE_TYPE>;
    propset_SignatureType(signatureType: CADESCOM_XML_SIGNATURE_TYPE): Promise<void>;
    readonly Signers: Promise<SignersAsync>;
  }

  interface CPHashedDataAsync {
    Hash(newVal: string): Promise<void>;
    SetHashValue(newVal: string): Promise<void>;
    readonly Algorithm: Promise<CAPICOM.CAPICOM_HASH_ALGORITHM>;
    propset_Algorithm(algorithm: CAPICOM.CAPICOM_HASH_ALGORITHM): Promise<void>;
    readonly DataEncoding: Promise<CADESCOM_CONTENT_ENCODING_TYPE>;
    propset_DataEncoding(dataEncoding: CADESCOM_CONTENT_ENCODING_TYPE): Promise<void>;
    readonly Value: Promise<string>;
  }

  interface CPAttributeAsync {
    readonly Name: Promise<CADESCOM_ATTRIBUTE>;
    propset_Name(name: CADESCOM_ATTRIBUTE): Promise<void>;
    //OID: CAPICOM.IOID>;
    readonly Value: Promise<any>;
    propset_Value(value: any): Promise<void>;
    readonly ValueEncoding: Promise<CAPICOM.CAPICOM_ENCODING_TYPE>;
    propset_ValueEncoding(valueEncoding: CAPICOM.CAPICOM_ENCODING_TYPE): Promise<void>;
  }

  interface RawSignatureAsync {
    SignHash(hash: CPHashedDataAsync, certificate?: string): Promise<string>;
    VerifyHash(hash: CPHashedDataAsync, certificate: CAPICOM.ICertificateAsync, signature: string): Promise<void>;
  }

  type StoreLocationPluginNames =
    'CADESCOM_LOCAL_MACHINE_STORE'
    | 'CADESCOM_CURRENT_USER_STORE'
    | 'CADESCOM_CONTAINER_STORE';

  const enum CADESCOM_STORE_LOCATION {
    CADESCOM_MEMORY_STORE = 0,
    CADESCOM_LOCAL_MACHINE_STORE = 1,
    CADESCOM_CURRENT_USER_STORE = 2,
    CADESCOM_CONTAINER_STORE = 100,
    CADESCOM_ACTIVE_DIRECTORY_USER_STORE = 3,
    CADESCOM_SMART_CARD_USER_STORE = 4,
  }

  const enum CADESCOM_CADES_TYPE {
    CADESCOM_CADES_BES = 1,
    CADESCOM_CADES_DEFAULT = 0,
    CADESCOM_CADES_T = 5,
    CADESCOM_CADES_X_LONG_TYPE_1 = 93,
  }

  const enum CADESCOM_CONTENT_ENCODING_TYPE {
    CADESCOM_BASE64_TO_BINARY = 1,
    CADESCOM_STRING_TO_UCS2LE = 0,
  }

  const enum CADESCOM_XML_SIGNATURE_TYPE {
    CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = 0,
    CADESCOM_XML_SIGNATURE_TYPE_ENVELOPING = 1,
    CADESCOM_XML_SIGNATURE_TYPE_TEMPLATE = 2,
  }

  const enum CADESCOM_ENCRYPTION_ALGORITHM {
    CADESCOM_ENCRYPTION_ALGORITHM_RC2 = 0,
    CADESCOM_ENCRYPTION_ALGORITHM_RC4 = 1,
    CADESCOM_ENCRYPTION_ALGORITHM_DES = 2,
    CADESCOM_ENCRYPTION_ALGORITHM_3DES = 3,
    CADESCOM_ENCRYPTION_ALGORITHM_AES = 4,
    CADESCOM_ENCRYPTION_ALGORITHM_GOST_28147_89 = 25,
  }

  const enum CADESCOM_HASH_ALGORITHM {
    CADESCOM_HASH_ALGORITHM_SHA1 = 0,
    CADESCOM_HASH_ALGORITHM_MD2 = 1,
    CADESCOM_HASH_ALGORITHM_MD4 = 2,
    CADESCOM_HASH_ALGORITHM_MD5 = 3,
    CADESCOM_HASH_ALGORITHM_SHA_256 = 4,
    CADESCOM_HASH_ALGORITHM_SHA_384 = 5,
    CADESCOM_HASH_ALGORITHM_SHA_512 = 6,
    CADESCOM_HASH_ALGORITHM_CP_GOST_3411 = 100,
    CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256 = 101,
    CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512 = 102,
  }

  const enum CADESCOM_ATTRIBUTE {
    CADESCOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0,
    CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME = 1,
    CADESCOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION = 2,
    CADESCOM_ATTRIBUTE_OTHER = -1,
  }

  const enum CADESCOM_DISPLAY_DATA {
    CADESCOM_DISPLAY_DATA_NONE = 0,
    CADESCOM_DISPLAY_DATA_CONTENT = 1,
    CADESCOM_DISPLAY_DATA_ATTRIBUTE = 2,
  }

  const enum CADESCOM_InstallResponseRestrictionFlags {
    CADESCOM_AllowNone = 0,
    CADESCOM_AllowNoOutstandingRequest = 1,
    CADESCOM_AllowUntrustedCertificate = 2,
    CADESCOM_AllowUntrustedRoot = 4,
    CADESCOM_SkipInstallToStore = 0x10000000,
  }
}

declare namespace CADES_Plugin {
  interface ObjectNames {
    'CAPICOM.Store': CAPICOM.Store;
    'CAdESCOM.CPSigner': CAdESCOM.CPSigner;
    'CAdESCOM.About': CAdESCOM.About;
    'CAdESCOM.SignedXML': CAdESCOM.SignedXML;
    'CAdESCOM.HashedData': CAdESCOM.CPHashedData;
    'CAdESCOM.CadesSignedData': CAdESCOM.CadesSignedData;
    'CAdESCOM.CPAttribute': CAdESCOM.CPAttribute;
    'CAdESCOM.RawSignature': CAdESCOM.RawSignature;
  }

  interface ObjectNamesAsync {
    'CAPICOM.Store': CAPICOM.StoreAsync;
    'CAdESCOM.CPSigner': CAdESCOM.CPSignerAsync;
    'CAdESCOM.About': CAdESCOM.AboutAsync;
    'CAdESCOM.SignedXML': CAdESCOM.SignedXMLAsync;
    'CAdESCOM.HashedData': CAdESCOM.CPHashedDataAsync;
    'CAdESCOM.CadesSignedData': CAdESCOM.CadesSignedDataAsync;
    'CAdESCOM.CPAttribute': CAdESCOM.CPAttributeAsync;
    'CAdESCOM.RawSignature': CAdESCOM.RawSignatureAsync;
  }

  const enum LogLevel {
    LOG_LEVEL_DEBUG = 4,
    LOG_LEVEL_INFO = 2,
    LOG_LEVEL_ERROR = 1,
  }

  const enum ISignedXmlUrls {
    XmlDsigGost3410Url = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr34102001-gostr3411",
    XmlDsigGost3410UrlObsolete = "http://www.w3.org/2001/04/xmldsig-more#gostr34102001-gostr3411",
    XmlDsigGost3411Url = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:gostr3411",
    XmlDsigGost3411UrlObsolete = "http://www.w3.org/2001/04/xmldsig-more#gostr3411",
  }

  const enum IEncodingType {
    CADESCOM_ENCODE_ANY = -1,
    CADESCOM_ENCODE_BASE64 = 0,
    CADESCOM_ENCODE_BINARY = 1,
  }
}

type _CADESPluginBase = Promise<never>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_STORE_LOCATION, CAPICOM.StoreLocationPluginNames>>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_STORE_NAME, CAPICOM.StoreNamePluginNames>>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_STORE_OPEN_MODE, CAPICOM.StoreOpenModePluginNames>>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_CERT_INFO_TYPE, CAPICOM.CertIntoTypePluginNames>>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_KEY_USAGE, CAPICOM.KeyUsagePluginNames>>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_PROPID, CAPICOM.PropIDPluginNames>>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_OID, CAPICOM.OIDPluginNames>>
  & Readonly<Pick<typeof CAPICOM.CAPICOM_EKU, CAPICOM.EKUPluginNames>>
  & Readonly<Pick<typeof CAdESCOM.CADESCOM_STORE_LOCATION, CAdESCOM.StoreLocationPluginNames>>
  & Readonly<typeof CAPICOM.CAPICOM_CERTIFICATE_FIND_TYPE>
  & Readonly<typeof CAPICOM.CAPICOM_CERTIFICATE_INCLUDE_OPTION>
  & Readonly<typeof CAPICOM.CAPICOM_ATTRIBUTE>
  & Readonly<typeof CAdESCOM.CADESCOM_CADES_TYPE>
  & Readonly<typeof CAdESCOM.CADESCOM_XML_SIGNATURE_TYPE>
  & Readonly<typeof CAdESCOM.CADESCOM_ATTRIBUTE>
  & Readonly<typeof CAdESCOM.CADESCOM_CONTENT_ENCODING_TYPE>
  & Readonly<typeof CAdESCOM.CADESCOM_DISPLAY_DATA>
  & Readonly<typeof CAdESCOM.CADESCOM_ENCRYPTION_ALGORITHM>
  & Readonly<typeof CAdESCOM.CADESCOM_HASH_ALGORITHM>
  & Readonly<typeof CAdESCOM.CADESCOM_InstallResponseRestrictionFlags>
  & Readonly<typeof CADES_Plugin.LogLevel>
  & Readonly<typeof CADES_Plugin.ISignedXmlUrls>
  & Readonly<typeof CADES_Plugin.IEncodingType>;

interface CADESPluginBase extends _CADESPluginBase {
  readonly JSModuleVersion: string;
  readonly current_log_level: number;
  async_spawn<T>(generatorFun: (...args: any[]) => Iterator<T>): T;
  set(obj: CADESPluginBase): void;
  set_log_level(level: CADES_Plugin.LogLevel): void;
  getLastError(exception: Error): string;
  is_capilite_enabled(): boolean;
}

interface CADESPluginAsync extends CADESPluginBase {
  CreateObjectAsync<T extends keyof CADES_Plugin.ObjectNamesAsync>(objname: T): Promise<CADES_Plugin.ObjectNamesAsync[T]>;
  ReleasePluginObjects(): Promise<boolean>;
}

interface CADESPluginSync extends CADESPluginBase {
  CreateObject<T extends keyof CADES_Plugin.ObjectNames>(objname: T): CADES_Plugin.ObjectNames[T];
}

type CADESPlugin = CADESPluginAsync | CADESPluginSync;

declare const cadesplugin: CADESPlugin;

declare namespace CAPICOM {
  interface ICertificate {
    readonly Version: number;
    readonly Thumbprint: string;
    readonly SubjectName: string;
    readonly SerialNumber: string;
    readonly IssuerName: string;
    readonly ValidFromDate: VarDate;
    readonly ValidToDate: VarDate;
    HasPrivateKey(): boolean;
    // GetInfo(infoType: CAPICOM_CERT_INFO_TYPE): string;
    IsValid(): ICertificateStatus;
    Display(): void;
  }

  interface ICertificateStatus {
    // TODO
  }

  interface ICertificates {
    readonly Count: number;
    Item(index: number): ICertificate;
    Find(findType: CAPICOM_CERTIFICATE_FIND_TYPE, varCriteria?: any, bFindValidOnly?: boolean): ICertificates;
    Select(title?: string, displayString?: string, bMultiSelect?: boolean): ICertificates;
  }

  interface Store {
    Open(location?: CAPICOM_STORE_LOCATION, name?: CAPICOM_STORE_NAME, openMode?: CAPICOM_STORE_OPEN_MODE): void;
    Close(): void;
    Delete(): boolean;
    Import(encodedStore: string): void;
    readonly Certificates: ICertificates;
    readonly Location: CAPICOM_STORE_LOCATION;
    readonly Name: string;
  }

  interface Signers {
    readonly Count: number;
    Item(index: number): Signer;
  }

  interface Signer {
    Load(fileName: string, password?: string): void;
    // readonly AuthenticatedAttributes
    Certificate: ICertificate;
    // Chain
    Options: CAPICOM_CERTIFICATE_INCLUDE_OPTION;
  }

  interface ICertificateAsync {
    readonly Version: number;
    readonly Thumbprint: string;
    readonly SubjectName: string;
    readonly SerialNumber: string;
    readonly IssuerName: string;
    readonly ValidFromDate: VarDate;
    readonly ValidToDate: VarDate;
    HasPrivateKey(): boolean;
    // GetInfo(infoType: CAPICOM_CERT_INFO_TYPE): string;
    IsValid(): ICertificateStatus;
    Display(): void;
  }

  interface ICertificatesAsync {
    readonly Count: Promise<number>;
    Item(index: number): Promise<ICertificateAsync>;
    Find(findType: CAPICOM_CERTIFICATE_FIND_TYPE, varCriteria?: any, bFindValidOnly?: boolean): Promise<ICertificatesAsync>;
  }

  interface StoreAsync {
    Open(location?: CAPICOM_STORE_LOCATION, name?: CAPICOM_STORE_NAME, openMode?: CAPICOM_STORE_OPEN_MODE): Promise<void>;
    Close(): Promise<void>;
    Delete(): Promise<boolean>;
    readonly Certificates: Promise<ICertificatesAsync>;
  }

  type StoreLocationPluginNames =
    'CAPICOM_LOCAL_MACHINE_STORE'
    | 'CAPICOM_CURRENT_USER_STORE';

  const enum CAPICOM_STORE_LOCATION {
    CAPICOM_MEMORY_STORE = 0,
    CAPICOM_LOCAL_MACHINE_STORE = 1,
    CAPICOM_CURRENT_USER_STORE = 2,
    CAPICOM_ACTIVE_DIRECTORY_USER_STORE = 3,
    CAPICOM_SMART_CARD_USER_STORE = 4,
  }

  type StoreNamePluginNames = 'CAPICOM_MY_STORE';

  const enum CAPICOM_STORE_NAME {
    CAPICOM_MY_STORE = 'My',
    CAPICOM_CA_STORE = 'Ca',
    CAPICOM_OTHER_STORE = 'AddressBook',
    CAPICOM_ROOT_STORE = 'Root',
  }

  type StoreOpenModePluginNames = 'CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED';

  const enum CAPICOM_STORE_OPEN_MODE {
    CAPICOM_STORE_OPEN_READ_ONLY = 0,
    CAPICOM_STORE_OPEN_READ_WRITE = 1,
    CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2,
    CAPICOM_STORE_OPEN_EXISTING_ONLY = 128,
    CAPICOM_STORE_OPEN_INCLUDE_ARCHIVED = 256,
  }

  const enum CAPICOM_CERTIFICATE_FIND_TYPE {
    CAPICOM_CERTIFICATE_FIND_SHA1_HASH = 0,
    CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1,
    CAPICOM_CERTIFICATE_FIND_ISSUER_NAME = 2,
    CAPICOM_CERTIFICATE_FIND_ROOT_NAME = 3,
    CAPICOM_CERTIFICATE_FIND_TEMPLATE_NAME = 4,
    CAPICOM_CERTIFICATE_FIND_EXTENSION = 5,
    CAPICOM_CERTIFICATE_FIND_EXTENDED_PROPERTY = 6,
    CAPICOM_CERTIFICATE_FIND_APPLICATION_POLICY = 7,
    CAPICOM_CERTIFICATE_FIND_CERTIFICATE_POLICY = 8,
    CAPICOM_CERTIFICATE_FIND_TIME_VALID = 9,
    CAPICOM_CERTIFICATE_FIND_TIME_NOT_YET_VALID = 10,
    CAPICOM_CERTIFICATE_FIND_TIME_EXPIRED = 11,
    CAPICOM_CERTIFICATE_FIND_KEY_USAGE = 12,
  }

  const enum CAPICOM_CERTIFICATE_INCLUDE_OPTION {
    CAPICOM_CERTIFICATE_INCLUDE_CHAIN_EXCEPT_ROOT = 0,
    CAPICOM_CERTIFICATE_INCLUDE_END_ENTITY_ONLY = 2,
    CAPICOM_CERTIFICATE_INCLUDE_WHOLE_CHAIN = 1,
  }

  type CertIntoTypePluginNames =
    'CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME'
    | 'CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME';

  const enum CAPICOM_CERT_INFO_TYPE {
    CAPICOM_CERT_INFO_SUBJECT_SIMPLE_NAME = 0,
    CAPICOM_CERT_INFO_ISSUER_SIMPLE_NAME = 1,
    CAPICOM_CERT_INFO_SUBJECT_EMAIL_NAME = 2,
    CAPICOM_CERT_INFO_ISSUER_EMAIL_NAME = 3,
    CAPICOM_CERT_INFO_SUBJECT_UPN = 4,
    CAPICOM_CERT_INFO_ISSUER_UPN = 5,
    CAPICOM_CERT_INFO_SUBJECT_DNS_NAME = 6,
    CAPICOM_CERT_INFO_ISSUER_DNS_NAME = 7,
  }

  type KeyUsagePluginNames = 'CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE';

  const enum CAPICOM_KEY_USAGE {
    CAPICOM_DIGITAL_SIGNATURE_KEY_USAGE = 128,
    CAPICOM_NON_REPUDIATION_KEY_USAGE = 64,
    CAPICOM_KEY_ENCIPHERMENT_KEY_USAGE = 32,
    CAPICOM_DATA_ENCIPHERMENT_KEY_USAGE = 16,
    CAPICOM_KEY_AGREEMENT_KEY_USAGE = 8,
    CAPICOM_KEY_CERT_SIGN_KEY_USAGE = 4,
    CAPICOM_OFFLINE_CRL_SIGN_KEY_USAGE = 2,
    CAPICOM_CRL_SIGN_KEY_USAGE = 2,
    CAPICOM_ENCIPHER_ONLY_KEY_USAGE = 1,
    CAPICOM_DECIPHER_ONLY_KEY_USAGE = 32768,
  }

  type PropIDPluginNames = 'CAPICOM_PROPID_ENHKEY_USAGE';

  const enum CAPICOM_PROPID {
    CAPICOM_PROPID_UNKNOWN = 0,
    CAPICOM_PROPID_KEY_PROV_HANDLE = 1,
    CAPICOM_PROPID_KEY_PROV_INFO = 2,
    CAPICOM_PROPID_SHA1_HASH = 3,
    CAPICOM_PROPID_HASH_PROP = 3,
    CAPICOM_PROPID_MD5_HASH = 4,
    CAPICOM_PROPID_KEY_CONTEXT = 5,
    CAPICOM_PROPID_KEY_SPEC = 6,
    CAPICOM_PROPID_IE30_RESERVED = 7,
    CAPICOM_PROPID_PUBKEY_HASH_RESERVED = 8,
    CAPICOM_PROPID_ENHKEY_USAGE = 9,
    CAPICOM_PROPID_CTL_USAGE = 9,
    CAPICOM_PROPID_NEXT_UPDATE_LOCATION = 10,
    CAPICOM_PROPID_FRIENDLY_NAME = 11,
    CAPICOM_PROPID_PVK_FILE = 12,
    CAPICOM_PROPID_DESCRIPTION = 13,
    CAPICOM_PROPID_ACCESS_STATE = 14,
    CAPICOM_PROPID_SIGNATURE_HASH = 15,
    CAPICOM_PROPID_SMART_CARD_DATA = 16,
    CAPICOM_PROPID_EFS = 17,
    CAPICOM_PROPID_FORTEZZA_DATA = 18,
    CAPICOM_PROPID_ARCHIVED = 19,
    CAPICOM_PROPID_KEY_IDENTIFIER = 20,
    CAPICOM_PROPID_AUTO_ENROLL = 21,
    CAPICOM_PROPID_PUBKEY_ALG_PARA = 22,
    CAPICOM_PROPID_CROSS_CERT_DIST_POINTS = 23,
    CAPICOM_PROPID_ISSUER_PUBLIC_KEY_MD5_HASH = 24,
    CAPICOM_PROPID_SUBJECT_PUBLIC_KEY_MD5_HASH = 25,
    CAPICOM_PROPID_ENROLLMENT = 26,
    CAPICOM_PROPID_DATE_STAMP = 27,
    CAPICOM_PROPID_ISSUER_SERIAL_NUMBER_MD5_HASH = 28,
    CAPICOM_PROPID_SUBJECT_NAME_MD5_HASH = 29,
    CAPICOM_PROPID_EXTENDED_ERROR_INFO = 30,
    CAPICOM_PROPID_RENEWAL = 64,
    CAPICOM_PROPID_ARCHIVED_KEY_HASH = 65,
    CAPICOM_PROPID_FIRST_RESERVED = 66,
    CAPICOM_PROPID_LAST_RESERVED = 32767,
    CAPICOM_PROPID_FIRST_USER = 32768,
    CAPICOM_PROPID_LAST_USER = 65535,
  }

  type OIDPluginNames =
    'CAPICOM_OID_OTHER'
    | 'CAPICOM_OID_KEY_USAGE_EXTENSION';

  const enum CAPICOM_OID {
    CAPICOM_OID_OTHER = 0,
    CAPICOM_OID_AUTHORITY_KEY_IDENTIFIER_EXTENSION = 1,
    CAPICOM_OID_KEY_ATTRIBUTES_EXTENSION = 2,
    CAPICOM_OID_CERT_POLICIES_95_EXTENSION = 3,
    CAPICOM_OID_KEY_USAGE_RESTRICTION_EXTENSION = 4,
    CAPICOM_OID_LEGACY_POLICY_MAPPINGS_EXTENSION = 5,
    CAPICOM_OID_SUBJECT_ALT_NAME_EXTENSION = 6,
    CAPICOM_OID_ISSUER_ALT_NAME_EXTENSION = 7,
    CAPICOM_OID_BASIC_CONSTRAINTS_EXTENSION = 8,
    CAPICOM_OID_SUBJECT_KEY_IDENTIFIER_EXTENSION = 9,
    CAPICOM_OID_KEY_USAGE_EXTENSION = 10,
    CAPICOM_OID_PRIVATEKEY_USAGE_PERIOD_EXTENSION = 11,
    CAPICOM_OID_SUBJECT_ALT_NAME2_EXTENSION = 12,
    CAPICOM_OID_ISSUER_ALT_NAME2_EXTENSION = 13,
    CAPICOM_OID_BASIC_CONSTRAINTS2_EXTENSION = 14,
    CAPICOM_OID_NAME_CONSTRAINTS_EXTENSION = 15,
    CAPICOM_OID_CRL_DIST_POINTS_EXTENSION = 16,
    CAPICOM_OID_CERT_POLICIES_EXTENSION = 17,
    CAPICOM_OID_POLICY_MAPPINGS_EXTENSION = 18,
    CAPICOM_OID_AUTHORITY_KEY_IDENTIFIER2_EXTENSION = 19,
    CAPICOM_OID_POLICY_CONSTRAINTS_EXTENSION = 20,
    CAPICOM_OID_ENHANCED_KEY_USAGE_EXTENSION = 21,
    CAPICOM_OID_CERTIFICATE_TEMPLATE_EXTENSION = 22,
    CAPICOM_OID_APPLICATION_CERT_POLICIES_EXTENSION = 23,
    CAPICOM_OID_APPLICATION_POLICY_MAPPINGS_EXTENSION = 24,
    CAPICOM_OID_APPLICATION_POLICY_CONSTRAINTS_EXTENSION = 25,
    CAPICOM_OID_AUTHORITY_INFO_ACCESS_EXTENSION = 26,
    CAPICOM_OID_SERVER_AUTH_EKU = 100,
    CAPICOM_OID_CLIENT_AUTH_EKU = 101,
    CAPICOM_OID_CODE_SIGNING_EKU = 102,
    CAPICOM_OID_EMAIL_PROTECTION_EKU = 103,
    CAPICOM_OID_IPSEC_END_SYSTEM_EKU = 104,
    CAPICOM_OID_IPSEC_TUNNEL_EKU = 105,
    CAPICOM_OID_IPSEC_USER_EKU = 106,
    CAPICOM_OID_TIME_STAMPING_EKU = 107,
    CAPICOM_OID_CTL_USAGE_SIGNING_EKU = 108,
    CAPICOM_OID_TIME_STAMP_SIGNING_EKU = 109,
    CAPICOM_OID_SERVER_GATED_CRYPTO_EKU = 110,
    CAPICOM_OID_ENCRYPTING_FILE_SYSTEM_EKU = 111,
    CAPICOM_OID_EFS_RECOVERY_EKU = 112,
    CAPICOM_OID_WHQL_CRYPTO_EKU = 113,
    CAPICOM_OID_NT5_CRYPTO_EKU = 114,
    CAPICOM_OID_OEM_WHQL_CRYPTO_EKU = 115,
    CAPICOM_OID_EMBEDED_NT_CRYPTO_EKU = 116,
    CAPICOM_OID_ROOT_LIST_SIGNER_EKU = 117,
    CAPICOM_OID_QUALIFIED_SUBORDINATION_EKU = 118,
    CAPICOM_OID_KEY_RECOVERY_EKU = 119,
    CAPICOM_OID_DIGITAL_RIGHTS_EKU = 120,
    CAPICOM_OID_LICENSES_EKU = 121,
    CAPICOM_OID_LICENSE_SERVER_EKU = 122,
    CAPICOM_OID_SMART_CARD_LOGON_EKU = 123,
    CAPICOM_OID_PKIX_POLICY_QUALIFIER_CPS = 124,
    CAPICOM_OID_PKIX_POLICY_QUALIFIER_USERNOTICE = 125,
  }

  type EKUPluginNames =
    'CAPICOM_EKU_OTHER'
    | 'CAPICOM_EKU_CLIENT_AUTH'
    | 'CAPICOM_EKU_SMARTCARD_LOGON';

  const enum CAPICOM_EKU {
    CAPICOM_EKU_OTHER = 0,
    CAPICOM_EKU_SERVER_AUTH = 1,
    CAPICOM_EKU_CLIENT_AUTH = 2,
    CAPICOM_EKU_CODE_SIGNING = 3,
    CAPICOM_EKU_EMAIL_PROTECTION = 4,
    CAPICOM_EKU_SMARTCARD_LOGON = 5,
    CAPICOM_EKU_ENCRYPTING_FILE_SYSTEM = 6,
  }

  const enum CAPICOM_ATTRIBUTE {
    CAPICOM_AUTHENTICATED_ATTRIBUTE_SIGNING_TIME = 0,
    CAPICOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_NAME = 1,
    CAPICOM_AUTHENTICATED_ATTRIBUTE_DOCUMENT_DESCRIPTION = 2,
  }

  const enum CAPICOM_HASH_ALGORITHM {
    CAPICOM_HASH_ALGORITHM_SHA1 = 0,
    CAPICOM_HASH_ALGORITHM_MD2 = 1,
    CAPICOM_HASH_ALGORITHM_MD4 = 2,
    CAPICOM_HASH_ALGORITHM_MD5 = 3,
    CAPICOM_HASH_ALGORITHM_SHA_256 = 4,
    CAPICOM_HASH_ALGORITHM_SHA_384 = 5,
    CAPICOM_HASH_ALGORITHM_SHA_512 = 6,
  }

  const enum CAPICOM_ENCODING_TYPE {
    CAPICOM_ENCODE_ANY = -1,
    CAPICOM_ENCODE_BASE64 = 0,
    CAPICOM_ENCODE_BINARY = 1,
  }
}