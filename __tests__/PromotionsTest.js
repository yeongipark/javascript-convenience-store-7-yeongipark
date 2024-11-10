import { DateTimes } from '@woowacourse/mission-utils';
import Promotions from '../src/model/Promotions';

describe('Promotions 클래스 테스트', () => {
  let promotions;

  beforeEach(async () => {
    promotions = new Promotions();
    await promotions.init();
  });

  test.each([
    ['탄산2+1', '2023-11-03', false],
    ['탄산2+1', '2024-11-03', true],
    ['MD추천상품', '2023-11-03', false],
    ['MD추천상품', '2024-11-03', true],
    ['반짝할인', '2024-10-03', false],
    ['반짝할인', '2024-11-03', true],
  ])('%s 프로모션이 오늘 유효한지', (promotionName, date, expected) => {
    DateTimes.now = jest.fn();
    DateTimes.now.mockReturnValue(new Date(date));

    expect(promotions.isValidatePromotion(promotionName)).toEqual(expected);
  });

  test.each([
    ['탄산2+1', { get: 1, buy: 2 }],
    ['MD추천상품', { get: 1, buy: 1 }],
    ['반짝할인', { get: 1, buy: 1 }],
  ])('%s 프로모션이 오늘 유효한지', (promotionName, expected) => {
    expect(promotions.getBuyGetCount(promotionName)).toEqual(expected);
  });
});
