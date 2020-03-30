const MILLISECONDS_IN_ONE_SECOND = 1000

function strToDate (dateString: string): Date {
  return new Date(dateString)
}

function strTimestampToDate (timestampString: string): Date {
  const timestamp = parseInt(timestampString)
  const date = new Date(timestamp)
  return date
}

function strToTimestamp (str: string) {
  return parseInt(str)
}

function strToTimestampInMs (str: string) {
  return strToTimestamp(str) * MILLISECONDS_IN_ONE_SECOND
}

export {
  strToDate,
  strTimestampToDate,
  strToTimestamp,
  strToTimestampInMs
}
