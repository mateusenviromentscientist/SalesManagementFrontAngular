export interface CreateProductModel{
    code: string;
    title: string;
    price: number;
    description: string;
    category: string;
    image?: File | null;
    rate?: number | null;
    count?: number | null;
}