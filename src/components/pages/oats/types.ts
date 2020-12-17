export interface OATSPoint {
  address: String
  status: String
  price: String
  tariffName: String
  activeFrom: String
  stopDate?: String,
  bpi?: String
}

export const POINT_STOPPED = 'stopped'
