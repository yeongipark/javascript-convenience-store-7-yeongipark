import StoreService from '../service/StoreService.js';
import OutputView from '../views/OutputView.js';
import InputView from '../views/InputView.js';

export default class StoreController {
  #storeService;
  #flag;

  constructor() {
    this.#storeService = new StoreService();
    this.#flag = true;
  }

  async run() {
    await this.#storeService.init();
    while (this.#flag) {
      await this.#printProductInformation();
      await this.#errorHandler(this.#handleInputOrder.bind(this));
      await this.#errorHandler(this.#processAddPromotion.bind(this));
      await this.#errorHandler(this.#processRegularProductsWithPromotion.bind(this));
      await this.#errorHandler(this.#processMemberShip.bind(this));
      this.#printReceipt();
      this.#flag = await this.#errorHandler(this.#processContinueAsk.bind(this));
    }
  }

  async #printProductInformation() {
    OutputView.start();
    OutputView.productsInformation(this.#storeService.getProductsInformationMessage());
    OutputView.emptyLine();
  }

  async #handleInputOrder() {
    const inputOrder = await InputView.buyProduct();
    this.#storeService.handleInputOrder(inputOrder);
  }

  async #processAddPromotion() {
    const notEnoughPromotionProducts = this.#storeService.getNotEnoughPromotionProduct();
    const productNames = Object.keys(notEnoughPromotionProducts);
    for (let i = 0; i < productNames.length; i++) {
      const productName = productNames[i];
      const answer = await InputView.addFreeQuantity(productName);
      this.#storeService.handleFreeQuantityAnswer(answer, productName, notEnoughPromotionProducts[productName]);
    }
  }

  async #processRegularProductsWithPromotion() {
    const regularPriceProductList = Object.entries(this.#storeService.getRegularProductsWithPromotion());
    for (let i = 0; i < regularPriceProductList.length; i++) {
      const [productName, quantity] = regularPriceProductList[i];
      const answer = await InputView.addRegularProduct(productName, quantity);
      this.#storeService.handleRegularProductsAnswer(answer, productName, quantity);
    }
  }

  async #processMemberShip() {
    const answer = await InputView.applyMembership();
    this.#storeService.handleMembershipAnswer(answer);
  }

  #printReceipt() {
    OutputView.emptyLine();
    this.#printOrderList();
    this.#printGiveawayList();
    this.#printReceiptData();
    this.#storeService.reduceQuantity();
  }

  #printOrderList() {
    const orderList = this.#storeService.getOrderList();
    OutputView.totalProduct(orderList);
  }

  #printGiveawayList() {
    const giveawayList = this.#storeService.getGiveawayList();
    OutputView.giveaways(giveawayList);
  }

  #printReceiptData() {
    const { totalOrderQuantity, totalPrice, promotionDiscount, finalPrice, membershipDiscount } =
      this.#storeService.getReceiptData();
    OutputView.prices({ totalOrderQuantity, totalPrice, promotionDiscount, finalPrice, membershipDiscount });
  }

  async #processContinueAsk() {
    const answer = await InputView.continue();
    OutputView.emptyLine();
    return this.#storeService.handleContinueAnswer(answer);
  }

  async #errorHandler(callback) {
    while (true) {
      try {
        const flag = await callback();
        return flag;
      } catch (e) {
        OutputView.error(e.message);
      }
    }
  }
}
