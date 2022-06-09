import moment from 'moment'

export const reassignActualStartDate = (chars: any, packet: any) => {
  const newChars = {}
  const charsFormatDate = (key:any) => {
    // @ts-ignore
    newChars[key] = moment(chars[key].value).format('DD.MM.YY')
  }
  Object.keys(chars).map(charsFormatDate)
  Object.assign(packet, newChars)
}
