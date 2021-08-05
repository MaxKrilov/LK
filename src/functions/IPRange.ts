// @ts-ignore
import { Address4, Address6 } from 'ip-address'

class IPRange {
  private static maxRange = 10000

  private static toLong (ip: string) {
    let ipl = 0

    ip.split('.').forEach(function (octet) {
      ipl <<= 8
      ipl += parseInt(octet)
    })
    return (ipl >>> 0)
  }

  private static fromLong (ipl: number) {
    return `${(ipl >>> 24)}.${(ipl >> 16 & 255)}.${(ipl >> 8 & 255)}.${(ipl & 255)}`
  }

  private static getIPv4 (ip: string): Address4 | null {
    try {
      return new Address4(ip)
    } catch (err) {
      return null
    }
  }

  private static getIPv6 (ip: string): Address6 | null {
    try {
      return new Address6(ip)
    } catch (err) {
      return null
    }
  }

  private static getRangeV4 (ip1: string, ip2: string) {
    const ips = []

    let firstAddressLong = IPRange.toLong(ip1)
    const lastAddressLong = IPRange.toLong(ip2)

    const totalIPs = lastAddressLong - firstAddressLong

    // Prevent DoS
    if (totalIPs > IPRange.maxRange) {
      throw new Error(`Too many IPs in range. Total number: ${totalIPs}. Max count is ${IPRange.maxRange}, to increase, set the limit with the MAX_RANGE environment variable`)
    }

    for (firstAddressLong; firstAddressLong <= lastAddressLong; firstAddressLong++) {
      ips.push(IPRange.fromLong(firstAddressLong))
    }

    return ips
  }

  private static getRangeV6 (ip1: string, ip2: string) {
    const ips = []

    const firstAddress = new Address6(ip1)
    const lastAddress = new Address6(ip2)

    // @ts-ignore
    for (let i = firstAddress.bigInteger(); i <= lastAddress.bigInteger(); i++) {
      ips.push(Address6.fromBigInteger(i).correctForm())
    }

    return ips
  }

  private static isCIDR = (ipCIDR: Address4 | Address6): boolean => Boolean((ipCIDR as any).parsedSubnet)

  private static isRange = (ipRange: string): boolean => ipRange.indexOf('-') !== -1

  public static getIPRange (ip1: string, ip2?: string): string[] {
    if (process.env.MAX_RANGE && isNaN(parseInt(process.env.MAX_RANGE, 10))) {
      throw new Error('MAX_RANGE must be an integer')
    }
    IPRange.maxRange = parseInt(process.env.MAX_RANGE || '10000', 10)

    const ip1v4 = IPRange.getIPv4(ip1)!
    const ip1v6 = IPRange.getIPv6(ip1)!

    if (ip2) {
      const ip2v4 = IPRange.getIPv4(ip2)!
      if (ip1v4.valid && ip2v4.valid && !(ip1v4 as any).parsedSubnet && !(ip2v4 as any).parsedSubnet) {
        return IPRange.getRangeV4(ip1v4.correctForm(), ip2v4.correctForm())
      }

      // IPv6
      const ip2v6 = IPRange.getIPv6(ip2)!
      if (ip1v6.valid && ip2v6.valid && !(ip1v6 as any).parsedSubnet && !(ip2v6 as any).parsedSubnet) {
        return IPRange.getRangeV6(ip1v6.correctForm(), ip2v6.correctForm())
      }

      // IPs do not match version, or are invalid
      throw new Error('Cannot get range of two IPs if they are not both valid and the same version')
    }

    if (IPRange.isCIDR(ip1v4)) {
      return IPRange.getRangeV4(ip1v4.startAddress().correctForm(), ip1v4.endAddress().correctForm())
    }

    if (IPRange.isCIDR(ip1v6)) {
      return IPRange.getRangeV6(ip1v6.startAddress().correctForm(), ip1v6.endAddress().correctForm())
    }

    if (IPRange.isRange(ip1)) {
      const [firstAddress, lastAddress] = ip1.split('-')
      return IPRange.getIPRange(firstAddress, lastAddress)
    }

    // Did not match any of the above
    throw new Error('IP supplied is not valid')
  }
}

export default IPRange
