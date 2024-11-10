import Products from '../model/Products.js';
import Promotions from '../model/Promotions.js';
import Validator from '../Validator.js';
import Order from '../model/Order.js';
import { parseInputOrder } from '../util/util.js';
import { OUTPUT_MESSAGE } from '../constants/outputMessage.js';

export default class StoreService {
  #promotions;
  #products;
  #order;

  constructor() {
    this.#promotions = new Promotions();
    this.#products = new Products();
    this.#order = null;
  }

  async init() {
    await this.#products.init();
    await this.#promotions.init();
  }

  getProductsInformationMessage() {
    const productsList = this.#products.getProductsInformation();
    return productsList.map((product) => {
      let message = `- ${product.name} ${product.price.toLocaleString()}원 `;
      if (product.quantity === 0) message += OUTPUT_MESSAGE.NO_QUANTITY;
      if (product.quantity !== 0) message += `${product.quantity}개`;
      if (product.promotion !== OUTPUT_MESSAGE.NULL) message += ` ${product.promotion}`;
      return message;
    });
  }

  handleInputOrder(inputOrder) {
    Validator.validateInputOrder(inputOrder);
    const parsedInputOrder = parseInputOrder(inputOrder);
    const productsName = this.#products.getProductsName();
    this.#validateParsedInputOrder(productsName, parsedInputOrder);
    this.#order = new Order(parsedInputOrder);
  }

