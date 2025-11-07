import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Subject, map, takeUntil, take } from 'rxjs';
import { Product } from '../../models/GetProductModel';
import { ProductService } from '../../ProductService';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, 
    MatProgressSpinnerModule, MatButtonModule, RouterLink],
})
export class ProductListComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['title', 'price', 'description', 'category'];
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById = (_: number, item: Product) => item.id ?? item.code;
}
