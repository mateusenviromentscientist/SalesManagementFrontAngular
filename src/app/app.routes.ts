import { Routes } from '@angular/router';

export const routes: Routes = [
    
    { path: 'products', loadComponent: () =>
    import('./features/products/components/product-list/product-list.component')
      .then(m => m.ProductListComponent) },

    { path: 'products/create', loadComponent: () =>
    import('./features/products/components/create-product-form/create-product-form.component')
      .then(m => m.CreateProductFormComponent) }
];
