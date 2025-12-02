import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from '@app/shared-lib';

@Controller()
export class ProductServiceController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('product.create')
  async handleCreateProduct(@Payload() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @MessagePattern('product.update')
  async handleUpdateProduct(@Payload() data: UpdateProductDto) {
    return this.productService.updateProduct(data);
  }

  @MessagePattern('product.findAll')
  async handleGetAllProducts() {
    return this.productService.getAllProducts();
  }

  @MessagePattern('product.findOne')
  async handleGetProductById(@Payload() id: string) {
    return this.productService.getProductById(id);
  }

  @MessagePattern('product.delete')
  async handleDeleteProduct(@Payload() id: string) {
    return this.productService.deleteProduct(id);
  }
}
