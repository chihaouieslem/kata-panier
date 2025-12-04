import { CartService } from './cart.service';
import { StockService } from './stock.service';
import { ProductModel } from '../../model/product-model';
import { Category } from '../enums/category';

describe('CartService', () => {
  let cartService: CartService;
  let stockService: StockService;
  const product: ProductModel = {
    id: 1,
    productName: 'Test',
    price: 10,
    quantity: 5,
    isImported: false,
    category: Category.Food,
    isEssentialGoods: true
  };

  beforeEach(() => {
    stockService = new StockService();
    cartService = new CartService(stockService);
    stockService.resetStock();
  });

  it('should add product to cart', () => {
    const result = cartService.addToCart(product, 2, 12);
    expect(result).toBeTrue();
    expect(cartService.getCartCount()).toBe(2);
  });

  it('should not add product if not enough stock', () => {
    const result = cartService.addToCart(product, 10, 12);
    expect(result).toBeFalse();
    expect(cartService.getCartCount()).toBe(0);
  });

  it('should remove product from cart', () => {
    cartService.addToCart(product, 2, 12);
    cartService.removeFromCart(product.id);
    expect(cartService.getCartCount()).toBe(0);
  });

  it('should update quantity in cart', () => {
    cartService.addToCart(product, 2, 12);
    const updated = cartService.updateQuantity(product.id, 3);
    expect(updated).toBeTrue();
    expect(cartService.getProductQuantityInCart(product.id)).toBe(3);
  });

  it('should not update quantity if not enough stock', () => {
    cartService.addToCart(product, 2, 12);
    const updated = cartService.updateQuantity(product.id, 10);
    expect(updated).toBeFalse();
    expect(cartService.getProductQuantityInCart(product.id)).toBe(2);
  });

  it('should clear cart', () => {
    cartService.addToCart(product, 2, 12);
    cartService.clearCart();
    expect(cartService.getCartCount()).toBe(0);
  });
});
