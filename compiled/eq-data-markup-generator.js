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