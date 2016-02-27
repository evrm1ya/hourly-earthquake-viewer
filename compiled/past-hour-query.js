'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eqPastHourQuery = undefined;

var _dateFormatter = require('./date-formatter');

/**
 *
 * format api url to get last hour's eq data
 *
 */

var eqPastHourQuery = function () {
  var hourInMS = 3600000;
  var baseUrl = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
  var starttimeQueryBase = '&starttime=';
  var endtimeQueryBase = '&endtime=';
  var eastTimeZone = '-0500';
  function createTimes() {
    var currentTime = new Date();
    var hourInMS = 3600000;
    var currentTimeInMS = currentTime.getTime();
    var oneHourAgo = new Date(currentTime - hourInMS);
    return {
      oneHourAgo: oneHourAgo,
      currentTime: currentTime
    };
  }
  function formatTimeStrings() {
    var times = createTimes();
    for (var key in times) {
      var time = times[key];
      var fullYear = time.getFullYear();
      var month = _dateFormatter.dateTimeFormatter.monthIndexToNum(time);
      var day = time.getDate();
      var timeString = _dateFormatter.dateTimeFormatter.timeStringNoZone(time);
      times[key] = fullYear + '-' + month + '-' + day + 'T' + timeString;
    }
    return times;
  }
  function formatQueryUrls() {
    var timeStrings = formatTimeStrings();
    var startTimeQuery = '' + starttimeQueryBase + timeStrings.oneHourAgo + eastTimeZone;
    var endTimeQuery = '' + endtimeQueryBase + timeStrings.currentTime + eastTimeZone;
    return '' + startTimeQuery + endTimeQuery;
  }

  return {
    getPastHourUrl: function getPastHourUrl() {
      var queryUrl = formatQueryUrls();
      return '' + baseUrl + queryUrl;
    }
  };
}();

exports.eqPastHourQuery = eqPastHourQuery;