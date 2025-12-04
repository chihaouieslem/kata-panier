import { ProductService } from './product.service';
import { Category } from '../enums/category';
import { MOCK_PRODUCTS } from '../../mock-response/mock-products';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
  });

  it('should return all products', (done) => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(MOCK_PRODUCTS.length);
      done();
    });
  });

  it('should return product by id', (done) => {
    const id = MOCK_PRODUCTS[0].id;
    service.getProductById(id).subscribe(product => {
      expect(product?.id).toBe(id);
      done();
    });
  });

  it('should return products by category', (done) => {
    const category = MOCK_PRODUCTS[0].category;
    service.getProductsByCategory(category).subscribe(products => {
      expect(products.every(p => p.category === category)).toBeTrue();
      done();
    });
  });
});
