import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, LoginUserDto, UpdateProfileDto, CreateProductDto, UpdateProductDto } from '@app/shared-lib';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private clientAuth: ClientProxy,
    @Inject('PRODUCT_SERVICE') private clientProduct: ClientProxy,
  ) {}

  register(data: CreateUserDto) {
    return this.clientAuth.send('auth.register', data);
  }
  login(data: LoginUserDto) {
    return this.clientAuth.send('auth.login', data);
  }
  updateProfile(data: UpdateProfileDto) {
    return this.clientAuth.send('auth.updateProfile', data);
  }

  createProduct(data: CreateProductDto) {
    return this.clientProduct.send('product.create', data);
  }

  findAllProducts() {
    return this.clientProduct.send('product.findAll', {});
  }

  findOneProduct(id: string) {
    return this.clientProduct.send('product.findOne', id);
  }

  updateProduct(data: UpdateProductDto) {
    return this.clientProduct.send('product.update', data);
  }

  deleteProduct(id: string) {
    return this.clientProduct.send('product.delete', id);
  }
}