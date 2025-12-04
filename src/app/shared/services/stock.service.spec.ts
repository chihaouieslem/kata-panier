import { StockService } from './stock.service';
import { MOCK_PRODUCTS } from '../../mock-response/mock-products';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    service = new StockService();
    service.resetStock();
  });

  it('should initialize stock correctly', () => {
    MOCK_PRODUCTS.forEach(product => {
      expect(service.getAvailableQuantity(product.id)).toBe(product.quantity);
    });
  });

  it('should reserve stock if available', () => {
    const product = MOCK_PRODUCTS[0];
    const result = service.reserveStock(product.id, 2);
    expect(result).toBeTrue();
    expect(service.getAvailableQuantity(product.id)).toBe(product.quantity - 2);
  });

  it('should not reserve stock if not enough', () => {
    const product = MOCK_PRODUCTS[0];
    const result = service.reserveStock(product.id, product.quantity + 1);
    expect(result).toBeFalse();
    expect(service.getAvailableQuantity(product.id)).toBe(product.quantity);
  });

  it('should release stock', () => {
    const product = MOCK_PRODUCTS[0];
    service.reserveStock(product.id, 2);
    service.releaseStock(product.id, 2);
    expect(service.getAvailableQuantity(product.id)).toBe(product.quantity);
  });

  it('should not exceed original quantity when releasing', () => {
    const product = MOCK_PRODUCTS[0];
    service.releaseStock(product.id, 100);
    expect(service.getAvailableQuantity(product.id)).toBe(product.quantity);
  });
});
