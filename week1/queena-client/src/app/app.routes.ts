import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

const routes: Routes = [

	{
		path: '',
		redirectTo: 'products',
		pathMatch: 'full'
	},
	{
		path: 'products',
		component: ProductListComponent
	},
	{
		path: 'problems/:id',
		component: ProductDetailComponent
	},
	{
		path: '**',
		redirectTo: 'products'
	}
];

export const routing = RouterModule.forRoot(routes);