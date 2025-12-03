import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateProductDto, UpdateProductDto } from '@app/shared-lib';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async createProduct(data: CreateProductDto) {
    const existing = await this.prisma.product.findFirst({
      where: { name: data.name },
    });
    if (existing) {
      throw new ConflictException('Product with this name already exists');
    }
    return this.prisma.product.create({ data });
  }

  async updateProduct(data: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: data.id },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const { id, ...updateData } = data;
    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteProduct(productId: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany();
  }
}
