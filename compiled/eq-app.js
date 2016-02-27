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