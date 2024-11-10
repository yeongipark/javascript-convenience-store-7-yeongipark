import { ERROR_MESSAGE } from './constants/errorMessage.js';

export default class Validator {
  static validateInputOrder(inputOrder) {
    this.#checkEmpty(inputOrder);
    this.#checkOrderFormat(inputOrder);
  }

  static #checkEmpty(inputOrder) {
    if (inputOrder.trim() === '') this.#throwError(ERROR_MESSAGE.FALSE_INPUT);
  }

  static #checkOrderFormat(inputOrder) {
    // 구매 형식에 맞는지 확인하는 정규표현식
    const regExp = /^\[[가-힣a-zA-Z]+-[1-9]\d*\](,\[[가-힣a-zA-Z]+-[1-9]\d*\])*$/;
    if (!regExp.test(inputOrder)) this.#throwError(ERROR_MESSAGE.NOT_MATCH_FORMAT);
  }

  static validateProductExist(productNames, orderObject) {
    const bool = Object.keys(orderObject).every((orderProductName) => productNames.includes(orderProductName));
    if (!bool) this.#throwError(ERROR_MESSAGE.NOT_EXIST_PRODUCT);
  }

  static validateQuantity(quantity, orderCount) {
    if (quantity < orderCount) this.#throwError(ERROR_MESSAGE.OVER_QUANTITY);
  }

  static validateAnswer(answer) {
    const answerUpperCase = answer.toUpperCase();
    if (answerUpperCase !== 'Y' && answerUpperCase !== 'N') this.#throwError(ERROR_MESSAGE.FALSE_INPUT);
  }

  static #throwError(message) {
    throw new Error(message);
  }
}