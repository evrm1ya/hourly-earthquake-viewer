(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
'use strict';

var _getEqData = require('./get-eq-data');

var _eqDataMarkupGenerator = require('./eq-data-markup-generator');

/**
 *
 * fetch data on page load
 * update on btn click
 *
 */
(function () {
  var eqDataUpdateBtn = document.getElementById('eq-data-update');
  _getEqData.getEqData.fetch();
  eqDataUpdateBtn.addEventListener('click', function () {
    _eqDataMarkupGenerator.eqDataMarkupGenerator.emptyTable();
    _getEqData.getEqData.fetch();
  });
})();
},{"./eq-data-markup-generator":4,"./get-eq-data":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var eqDataCache = {};
exports.eqDataCache = eqDataCache;
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eqDataMarkupGenerator = undefined;

var _eqDataCache = require('./eq-data-cache');

var eqDataMarkupGenerator = function () {
  var tableId = document.getElementById('eq-data-table');
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
    var newCell = cell();
    var innerText = cellText(text);
    newCell.appendChild(innerText);
    return newCell;
  }
  function appendCellToRow(row, textArr) {
    var textArrLength = textArr.length;
    for (var i = 0; i < textArrLength; i++) {
      var newCompleteCell = completeCell(textArr[i]);
      row.appendChild(newCompleteCell);
    }
  }
  function makeSingleRow(props) {
    var newRow = createNewRow();
    // @todo refactor propsArr
    var propsArr = [props.type, props.mag, props.place, new Date(props.time), props.status];
    appendCellToRow(newRow, propsArr);
    return newRow;
  }
  return {
    createTableRows: function createTableRows(cacheKey, eqDataCache) {
      var eqData = eqDataCache[cacheKey];
      eqData.map(function (earthquake) {
        var props = earthquake.properties;
        var row = makeSingleRow(props);
        tableId.appendChild(row);
      });
    },
    emptyTable: function emptyTable() {
      var tableChildren = tableId.childNodes;
      var tableChildrenLength = tableChildren.length;
      for (var i = 2; i < tableChildrenLength; i++) {
        tableChildren[2].remove();
      }
    }
  };
}();

exports.eqDataMarkupGenerator = eqDataMarkupGenerator;
},{"./eq-data-cache":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEqData = undefined;

var _getter = require('./getter.js');

var _eqDataCache = require('./eq-data-cache');

var _pastHourQuery = require('./past-hour-query');

var _eqDataMarkupGenerator = require('./eq-data-markup-generator');

var getEqData = function () {
  function cacheEqData(eqData) {
    var currentCacheKey = '_' + eqData.metadata.generated;
    var eqFeatures = eqData.features;
    var eqFeaturesLength = eqFeatures.length;
    var featureData = false;
    if (eqFeatures && eqFeaturesLength != 0) {
      _eqDataCache.eqDataCache[currentCacheKey] = eqFeatures;
      featureData = true;
    } else {
      _eqDataCache.eqDataCache[currentCacheKey] = false;
    }
    return {
      featureData: featureData,
      currentCacheKey: currentCacheKey,
      eqDataCache: _eqDataCache.eqDataCache
    };
  }

  return {
    fetch: function fetch() {
      var url = _pastHourQuery.eqPastHourQuery.getPastHourUrl();
      (0, _getter.get)(url).then(function (response) {
        var eqData = JSON.parse(response);
        return eqData;
      }, function (error) {
        console.log('parse error ', error);
      }).then(function (eqData) {
        return cacheEqData(eqData);
      }).then(function (currentCache) {
        if (currentCache.featureData) {
          _eqDataMarkupGenerator.eqDataMarkupGenerator.createTableRows(currentCache.currentCacheKey, currentCache.eqDataCache);
        } else {
          // @todo no data markup here
          console.log('no feature data');
        }
      });
    }
  };
}();

exports.getEqData = getEqData;
},{"./eq-data-cache":3,"./eq-data-markup-generator":4,"./getter.js":6,"./past-hour-query":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var get = function get(url) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function () {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(Error('Network Error'));
    };
    req.send();
  });
};

exports.get = get;
},{}],7:[function(require,module,exports){
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
},{"./date-formatter":1}]},{},[2]);
