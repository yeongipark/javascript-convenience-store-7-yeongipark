import Products from '../src/model/Products';

describe('Products 클레스 테스트', () => {
  let products;
  const productsInformation = [
    { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
    { name: '콜라', price: 1000, quantity: 10, promotion: 'null' },
    { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
    { name: '사이다', price: 1000, quantity: 7, promotion: 'null' },
    { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
    { name: '오렌지주스', price: 1800, quantity: 0, promotion: 'null' },
    { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
    { name: '탄산수', price: 1200, quantity: 0, promotion: 'null' },
    { name: '물', price: 500, quantity: 10, promotion: 'null' },
    { name: '비타민워터', price: 1500, quantity: 6, promotion: 'null' },
    { name: '감자칩', price: 1500, quantity: 5, promotion: '반짝할인' },
    { name: '감자칩', price: 1500, quantity: 5, promotion: 'null' },
    { name: '초코바', price: 1200, quantity: 5, promotion: 'MD추천상품' },
    { name: '초코바', price: 1200, quantity: 5, promotion: 'null' },
    { name: '에너지바', price: 2000, quantity: 5, promotion: 'null' },
    { name: '정식도시락', price: 6400, quantity: 8, promotion: 'null' },
    { name: '컵라면', price: 1700, quantity: 1, promotion: 'MD추천상품' },
    { name: '컵라면', price: 1700, quantity: 10, promotion: 'null' },
  ];
  beforeEach(async () => {
    products = new Products();
    await products.init();
  });

  test('파싱된 파일 내용 가져오기', () => {
    expect(products.getProductsInformation()).toEqual(productsInformation);
  });

  test.each([
    ['콜라', 1000],
    ['물', 500],
    ['컵라면', 1700],
    ['정식도시락', 6400],
    ['초코바', 1200],
    ['에너지바', 2000],
  ])('%s 상품 의 가격 반환', (product, expectedPrice) => {
    expect(products.getProductPrice(product)).toEqual(expectedPrice);
  });

  test.each([
    ['콜라', '탄산2+1'],
    ['초코바', 'MD추천상품'],
    ['사이다', '탄산2+1'],
    ['에너지바', null],
    ['정식도시락', null],
  ])('%s의 프로모션 정보 가져오기', (product, promotion) => {
    expect(products.getProductPromotion(product)).toEqual(promotion);
  });

  test.each([
    ['콜라', true, 20],
    ['사이다', false, 7],
    ['물', false, 10],
    ['정식도시락', false, 8],
  ])('%s 총 재고 수(프로모션 + 일반) 반환하기', (productName, isPromotion, expected) => {
    expect(products.getProductQuantity(productName, isPromotion)).toEqual(expected);
  });

  test('상품 주문 갯수만큼 수량 차감하기, 프로모션인 경우 프로모션 먼저 차감, 프로모션 상품 아닌 경우 일반 재고부터 차감', () => {
    products.reduceProductQuantity('콜라', 15, false);
    products.reduceProductQuantity('사이다', 14, true);
    products.reduceProductQuantity('감자칩', 6, false);
    products.reduceProductQuantity('물', 5, false);
    products.reduceProductQuantity('정식도시락', 4, false);
    expect(products.getProductsInformation()).toEqual([
      { name: '콜라', price: 1000, quantity: 5, promotion: '탄산2+1' },
      { name: '콜라', price: 1000, quantity: 0, promotion: 'null' },
      { name: '사이다', price: 1000, quantity: 0, promotion: '탄산2+1' },
      { name: '사이다', price: 1000, quantity: 1, promotion: 'null' },
      { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
      { name: '오렌지주스', price: 1800, quantity: 0, promotion: 'null' },
      { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
      { name: '탄산수', price: 1200, quantity: 0, promotion: 'null' },
      { name: '물', price: 500, quantity: 5, promotion: 'null' },
      { name: '비타민워터', price: 1500, quantity: 6, promotion: 'null' },
      { name: '감자칩', price: 1500, quantity: 4, promotion: '반짝할인' },
      { name: '감자칩', price: 1500, quantity: 0, promotion: 'null' },
      { name: '초코바', price: 1200, quantity: 5, promotion: 'MD추천상품' },
      { name: '초코바', price: 1200, quantity: 5, promotion: 'null' },
      { name: '에너지바', price: 2000, quantity: 5, promotion: 'null' },
      { name: '정식도시락', price: 6400, quantity: 4, promotion: 'null' },
      { name: '컵라면', price: 1700, quantity: 1, promotion: 'MD추천상품' },
      { name: '컵라면', price: 1700, quantity: 10, promotion: 'null' },
    ]);
  });

  test.each([
    ['콜라', 10],
    ['사이다', 8],
    ['탄산수', 5],
    ['컵라면', 1],
  ])('프로모션 상품 재고 가져오기', (product, expected) => {
    expect(products.getPromotionProductQuantity(product)).toEqual(expected);
  });

  test('상품 이름들 가져오기', () => {
    const names = productsInformation.map((product) => product.name);
    expect(products.getProductsName()).toEqual(names);
  });
});
