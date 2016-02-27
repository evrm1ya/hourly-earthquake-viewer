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