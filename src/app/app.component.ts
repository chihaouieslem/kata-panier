import { Component, OnInit } from '@angular/core';
import { CartService } from './shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kata-panier';
  cartCount = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = this.cartService.getCartCount();
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
