import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from '../../models/product.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

	product: Product;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
      this.product = this.dataService.getProduct(+params['id']);
    })
  }

}
