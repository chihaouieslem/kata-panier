import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { StockService } from './stock.service';
import { ProductModel } from '../../model/product-model';
import { Category } from '../enums/category';

describe('CartService', () => {
  let service: CartService;
  let stockService: jasmine.SpyObj<StockService>;

  const product: ProductModel = {
    id: 1,
    productName: 'Livre',
    price: 10,
    quantity: 10,
    isEssentialGoods: false,
    category: Category.Books,
    isImported: false
  };

  beforeEach(() => {
    const stockSpy = jasmine.createSpyObj('StockService', [
      'getAvailableQuantity',
      'reserveStock',
      'releaseStock'
    ]);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: StockService, useValue: stockSpy }
      ]
    });

    service = TestBed.inject(CartService);
    stockService = TestBed.inject(StockService) as jasmine.SpyObj<StockService>;
  });


  it('should allow adding when stock is available', () => {
    stockService.getAvailableQuantity.and.returnValue(5);
    expect(service.canAddToCart(1, 3)).toBeTrue();
  });

  it('should reject adding when stock is insufficient', () => {
    stockService.getAvailableQuantity.and.returnValue(1);
    expect(service.canAddToCart(1, 3)).toBeFalse();
  });


  it('should add product to cart when stock OK', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    const added = service.addToCart(product, 2, 12);

    expect(added).toBeTrue();
    expect(service.getCart().length).toBe(1);
    expect(service.getCart()[0].quantity).toBe(2);
  });

  it('should NOT add product when reserveStock fails', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(false);

    const added = service.addToCart(product, 2, 12);

    expect(added).toBeFalse();
    expect(service.getCart().length).toBe(0);
  });

  
  it('should remove product and release stock', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 2, 12);
    service.removeFromCart(1);

    expect(service.getCart().length).toBe(0);
    expect(stockService.releaseStock).toHaveBeenCalledWith(1, 2);
  });


  it('should increase quantity when stock is sufficient', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 1, 12);

    stockService.getAvailableQuantity.and.returnValue(10);
    service.updateQuantity(1, 3);

    expect(service.getCart()[0].quantity).toBe(3);
  });

  it('should decrease quantity and release stock', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 3, 12);
    service.updateQuantity(1, 1);

    expect(service.getCart()[0].quantity).toBe(1);
    expect(stockService.releaseStock).toHaveBeenCalledWith(1, 2);
  });

  it('should remove product when quantity becomes 0', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 3, 12);

    service.updateQuantity(1, 0);

    expect(service.getCart().length).toBe(0);
  });

  it('should return total number of items in cart', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 2, 12);
    expect(service.getCartCount()).toBe(2);
  });

  it('should compute cart total TTC', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 2, 12);
    expect(service.getCartTotal()).toBe(24);
  });

  it('should compute total tax', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 2, 12); 
    expect(service.getTotalTax()).toBe(4);
  });

  it('should clear cart and release all stock', () => {
    stockService.getAvailableQuantity.and.returnValue(10);
    stockService.reserveStock.and.returnValue(true);

    service.addToCart(product, 2, 12);
    service.clearCart();

    expect(service.getCart().length).toBe(0);
    expect(stockService.releaseStock).toHaveBeenCalledWith(1, 2);
  });
});
