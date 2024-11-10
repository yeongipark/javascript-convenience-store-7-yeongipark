import { DateTimes } from '@woowacourse/mission-utils';
import { parseFileContent } from '../util/fileUtil.js';

export default class Promotions {
  #promotionsInformation;

  constructor() {
    this.#promotionsInformation = [];
  }

  async init() {
    this.#promotionsInformation = await parseFileContent('promotions.md');
  }

  isValidatePromotion(promotionName) {
    if (!promotionName) return false;
    const promotion = this.#findPromotion(promotionName);
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);
    const now = DateTimes.now();
    if (now >= startDate && now <= endDate) return true;
    return false;
  }

  getBuyGetCount(promotionName) {
    const promotion = this.#findPromotion(promotionName);
    return { get: Number(promotion.get), buy: Number(promotion.buy) };
  }

  #findPromotion(promotionName) {
    return this.#promotionsInformation.find((promotion) => promotion.name === promotionName);
  }
}
