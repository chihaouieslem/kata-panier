import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { MOCK_PRODUCTS } from '../../mock-response/mock-products';
import { take } from 'rxjs/operators';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all products', (done) => {
    service.getProducts().pipe(take(1)).subscribe(products => {
      expect(products.length).toBe(MOCK_PRODUCTS.length);
      expect(products).toEqual(MOCK_PRODUCTS);
      done();
    });
  });


  it('should return a product by ID', (done) => {
    const id = MOCK_PRODUCTS[0].id;

    service.getProductById(id).pipe(take(1)).subscribe(product => {
      expect(product).toEqual(MOCK_PRODUCTS[0]);
      done();
    });
  });

  it('should return undefined if product not found', (done) => {
    service.getProductById(9999).pipe(take(1)).subscribe(product => {
      expect(product).toBeUndefined();
      done();
    });
  });

  it('should filter products by category', (done) => {
    const category = MOCK_PRODUCTS[0].category;
    const expected = MOCK_PRODUCTS.filter(p => p.category === category);

    service.getProductsByCategory(category).pipe(take(1)).subscribe(products => {
      expect(products).toEqual(expected);
      expect(products.every(p => p.category === category)).toBeTrue();
      done();
    });
  });

  it('should return empty array if no product matches category', (done) => {
    service.getProductsByCategory('CATEGORY_THAT_DOES_NOT_EXIST')
      .pipe(take(1))
      .subscribe(products => {
        expect(products.length).toBe(0);
        done();
      });
  });
});
