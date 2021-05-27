export interface IBundle {
  offer: IBundleInfo;
  fulladdress: string;
  amount: IBundleAmount;
  address: IBundleInfo;
  city: string;
  name: string;
  bpi: string;
  id: string;
  bundle: IBundleInfo;
  status: string;
}

export interface IBundleInfo {
  name: string;
  id: string;
}

export interface IBundleAmount {
  bundleDiscount?: string;
  currency: IBundleCurrency;
  value: string;
}

export interface IBundleCurrency {
  name: string;
  currencyCode: string;
}
