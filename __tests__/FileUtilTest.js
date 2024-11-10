import { parseFileContent } from '../src/util/fileUtil';

describe('fileUtil 테스트', () => {
  const promotionsInformation = [
    {
      name: '탄산2+1',
      buy: '2',
      get: '1',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
    },
    {
      name: 'MD추천상품',
      buy: '1',
      get: '1',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
    },
    {
      name: '반짝할인',
      buy: '1',
      get: '1',
      start_date: '2024-11-01',
      end_date: '2024-11-30',
    },
  ];

  const productsInformation = [
    { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' },
    { name: '콜라', price: '1000', quantity: '10', promotion: 'null' },
    { name: '사이다', price: '1000', quantity: '8', promotion: '탄산2+1' },
    { name: '사이다', price: '1000', quantity: '7', promotion: 'null' },
    { name: '오렌지주스', price: '1800', quantity: '9', promotion: 'MD추천상품' },
    { name: '오렌지주스', price: '1800', quantity: '0', promotion: 'null' },
    { name: '탄산수', price: '1200', quantity: '5', promotion: '탄산2+1' },
    { name: '탄산수', price: '1200', quantity: '0', promotion: 'null' },
    { name: '물', price: '500', quantity: '10', promotion: 'null' },
    { name: '비타민워터', price: '1500', quantity: '6', promotion: 'null' },
    { name: '감자칩', price: '1500', quantity: '5', promotion: '반짝할인' },
    { name: '감자칩', price: '1500', quantity: '5', promotion: 'null' },
    { name: '초코바', price: '1200', quantity: '5', promotion: 'MD추천상품' },
    { name: '초코바', price: '1200', quantity: '5', promotion: 'null' },
    { name: '에너지바', price: '2000', quantity: '5', promotion: 'null' },
    { name: '정식도시락', price: '6400', quantity: '8', promotion: 'null' },
    { name: '컵라면', price: '1700', quantity: '1', promotion: 'MD추천상품' },
    { name: '컵라면', price: '1700', quantity: '10', promotion: 'null' },
  ];

  test('promotions.md 파일 읽기', async () => {
    const promotionsData = await parseFileContent('promotions.md');
    expect(promotionsData).toEqual(promotionsInformation);
  });

  test('products.md 파일 읽기', async () => {
    const productsData = await parseFileContent('products.md');
    expect(productsData).toEqual(productsInformation);
  });
});
