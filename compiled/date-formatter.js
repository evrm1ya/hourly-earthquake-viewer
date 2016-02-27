'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 *
 * date formatting fcns go here
 *
 */

var dateTimeFormatter = function () {
  var monthsInNums = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  return {
    monthIndexToNum: function monthIndexToNum(dateObj) {
      return monthsInNums[dateObj.getMonth()];
    },
    timeStringNoZone: function timeStringNoZone(dateObj) {
      return dateObj.toTimeString().split(' ')[0];
    }
  };
}();

exports.dateTimeFormatter = dateTimeFormatter;