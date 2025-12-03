import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../../model/product-model';
import { Category } from '../../shared/enums/category';
import { CartService } from '../../shared/services/cart.service';
import { StockService } from '../../shared/services/stock.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductModel;
  quantity: number = 1;
  errorMessage: string = '';
  availableQuantity: number = 0;

  constructor(
    private cartService: CartService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    // Initialiser la quantité disponible
    this.availableQuantity = this.stockService.getAvailableQuantity(this.product.id);
    
    // S'abonner aux changements de stock
    this.stockService.stock$.subscribe(() => {
      this.availableQuantity = this.stockService.getAvailableQuantity(this.product.id);
    });
  }

  getPriceTTC(product: ProductModel): number {
    let tvaRate = 0;
    switch (product.category) {
      case Category.Food:
      case Category.Medecine:
        tvaRate = 0;
        break;
      case Category.Books:
        tvaRate = 10;
        break;
      default:
        tvaRate = 20;
        break;
    }

    const importRate = product.isImported ? 5 : 0;
    const rawTva = product.price * tvaRate / 100;
    const rawImport = product.price * importRate / 100;
    const roundTax = (tax: number) => Math.ceil(tax * 20) / 20;

    const tva = roundTax(rawTva);
    const importTax = roundTax(rawImport);

    return product.price + tva + importTax;
  }

  addToCart(): void {
    this.errorMessage = '';
    
    if (this.availableQuantity === 0) {
      this.errorMessage = 'Produit en rupture de stock';
      return;
    }

    if (this.quantity > this.availableQuantity) {
      this.errorMessage = `Quantité maximale disponible: ${this.availableQuantity}`;
      return;
    }

    const priceTTC = this.getPriceTTC(this.product);
    const success = this.cartService.addToCart(this.product, this.quantity, priceTTC);

    if (success) {
      this.errorMessage = '';
      this.quantity = 1;
    } else {
      const remaining = this.availableQuantity;
      this.errorMessage = `Seulement ${remaining} article(s) disponible(s)`;
    }
  }

  increaseQty(): void {
    if (this.quantity < this.availableQuantity) {
      this.quantity++;
      this.errorMessage = '';
    } else {
      this.errorMessage = `Quantité maximale: ${this.availableQuantity}`;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.errorMessage = '';
    }
  }
}
