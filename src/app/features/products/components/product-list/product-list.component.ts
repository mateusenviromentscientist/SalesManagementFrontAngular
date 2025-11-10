import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, map, takeUntil, take } from 'rxjs';
import { Product } from '../../models/GetProductModel';
import { ProductService } from '../../ProductService';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, 
    MatProgressSpinnerModule, MatButtonModule, RouterLink, MatIconModule],
})
export class ProductListComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['title', 'price', 'description', 'category', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  private readonly destroy$ = new Subject<void>();

  pageSize = 2;
  pageIndex = 0; 
  total = 0;      

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {

    this.loadPage(this.pageIndex, this.pageSize);

    Promise.resolve().then(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  loadPage(index: number, size: number) {
    const apiPage = index + 1;
    this.productService.getProductsAsync(apiPage, size)
      .pipe(
        map((res: any) => {
          this.total = res?.data?.totalCount ?? this.total;
          return (res?.data?.data ?? []).flat();
        }),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: items => {
          this.dataSource.data = items;
          this.cdr.detectChanges();
        },
        error: err => console.error('Erro ao carregar produtos:', err),
      });
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadPage(this.pageIndex, this.pageSize);
  }

  editProduct(product: Product) {
  console.log('Edit clicked:', product);
  // navigate to form OR open dialog
  // this.router.navigate(['/edit', product.id]);
}

removeProduct(product: Product) {
  Swal.fire({
    title: 'Remove product?',
    text: `Are you sure you want to remove "${product.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.productService.removeProductAsync(product.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Removed!',
            text: `"${product.title}" has been removed.`,
            timer: 1800,
            showConfirmButton: false
          });
          this.dataSource.data = this.dataSource.data.filter(p => p.id !== product.id);
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong when removing the product.'
          });
        }
      });
    }
  });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById = (_: number, item: Product) => item.id ?? item.code;
}
