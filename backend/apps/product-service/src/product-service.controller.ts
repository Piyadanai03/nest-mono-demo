import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product-service.service';
import { CreateProductDto, UpdateProductDto } from '@app/shared-lib';

@Controller('products')
export class ProductServiceController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Get()
  findAll() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productService.updateProduct({ ...data, id });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}