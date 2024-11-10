import { ERROR_MESSAGE } from '../src/constants/errorMessage.js';
import Validator from '../src/Validator.js';

describe('Validator 클래스 테스트', () => {
  test.each([
    ['', false],
    ['   ', false],
  ])('빈 값 입력 예외', (input) => {
    expect(() => Validator.validateInputOrder(input)).toThrow(ERROR_MESSAGE.NOT_MATCH_FORMAT);
  });

  test.each([['[콜라-0]'], ['[콜라],[사이다-5]'], ['[콜라-5],[5]'], ['[사이다--5],[콜라--5]']])(
    '%s 구매 형식에 맞지 않는 경우우',
    (input) => {
      expect(() => Validator.validateInputOrder(input)).toThrow(ERROR_MESSAGE.NOT_MATCH_FORMAT);
    },
  );

  test.each([['[콜라-10]'], ['[콜라-1],[사이다-20]']])('%s 구매 형식에 맞는 경우', (input) => {
    expect(() => Validator.validateInputOrder(input)).not.toThrow();
  });

  test.each([[{ 커피: 2 }], [{ 초코칩: 1, 커피: 1 }], [{ 피자: 4 }]])('%s 구매 품목이 존재하지 않는 경우', (input) => {
    const products = ['콜라', '사이다', '물', '초코칩'];
    expect(() => Validator.validateProductExist(products, input)).toThrow(ERROR_MESSAGE.NOT_EXIST_PRODUCT);
  });

  test.each([[{ 콜라: 2, 사이다: 10 }], [{ 콜라: 2, 물: 10 }], [{ 콜라: 2 }]])(
    '%s 구매 품목이 존재하는 경우',
    (input) => {
      const products = ['콜라', '사이다', '물', '초코칩'];
      expect(() => Validator.validateProductExist(products, input)).not.toThrow();
    },
  );

  test('주문 수량보다 재고가 적은 경우 에러', () => {
    const quantity = 10;
    const orderCount = 20;
    expect(() => Validator.validateQuantity(quantity, orderCount)).toThrow(ERROR_MESSAGE.OVER_QUANTITY);
  });

  test('주문 수량보다 재고가 많은 경우', () => {
    const quantity = 20;
    const orderCount = 10;
    expect(() => Validator.validateQuantity(quantity, orderCount)).not.toThrow();
  });

  test.each([
    ['a', ERROR_MESSAGE.FALSE_INPUT],
    ['  ', ERROR_MESSAGE.FALSE_INPUT],
    ['asdf', ERROR_MESSAGE.FALSE_INPUT],
    [' f f f', ERROR_MESSAGE.FALSE_INPUT],
  ])('%s가 Y(y) or N(n) 가 아닌 경우', (answer, message) => {
    expect(() => Validator.validateAnswer(answer)).toThrow(message);
  });

  test.each([['Y'], ['N']])('%s가 Y or N인 경우', (answer) => {
    expect(() => Validator.validateAnswer(answer)).not.toThrow();
  });
});
