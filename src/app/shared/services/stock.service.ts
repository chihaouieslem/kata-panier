import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MOCK_PRODUCTS } from '../../mock-response/mock-products';
import { ProductModel } from '../../model/product-model';

export interface AvailableStock {
  [productId: number]: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private availableStock: AvailableStock = {};
  private stockSubject = new BehaviorSubject<AvailableStock>({});
  public stock$ = this.stockSubject.asObservable();

  constructor() {
    this.initializeStock();
  }

  /**
   * Initialiser le stock initial
   */
  private initializeStock(): void {
    MOCK_PRODUCTS.forEach(product => {
      this.availableStock[product.id] = product.quantity;
    });
    this.stockSubject.next({ ...this.availableStock });
  }

  /**
   * Obtenir la quantité disponible d'un produit
   */
  getAvailableQuantity(productId: number): number {
    return this.availableStock[productId] ?? 0;
  }

  /**
   * Déduire la quantité du stock
   */
  reserveStock(productId: number, quantity: number): boolean {
    const available = this.availableStock[productId] ?? 0;
    
    if (available >= quantity) {
      this.availableStock[productId] = available - quantity;
      this.stockSubject.next({ ...this.availableStock });
      return true;
    }
    return false;
  }

  /**
   * Ajouter la quantité au stock (remise en panier)
   */
  releaseStock(productId: number, quantity: number): void {
    const current = this.availableStock[productId] ?? 0;
    const originalQuantity = MOCK_PRODUCTS.find(p => p.id === productId)?.quantity ?? 0;
    
    this.availableStock[productId] = Math.min(current + quantity, originalQuantity);
    this.stockSubject.next({ ...this.availableStock });
  }

  /**
   * Réinitialiser le stock
   */
  resetStock(): void {
    this.initializeStock();
  }

  /**
   * Obtenir le stock complet
   */
  getFullStock(): AvailableStock {
    return { ...this.availableStock };
  }
}
