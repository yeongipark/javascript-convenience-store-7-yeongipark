export default class Order {
  #orderObject;
  #discount;

  // {콜라 : 5, 사이다 : 3}
  constructor(orderObject) {
    this.#orderObject = orderObject;
    this.#discount = 0;
  }

  getOrderList() {
    return Object.entries(this.#orderObject);
  }

  getDiscount() {
    return this.#discount;
  }

  setDiscount(discount) {
    this.#discount = discount;
  }

  increaseOrderQuantity(orderProduct, quantity) {
    this.#orderObject[orderProduct] += quantity;
  }

  decreaseOrderQuantity(orderProduct, quantity) {
    this.#orderObject[orderProduct] -= quantity;
  }
}
