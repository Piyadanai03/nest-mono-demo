import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, LoginUserDto, UpdateProfileDto, CreateProductDto, UpdateProductDto } from '@app/shared-lib';

@Injectable()
export class ApiGatewayService {
  private readonly authServiceUrl: string;
  private readonly productServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3002';
    this.productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL') || 'http://localhost:3003';
  }

  private async makeRequest(method: 'get' | 'post' | 'patch' | 'delete', url: string, data?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService[method](url, data)
      );
      return response.data;
    } catch (error) {
      console.error(`Error calling ${url}:`, error.message);
      
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('Service unavailable', HttpStatus.BAD_GATEWAY);
    }
  }

  //Auth Service
  async register(data: CreateUserDto) {
    return this.makeRequest('post', `${this.authServiceUrl}/auth/register`, data);
  }
  async login(data: LoginUserDto) {
    return this.makeRequest('post', `${this.authServiceUrl}/auth/login`, data);
  }
  async updateProfile(data: UpdateProfileDto) {
    return this.makeRequest('patch', `${this.authServiceUrl}/auth/profile`, data);
  }
  
  // Product Service
  async createProduct(data: CreateProductDto) {
    return this.makeRequest('post', `${this.productServiceUrl}/products`, data);
  }

  async findAllProducts() {
    return this.makeRequest('get', `${this.productServiceUrl}/products`);
  }

  async findOneProduct(id: string) {
    return this.makeRequest('get', `${this.productServiceUrl}/products/${id}`);
  }

  async updateProduct(data: UpdateProductDto) {
    const { id, ...updateData } = data;
    return this.makeRequest('patch', `${this.productServiceUrl}/products/${id}`, updateData);
  }

  async deleteProduct(id: string) {
    return this.makeRequest('delete', `${this.productServiceUrl}/products/${id}`);
  }
}