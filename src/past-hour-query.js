
import { dateTimeFormatter } from './date-formatter';
/**
 *
 * format api url to get last hour's eq data
 *
 */

var eqPastHourQuery = (() => {
  const hourInMS = 3600000;
  const baseUrl = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
  const starttimeQueryBase = '&starttime=';
  const endtimeQueryBase = '&endtime=';
  const eastTimeZone = '-0500';
  function createTimes() {
    let currentTime = new Date();
    let hourInMS = 3600000;
    let currentTimeInMS = currentTime.getTime();
    let oneHourAgo = new Date(currentTime - hourInMS);
    return {
      oneHourAgo: oneHourAgo,
      currentTime: currentTime
    }
  }
  function formatTimeStrings() {
    let times = createTimes();
    for(var key in times) {
      let time = times[key];
      let fullYear = time.getFullYear();
      let month = dateTimeFormatter.monthIndexToNum(time);
      let day = time.getDate();
      let timeString = dateTimeFormatter.timeStringNoZone(time);
     times[key] = `${fullYear}-${month}-${day}T${timeString}`;
    }
    return times;
  }
  function formatQueryUrls() {
    let timeStrings = formatTimeStrings();
    let startTimeQuery = `${starttimeQueryBase}${timeStrings.oneHourAgo}${eastTimeZone}`;
    let endTimeQuery = `${endtimeQueryBase}${timeStrings.currentTime}${eastTimeZone}`;
    return `${startTimeQuery}${endTimeQuery}`;
  }

  return { 
    getPastHourUrl() {
      let queryUrl = formatQueryUrls();
      return `${baseUrl}${queryUrl}`;
    }
  };
})();

export { eqPastHourQuery }; 

