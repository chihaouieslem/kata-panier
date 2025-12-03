import {Category} from "../shared/enums/category";

export interface ProductModel {
  readonly id: number;
  readonly productName: string;
  readonly price: number;
  readonly quantity: number;
  readonly isImported: boolean;
  readonly category: Category;
  readonly isEssentialGoods: boolean;

}