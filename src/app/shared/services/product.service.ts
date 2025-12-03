import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductModel } from '../../model/product-model';
import { MOCK_PRODUCTS } from '../../mock-response/mock-products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  /**
   * Get all products from mock API response
   * @returns Observable of ProductModel array
   */
  getProducts(): Observable<ProductModel[]> {
    return of(MOCK_PRODUCTS);
  }

  /**
   * Get a single product by ID
   * @param id Product ID
   * @returns Observable of ProductModel
   */
  getProductById(id: number): Observable<ProductModel | undefined> {
    return of(MOCK_PRODUCTS.find(product => product.id === id));
  }

  /**
   * Get products filtered by category
   * @param category Category name
   * @returns Observable of filtered ProductModel array
   */
  getProductsByCategory(category: string): Observable<ProductModel[]> {
    return of(MOCK_PRODUCTS.filter(product => product.category === category));
  }
}