  #validateParsedInputOrder(productsName, parsedInputOrder) {
    Validator.validateProductExist(productsName, parsedInputOrder);
    Object.entries(parsedInputOrder).forEach(([productName, orderCount]) => {
      const promotionName = this.#products.getProductPromotion(productName);
      const isPromotion = this.#promotions.isValidatePromotion(promotionName);
      const productQuantity = this.#products.getProductQuantity(productName, isPromotion);
      Validator.validateQuantity(productQuantity, orderCount);
    });
  }

  getNotEnoughPromotionProduct() {
    const orderList = this.#order.getOrderList();
    return orderList.reduce((notEnoughProducts, [productName, orderCount]) => {
      const promotionInfo = this.#getPromotionInfo(productName);
      if (!promotionInfo) return notEnoughProducts;
      const { promotionQuantity, buy, get } = promotionInfo;
      if (promotionQuantity > orderCount && orderCount % (buy + get) === buy) notEnoughProducts[productName] = get;
      return notEnoughProducts;
    }, {});
  }

  handleFreeQuantityAnswer(answer, productName, get) {
    Validator.validateAnswer(answer);
    if (answer === 'Y') this.#order.increaseOrderQuantity(productName, get);
  }

  getRegularProductsWithPromotion() {
    const orderList = this.#order.getOrderList();
    return orderList.reduce((regularPriceProducts, [productName, orderCount]) => {
      const promotionInfo = this.#getPromotionInfo(productName);
      if (!promotionInfo) return regularPriceProducts;
      const { promotionQuantity, buy, get } = promotionInfo;
      const maxPossiblePromotionCount = this.#calculateMaxPossiblePromotionCount(promotionQuantity, buy, get);
      if (orderCount - maxPossiblePromotionCount > 0)
        regularPriceProducts[productName] = orderCount - maxPossiblePromotionCount;
      return regularPriceProducts;
    }, {});
  }

  handleRegularProductsAnswer(answer, productName, count) {
    Validator.validateAnswer(answer);
    if (answer === 'N') this.#order.decreaseOrderQuantity(productName, count);
  }

  handleMembershipAnswer(answer) {
    Validator.validateAnswer(answer);
    if (answer === 'Y') this.#order.setDiscount(this.#calculateMembershipDiscount());
  }

  #calculateMembershipDiscount() {
    const regularProducts = this.#getRegularQuantityObject();
    const totalRegularPrice = Object.entries(regularProducts).reduce((totalPrice, [productName, orderCount]) => {
      return totalPrice + this.#products.getProductPrice(productName) * orderCount;
    }, 0);
    return Math.min(totalRegularPrice * 0.3, 8000);
  }

  #getRegularQuantityObject() {
    return this.#order.getOrderList().reduce((regularProducts, [productName, orderCount]) => {
      const maxPromotionCount = this.#calculateMaxPromotionCount(productName, orderCount);
      regularProducts[productName] = orderCount - maxPromotionCount;
      return regularProducts;
    }, {});
  }

  #calculateMaxPromotionCount(productName, orderCount) {
    const promotionInfo = this.#getPromotionInfo(productName);
    if (!promotionInfo) return 0;
    const { promotionQuantity, buy, get } = promotionInfo;
    const maxBuyPromotionCount = Math.min(promotionQuantity, orderCount);
    return this.#calculateMaxPossiblePromotionCount(maxBuyPromotionCount, buy, get);
  }

  #calculateMaxPossiblePromotionCount(promotionQuantity, buy, get) {
    return promotionQuantity - (promotionQuantity % (buy + get));
  }

  handleContinueAnswer(answer) {
    Validator.validateAnswer(answer);
    if (answer === 'N') return false;
    return true;
  }

  #getPromotionInfo(productName) {
    const promotionName = this.#products.getProductPromotion(productName);
    if (!this.#promotions.isValidatePromotion(promotionName)) return null;
    const promotionQuantity = this.#products.getPromotionProductQuantity(productName);
    const { buy, get } = this.#promotions.getBuyGetCount(promotionName);
    return { promotionName, promotionQuantity, buy, get };
  }

  reduceQuantity() {
    const orderList = this.#order.getOrderList();
    orderList.forEach(([productName, quantity]) => {
      const promotionName = this.#products.getProductPromotion(productName);
      const isPromotion = this.#promotions.isValidatePromotion(promotionName);
      this.#products.reduceProductQuantity(productName, quantity, isPromotion);
    });
  }

  getOrderList() {
    return this.#order
      .getOrderList()
      .filter(([_, quantity]) => quantity > 0)
      .map(([name, quantity]) => ({
        name,
        quantity,
        price: this.#products.getProductPrice(name) * quantity,
      }));
  }

  getGiveawayList() {
    return Object.entries(this.#getGiveawayObject()).map(([name, quantity]) => ({ name, quantity }));
  }

  #getGiveawayObject() {
    const orderList = this.#order.getOrderList();
    return orderList.reduce((giveawayObject, [productName, orderCount]) => {
      const maxPromotionCount = this.#calculateMaxPromotionCount(productName, orderCount);
      if (!maxPromotionCount) return giveawayObject;
      const { buy, get } = this.#getPromotionInfo(productName);
      giveawayObject[productName] = maxPromotionCount / (buy + get);
      return giveawayObject;
    }, {});
  }

  getReceiptData() {
    const totalOrderQuantity = this.#calculateTotalOrderQuantity();
    const totalPrice = this.#calculateTotalPrice();
    const promotionDiscount = this.#calculatePromotionDiscount();
    const membershipDiscount = this.#order.getDiscount();
    const finalPrice = totalPrice - promotionDiscount - membershipDiscount;
    return { totalOrderQuantity, totalPrice, promotionDiscount, finalPrice, membershipDiscount };
  }

  #calculateTotalOrderQuantity() {
    return this.#order.getOrderList().reduce((totalQuantity, [_, quantity]) => {
      return totalQuantity + quantity;
    }, 0);
  }

  #calculatePromotionDiscount() {
    return this.getGiveawayList().reduce((totalDiscount, { name, quantity }) => {
      return totalDiscount + this.#products.getProductPrice(name) * quantity;
    }, 0);
  }

  #calculateTotalPrice() {
    return this.#order.getOrderList().reduce((totalPrice, [productName, quantity]) => {
      const productPrice = this.#products.getProductPrice(productName);
      const itemTotal = productPrice * quantity;
      return totalPrice + itemTotal;
    }, 0);
  }
}
