import { ERROR_MESSAGE } from '../constants/errorMessage.js';

const QUANTITY_SEPARATOR = '-';
const SPLIT_STRING = '],[';

export function parseInputOrder(inputOrder) {
  return inputOrder
    .slice(1, -1)
    .split(SPLIT_STRING)
    .reduce((result, item) => {
      const [name, quantity] = item.split(QUANTITY_SEPARATOR);
      if (result[name]) throw new Error(ERROR_MESSAGE.FALSE_INPUT);
      result[name] = Number(quantity);
      return result;
    }, {});
}
