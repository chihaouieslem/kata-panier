import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './feature/product/product.component';
import { CartComponent } from './feature/cart/cart.component';
// import { ProductCardComponent } from './product/product-card/product-card.component';
// Uncomment and fix the path below if the file exists, or create the file if missing.
// import { ProductCardComponent } from './../product/product-card/product-card.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    component: ProductComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
