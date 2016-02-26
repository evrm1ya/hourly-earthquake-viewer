
'use strict';

// @todo refactor with babel
// @todo create menu for last 10 requests using cache
var eqDataCache = {};

function get(url) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = () => {
      if (req.status == 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = () => {
      reject(Error('Network Error'));
    };
    req.send();
  });
}

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
    let startTimeQuery = `${starttimeQueryBase}${timeStrings.oneHourAgo}`;
    let endTimeQuery = `${endtimeQueryBase}${timeStrings.currentTime}`;
    return `${startTimeQuery}${endTimeQuery}`;
  }

  return { 
    getPastHourUrl() {
      let queryUrl = formatQueryUrls();
      return `${baseUrl}${queryUrl}`;
    }
  };
})();

var eqDataMarkupGenerator = (() => {
  const tableId = document.getElementById('eq-data-table');
  function createNewRow() {
    return document.createElement('tr');
  }
  function cell() {
    return document.createElement('td');
  }
  function cellText(text) {
    return document.createTextNode(text);
  }
  function completeCell(text) {
    let newCell = cell();
    let innerText = cellText(text);
    newCell.appendChild(innerText);
    return newCell;
  }
  function appendCellToRow(row, textArr) {
    let textArrLength = textArr.length;
    for(let i = 0; i < textArrLength; i++) {
      let newCompleteCell = completeCell(textArr[i]);
      row.appendChild(newCompleteCell);
    }
  }
  function makeSingleRow(props) {
    let newRow = createNewRow();
    // @todo refactor propsArr
    let propsArr = [
      props.type,
      props.mag,
      props.place,
      new Date(props.time),
      props.status
    ];
    appendCellToRow(newRow, propsArr);
    return newRow;
  }

  return {
    createTableRows(cacheKey, eqDataCache) {
      let eqData = eqDataCache[cacheKey];
      eqData.map((earthquake) => {
        let props = earthquake.properties;
        let row = makeSingleRow(props);
        tableId.appendChild(row);
      });
    }
  }
})();

var getEqData = (() => {
  function cacheEqData(eqData) {
    var currentCacheKey = false;
    let eqFeatures = eqData.features;
    let eqFeaturesLength = eqFeatures.length;
    // only cache if data
    if (eqFeatures && eqFeaturesLength != 0) {
      currentCacheKey = `_${eqData.metadata.generated}`;
      eqDataCache[currentCacheKey] = eqFeatures;
    }
    else {
      // @todo no data markup here
      console.log('no data');
    }
    return {
      currentCacheKey: currentCacheKey,
      eqDataCache: eqDataCache
    }
  }

  return {
    fetch() {
      let url = eqPastHourQuery.getPastHourUrl();
      get(url)
        .then((response) => {
          let eqData = JSON.parse(response);
          return eqData;
        }, (error) => {
          console.log('parse error ', error);
        })
        .then((eqData) => {
          return cacheEqData(eqData);
        })
        .then((currentCache) => {
          console.log(currentCache);
          eqDataMarkupGenerator.createTableRows(
            currentCache.currentCacheKey,
            currentCache.eqDataCache
          );
        });
    }
  }
})();


/**
 *
 * fetch data on page load
 * update on btn click
 *
 */

(() => {
  const eqDataUpdateBtn = document.getElementById('eq-data-update');
  getEqData.fetch();
  eqDataUpdateBtn.addEventListener('click', () => {
    getEqData.fetch();
  });
})();


