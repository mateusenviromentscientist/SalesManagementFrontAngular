import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/app/products', pathMatch: 'full' },

  {
    path: 'app',
    loadComponent: () => import('./shared/components/sideBar/sideBar.component')
      .then(m => m.SidebarComponent),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./features/products/components/product-list/product-list.component')
          .then(m => m.ProductListComponent)
      },
      {
        path: 'products/create',
        loadComponent: () => import('./features/products/components/create-product-form/create-product-form.component')
          .then(m => m.CreateProductFormComponent)
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/app/products' }
];
