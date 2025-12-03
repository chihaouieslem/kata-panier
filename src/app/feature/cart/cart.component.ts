import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../shared/services/cart.service';
import { StockService } from '../../shared/services/stock.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  totalTax: number = 0;
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.updateTotals();
    });
  }

  updateTotals(): void {
    this.cartTotal = this.cartService.getCartTotal();
    this.totalTax = this.cartService.getTotalTax();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.errorMessage = '';
  }

  updateQuantity(productId: number, quantity: number): void {
    const numQuantity = Number(quantity);
    
    if (isNaN(numQuantity) || numQuantity < 0) {
      this.errorMessage = 'Quantité invalide';
      return;
    }

    const success = this.cartService.updateQuantity(productId, numQuantity);
    
    if (success) {
      this.errorMessage = '';
    } else {
      const available = this.stockService.getAvailableQuantity(productId);
      this.errorMessage = `Quantité maximale disponible: ${available}`;
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.errorMessage = '';
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getAvailableQuantity(productId: number): number {
    return this.stockService.getAvailableQuantity(productId);
  }

  getTaxPerItem(item: CartItem): number {
    return (item.priceTTC - item.product.price);
  }
}
