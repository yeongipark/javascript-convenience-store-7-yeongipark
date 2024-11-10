import { parseInputOrder } from '../src/util/util.js';

describe('util 테스트', () => {
  test.each([
    ['[콜라-10],[사이다-3]', { 콜라: 10, 사이다: 3 }],
    ['[컵라면-100],[정식도시락-1000]', { 컵라면: 100, 정식도시락: 1000 }],
  ])('%s 구매할 상품과 수량 파싱하기', (inputOrder, expected) => {
    expect(parseInputOrder(inputOrder)).toEqual(expected);
  });
});
