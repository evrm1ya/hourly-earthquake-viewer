import { get } from './getter.js';
import { eqDataCache } from './eq-data-cache';
import { eqPastHourQuery } from './past-hour-query';
import { eqDataMarkupGenerator } from './eq-data-markup-generator';

var getEqData = (() => {
  function cacheEqData(eqData) {
    let currentCacheKey = `_${eqData.metadata.generated}`;
    let eqFeatures = eqData.features;
    let eqFeaturesLength = eqFeatures.length;
    var featureData = false;
    if (eqFeatures && eqFeaturesLength != 0) {
      eqDataCache[currentCacheKey] = eqFeatures;
      featureData = true;
    }
    else {
      eqDataCache[currentCacheKey] = false;
    }
    return {
      featureData: featureData,
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
          if (currentCache.featureData) {
            eqDataMarkupGenerator.createTableRows(
              currentCache.currentCacheKey,
              currentCache.eqDataCache
            );
          }
          else {
            // @todo no data markup here
            console.log('no feature data');
          }
        });
    }
  }
})();

export { getEqData };
