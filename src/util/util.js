const QUANTITY_SEPARATOR = '-';
const SPLIT_STRING = '],[';

export function parseInputOrder(inputOrder) {
  return inputOrder
    .slice(1, -1)
    .split(SPLIT_STRING)
    .reduce((result, item) => {
      const [name, quantity] = item.split(QUANTITY_SEPARATOR);
      result[name] = Number(quantity);
      return result;
    }, {});
}
