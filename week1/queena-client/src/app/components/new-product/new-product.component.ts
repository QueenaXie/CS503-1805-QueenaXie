import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { DataService } from '../../services/data.service';

const DEFAULT_PRODUCT: Product = Object.freeze({
	id: 0,
	name: '',
	desc: ''
}); 

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
	newProduct: Product = Object.assign({}, DEFAULT_PRODUCT);
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

	addProduct() {
  		this.dataService.addProduct(this.newProduct);
  		this.newProduct = Object.assign({}, DEFAULT_PRODUCT);
  	}
}
