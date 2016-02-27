
import { getEqData } from './get-eq-data';
import { eqDataMarkupGenerator } from './eq-data-markup-generator';


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
    eqDataMarkupGenerator.emptyTable();
    getEqData.fetch();
  });
})();
