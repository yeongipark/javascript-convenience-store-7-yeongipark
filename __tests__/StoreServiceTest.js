import { ERROR_MESSAGE } from '../src/constants/errorMessage.js';
import StoreService from '../src/service/StoreService.js';

describe('StoreService 테스트 실행', () => {
  let storeService;
  beforeEach(async () => {
    storeService = new StoreService();
    await storeService.init();
  });

  test.each([
    ['[바나나바나나-6]', ERROR_MESSAGE.NOT_EXIST_PRODUCT],
    ['[콜라-1000]', ERROR_MESSAGE.OVER_QUANTITY],
    ['[바나나바나나]', ERROR_MESSAGE.NOT_MATCH_FORMAT],
    ['[콜라-10],[바나나바나나-100]', ERROR_MESSAGE.NOT_EXIST_PRODUCT],
    ['', ERROR_MESSAGE.NOT_EXIST_PRODUCT],
  ])('%s 사용자의 구매 입력이 잘못된 경우', (input, error) => {
    expect(() => storeService.handleInputOrder(input)).toThrow(error);
  });

  test('사용자 입력이 유효한 경우', () => {
    const inputOrder = '[콜라-10],[사이다-10]';
    expect(() => storeService.handleInputOrder(inputOrder)).not.toThrow('[ERROR]');
  });

  test.each([
    ['[콜라-5],[사이다-5]', { 콜라: 1, 사이다: 1 }],
    ['[콜라-6],[사이다-5]', { 사이다: 1 }],
    ['[물-5],[에너지바-3],[콜라-5]', { 콜라: 1 }],
    ['[물-5],[에너지바-5]', {}],
    ['[초코바-3]', { 초코바: 1 }],
  ])('%s 프로모션 진행 중인 물품중 혜택만큼 가져오지 않은 경우', (input, expected) => {
    storeService.handleInputOrder(input);
    expect(storeService.getNotEnoughPromotionProduct()).toEqual(expected);
  });

  test.each([
    ['[콜라-15]', { 콜라: 6 }],
    ['[콜라-10]', { 콜라: 1 }],
    ['[물-5],[콜라-15],[정식도시락-3]', { 콜라: 6 }],
    ['[콜라-15],[사이다-9]', { 콜라: 6, 사이다: 3 }],
    ['[초코바-5]', { 초코바: 1 }],
  ])('%s 프로모션 진행 중인 물품 중 정가로 구매해야 되는 상품명과 갯수', (input, expected) => {
    storeService.handleInputOrder(input);
    expect(storeService.getRegularProductsWithPromotion()).toEqual(expected);
  });
});
