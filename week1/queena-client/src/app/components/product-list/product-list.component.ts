import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

	products: Product[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
  	this.getProducts();
  }

  getProducts(){
  	this.products = this.dataService.getProducts();
  }

}
