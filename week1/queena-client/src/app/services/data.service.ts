import { Injectable } from '@angular/core';
import { Product } from '../models/product.model'
import { PRODUCTS } from '../mock-products';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  products: Product[] = PRODUCTS;

  constructor() { }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: number): Product {
    return this.products.find( (product) => product.id === id);
  }

  addProduct(product: Product) {
    product.id = this.products.length + 1;
    this.products.push(product);
  }
}
