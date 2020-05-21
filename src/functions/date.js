const MILLISECONDS_IN_ONE_SECOND = 1000;
function strToDate(dateString) {
    return new Date(dateString);
}
function strTimestampToDate(timestampString) {
    const timestamp = parseInt(timestampString);
    const date = new Date(timestamp);
    return date;
}
function strToTimestamp(str) {
    return parseInt(str);
}
function strToTimestampInMs(str) {
    return strToTimestamp(str) * MILLISECONDS_IN_ONE_SECOND;
}
export { strToDate, strTimestampToDate, strToTimestamp, strToTimestampInMs };
//# sourceMappingURL=date.js.map