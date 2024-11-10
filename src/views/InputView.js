import { Console } from '@woowacourse/mission-utils';
import { INPUT_MESSAGE } from '../constants/inputMessage.js';

export default class InputView {
  static buyProduct() {
    return Console.readLineAsync(INPUT_MESSAGE.BUY_PRODUCT);
  }

  static addFreeQuantity(productName) {
    return Console.readLineAsync(
      `\n현재 ${productName}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
    );
  }

  static addRegularProduct(productName, count) {
    return Console.readLineAsync(
      `\n현재 ${productName} ${count}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
    );
  }

  static applyMembership() {
    return Console.readLineAsync(INPUT_MESSAGE.MEMBERSHIP);
  }

  static continue() {
    return Console.readLineAsync(INPUT_MESSAGE.CONTINUE);
  }
}
