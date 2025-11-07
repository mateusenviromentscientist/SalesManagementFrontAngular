// src/app/products/product-form/product-form.component.ts
import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../ProductService';
import { CreateProductModel } from '../../models/CreateProductModel';
import { HttpEventType } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'create-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule, MatIconModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './create-product-form.component.html',
  styleUrls: ['./create-product-form.component.scss']
})
export class CreateProductFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private router = inject(Router);

  uploading = false;
  progress = 0;

  form = this.fb.group({
    code: ['', Validators.required],
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    category: [''],
    rate: [null],
    count: [null],
    image: [null as File | null]
  });

  onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.form.patchValue({ image: file });
  }

  submit() {

    if (this.form.invalid) return;

    this.uploading = true;
    this.progress = 0;

    const dto = this.form.value as CreateProductModel;

    this.service.createProductAsync(dto).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress = Math.round((event.loaded / event.total) * 100);
        }
        if (event.type === HttpEventType.Response) {
          this.uploading = false;
          this.router.navigate(['/products']);
        }
      },
      error: () => {
        this.uploading = false;
      }
    });
  }

  hasError(control: string, error: string) {
    const c = this.form.get(control);
    return !!c && c.touched && c.hasError(error);
  }
}
