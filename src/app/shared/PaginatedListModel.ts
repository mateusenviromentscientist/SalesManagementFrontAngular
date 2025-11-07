import { Product } from "../features/products/models/GetProductModel";

export interface PaginatedList<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}