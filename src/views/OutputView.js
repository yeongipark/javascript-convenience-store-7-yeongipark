import { Console } from '@woowacourse/mission-utils';
import { OUTPUT_MESSAGE } from '../constants/outputMessage.js';

const PRODUCT_NAME_WIDTH = 18;
const QUANTITY_WIDTH = 8;
const PRICE_WIDTH = 12;
const DISCOUNT_LABEL_WIDTH = 26;

export default class OutputView {
  static start() {
    Console.print(OUTPUT_MESSAGE.START);
  }

  static productsInformation(productsMessageList) {
    productsMessageList.forEach((message) => {
      Console.print(message);
    });
  }

  static totalProduct(orderList) {
    Console.print(OUTPUT_MESSAGE.HEADER_PRODUCT);
    Console.print(`${this.#padToWidth('상품명', PRODUCT_NAME_WIDTH)}${this.#padToWidth('수량', QUANTITY_WIDTH)}금액`);
    orderList.forEach((order) => {
      const name = this.#padToWidth(order.name, PRODUCT_NAME_WIDTH);
      const price = order.price.toLocaleString().padStart(PRICE_WIDTH, ' ');
      Console.print(`${name}${order.quantity}${price}`);
    });
  }

  static giveaways(giveawayList) {
    Console.print(OUTPUT_MESSAGE.HEADER_GIVEAWAY);
    giveawayList.forEach((giveaway) => {
      const name = this.#padToWidth(giveaway.name, PRODUCT_NAME_WIDTH);
      Console.print(`${name}${giveaway.quantity}`);
    });
  }

  static prices({ totalOrderQuantity, totalPrice, promotionDiscount, finalPrice, membershipDiscount }) {
    Console.print(OUTPUT_MESSAGE.HEADER_PRICE);
    Console.print(
      `${this.#padToWidth('총구매액', PRODUCT_NAME_WIDTH)}${totalOrderQuantity}${totalPrice.toLocaleString().padStart(PRICE_WIDTH, ' ')}`,
    );
    Console.print(`${this.#padToWidth('행사할인', DISCOUNT_LABEL_WIDTH)}-${promotionDiscount.toLocaleString()}`);
    Console.print(`${this.#padToWidth('멤버십할인', DISCOUNT_LABEL_WIDTH)}-${membershipDiscount.toLocaleString()}`);
    Console.print(`${this.#padToWidth('내실돈', DISCOUNT_LABEL_WIDTH)}${finalPrice.toLocaleString()}`);
  }

  static error(message) {
    Console.print(message);
  }

  static emptyLine() {
    Console.print(OUTPUT_MESSAGE.EMPTY_STRING);
  }

  // 영수증 출력 형식을 맞추기 위한 함수
  // 한글을 2칸으로 계산하는 유틸리티 함수
  static #padToWidth(text, width) {
    const length = [...text].reduce((acc, char) => acc + (this.#isKorean(char) ? 2 : 1), 0);
    const paddingNeeded = width - length;
    return text + ' '.repeat(Math.max(0, paddingNeeded));
  }

  static #isKorean(char) {
    const code = char.charCodeAt(0);
    return code >= 0xac00 && code <= 0xd7a3;
  }
}
