import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModel } from '../../model/product-model';
import { StockService } from './stock.service';

export interface CartItem {
  product: ProductModel;
  quantity: number;
  priceTTC: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor(private stockService: StockService) {}

  /**
   * Vérifier si la quantité demandée est disponible
   */
  canAddToCart(productId: number, quantity: number): boolean {
    const available = this.stockService.getAvailableQuantity(productId);
    return available >= quantity;
  }

  /**
   * Ajouter un produit au panier
   */
  addToCart(product: ProductModel, quantity: number, priceTTC: number): boolean {
    if (!this.canAddToCart(product.id, quantity)) {
      return false;
    }

    // Réserver le stock
    if (!this.stockService.reserveStock(product.id, quantity)) {
      return false;
    }

    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        product,
        quantity,
        priceTTC
      });
    }

    this.cartSubject.next([...this.cartItems]);
    return true;
  }

  /**
   * Retirer un produit du panier
   */
  removeFromCart(productId: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      // Libérer le stock
      this.stockService.releaseStock(productId, item.quantity);
      this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
      this.cartSubject.next([...this.cartItems]);
    }
  }

  /**
   * Mettre à jour la quantité d'un produit
   */
  updateQuantity(productId: number, newQuantity: number): boolean {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (!item) return false;

    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return true;
    }

    const difference = newQuantity - item.quantity;

    if (difference > 0) {
      // Augmentation: vérifier la disponibilité
      if (!this.canAddToCart(productId, difference)) {
        return false;
      }
      // Réserver le stock supplémentaire
      this.stockService.reserveStock(productId, difference);
    } else if (difference < 0) {
      // Diminution: libérer le stock
      this.stockService.releaseStock(productId, Math.abs(difference));
    }

    item.quantity = newQuantity;
    this.cartSubject.next([...this.cartItems]);
    return true;
  }

  /**
   * Récupérer la quantité totale d'un produit dans le panier
   */
  getProductQuantityInCart(productId: number): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Récupérer tous les articles du panier
   */
  getCart(): CartItem[] {
    return [...this.cartItems];
  }

  /**
   * Récupérer le nombre total d'articles
   */
  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Calculer le total du panier
   */
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.priceTTC * item.quantity), 0);
  }

  /**
   * Calculer la TVA totale
   */
  getTotalTax(): number {
    return this.cartItems.reduce((total, item) => {
      const taxPerUnit = item.priceTTC - item.product.price;
      return total + (taxPerUnit * item.quantity);
    }, 0);
  }

  /**
   * Vider le panier
   */
  clearCart(): void {
    this.cartItems.forEach(item => {
      this.stockService.releaseStock(item.product.id, item.quantity);
    });
    this.cartItems = [];
    this.cartSubject.next([]);
  }
}
