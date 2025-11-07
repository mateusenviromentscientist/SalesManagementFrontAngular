import { Rating } from './Rating';

export interface Product
{
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  image: string;
  price: number;
  rating: Rating;
  saleItems: any[];
}