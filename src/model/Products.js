import { parseFileContent } from '../util/fileUtil.js';

export default class Products {
  #productsInformation;

  constructor() {
    // [{name : 콜라, price : 1000, quantity : 5, promotion : '2+1'},..]
    this.#productsInformation = [];
  }

  async init() {
    const products = await parseFileContent('products.md');
    this.#productsInformation = products.map((product) => {
      return { ...product, quantity: Number(product.quantity), price: Number(product.price) };
    });
  }

  getProductsInformation() {
    return this.#productsInformation;
  }

  getProductPrice(productName) {
    return Number(this.#findProduct(productName).price);
  }

  getProductPromotion(productName) {
    const promotion = this.#findProduct(productName).promotion;
    if (promotion === 'null') return null;
    return promotion;
  }

  #findProduct(productName) {
    return this.#productsInformation.find((product) => product.name === productName);
  }

  getProductQuantity(productName) {
    return Number(this.#getProductTotalQuantity(productName));
  }

  #getProductTotalQuantity(productName) {
    return this.#productsInformation
      .filter((product) => product.name === productName)
      .reduce((sum, product) => {
        return (sum += product.quantity);
      }, 0);
  }

  getPromotionProductQuantity(productName) {
    return Number(this.#findPromotionProduct(productName).quantity);
  }

  // 프로모션 제품인 경우 프로모션 제고에서 먼저 차감, 아닌 경우 일반 재고에서 먼저 차감
  reduceProductQuantity(productName, orderQuantity, isPromotion) {
    let primaryProduct;
    let secondaryProduct;
    if (isPromotion) {
      primaryProduct = this.#findPromotionProduct(productName);
      secondaryProduct = this.#findNoPromotionProduct(productName);
    } else {
      primaryProduct = this.#findNoPromotionProduct(productName);
      secondaryProduct = this.#findPromotionProduct(productName);
    }
    this.#adjustProductQuantity(primaryProduct, secondaryProduct, orderQuantity);
  }

  #findNoPromotionProduct(productName) {
    return this.#productsInformation.find((product) => product.name === productName && product.promotion === 'null');
  }

  #findPromotionProduct(productName) {
    return this.#productsInformation.find((product) => product.name === productName && product.promotion !== 'null');
  }

  // 메인에서 차감했을 때, 품목이 남은 경우 나머지 재고에서 차감
  #adjustProductQuantity(primaryProduct, secondaryProduct, orderQuantity) {
    const remainQuantity = orderQuantity - primaryProduct.quantity;
    primaryProduct.quantity -= orderQuantity - Math.max(remainQuantity, 0);
    if (remainQuantity > 0) {
      secondaryProduct.quantity -= remainQuantity;
    }
  }

  getProductsName() {
    return this.#productsInformation.map((product) => product.name);
  }
}
