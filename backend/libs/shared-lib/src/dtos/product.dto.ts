export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export class UpdateProductDto {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}