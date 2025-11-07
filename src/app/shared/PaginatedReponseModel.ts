import { Product } from "../features/products/models/GetProductModel";
import { PaginatedList } from "./PaginatedListModel";

export interface PaginatedResponse<T> {
  data: PaginatedList<T>;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}
