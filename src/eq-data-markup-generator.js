import { eqDataCache } from './eq-data-cache';

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
    },

    emptyTable() {
      let tableChildren = tableId.childNodes;
      let tableChildrenLength = tableChildren.length;
      for (let i = 2; i < tableChildrenLength; i++) {
        tableChildren[2].remove();
      }
    }
  }
})();

export { eqDataMarkupGenerator };
