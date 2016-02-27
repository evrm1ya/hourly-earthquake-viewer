
/**
 *
 * date formatting fcns go here
 *
 */

var dateTimeFormatter = (() => {
  const monthsInNums = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
  ];

  return {
    monthIndexToNum(dateObj) {
      return monthsInNums[dateObj.getMonth()];
    },
    timeStringNoZone(dateObj) {
      return dateObj.toTimeString().split(' ')[0];
    }
  }
})();

export { dateTimeFormatter };
