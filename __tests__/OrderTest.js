import Order from '../src/model/Order';

describe('Order 클래스 테스트', () => {
  const orderObject = { 콜라: 5, 사이다: 5, 물: 3 };
  let order;
  beforeEach(() => {
    order = new Order({ ...orderObject });
  });

  test('주문 리스트 반환하기', () => {
    expect(order.getOrderList()).toEqual([
      ['콜라', 5],
      ['사이다', 5],
      ['물', 3],
    ]);
  });

  test.each([[5000], [3000], [8000]])('할인율 적용하기', (discount) => {
    order.setDiscount(discount);
    expect(order.getDiscount()).toEqual(discount);
  });

  test.each([
    ['콜라', 1, 6],
    ['콜라', 2, 7],
    ['사이다', 5, 10],
    ['물', 1, 4],
  ])('%s 상품 구매 갯수 증가시키기', (name, increaseQuantity, expected) => {
    order.increaseOrderQuantity(name, increaseQuantity);
    const parsedOrderObject = { ...orderObject, [name]: expected };
    expect(order.getOrderList()).toEqual(Object.entries(parsedOrderObject));
  });

  test.each([
    ['콜라', 1, 4],
    ['콜라', 2, 3],
    ['사이다', 5, 0],
    ['물', 1, 2],
  ])('%s 상품 구매 갯수 감소시키기', (name, decreaseQuantity, expected) => {
    order.decreaseOrderQuantity(name, decreaseQuantity);
    const parsedOrderObject = { ...orderObject, [name]: expected };
    expect(order.getOrderList()).toEqual(Object.entries(parsedOrderObject));
  });
});
