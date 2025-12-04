import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateProductDto, UpdateProductDto } from '@app/shared-lib';
import { trace, Span } from '@opentelemetry/api';

@Injectable()
export class ProductService {
  private readonly tracer = trace.getTracer('product-service');

  constructor(private readonly prisma: PrismaService) {}

  async getProductById(productId: string) {
    return this.tracer.startActiveSpan('get_product_by_id', async (span: Span) => {
      span.setAttribute('product.id', productId);
      span.addEvent('product.fetch.start');

      try {
        span.addEvent('db.query.start', { query: 'findUnique', productId });

        const product = await this.prisma.product.findUnique({
          where: { id: productId },
        });

        span.addEvent('db.query.end');

        if (!product) {
          span.addEvent('product.not_found', { productId });
          throw new NotFoundException('Product not found');
        }

        span.addEvent('product.fetch.success');
        return product;
      } catch (error) {
        span.recordException(error);
        span.addEvent('product.fetch.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('product.fetch.end');
        span.end();
      }
    });
  }

  async createProduct(data: CreateProductDto) {
    return this.tracer.startActiveSpan('create_product', async (span: Span) => {
      span.setAttribute('product.name', data.name);
      span.addEvent('product.create.start');

      try {
        // Check duplicate
        span.addEvent('db.query.start', { query: 'findFirst', name: data.name });

        const existing = await this.prisma.product.findFirst({
          where: { name: data.name },
        });

        span.addEvent('db.query.end');

        if (existing) {
          span.addEvent('validation.failed', { reason: 'duplicate_name', name: data.name });
          throw new ConflictException('Product with this name already exists');
        }

        // Create
        span.addEvent('db.query.start', { query: 'create_product' });

        const product = await this.prisma.product.create({ data });

        span.addEvent('db.query.end');

        span.addEvent('product.created', { id: product.id });
        return product;
      } catch (error) {
        span.recordException(error);
        span.addEvent('product.create.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('product.create.end');
        span.end();
      }
    });
  }

  async updateProduct(data: UpdateProductDto) {
    return this.tracer.startActiveSpan('update_product', async (span: Span) => {
      span.setAttribute('product.id', data.id);
      span.addEvent('product.update.start');

      try {
        // Check existence
        span.addEvent('db.query.start', { query: 'findUnique', id: data.id });

        const existingProduct = await this.prisma.product.findUnique({
          where: { id: data.id },
        });

        span.addEvent('db.query.end');

        if (!existingProduct) {
          span.addEvent('product.not_found', { id: data.id });
          throw new NotFoundException('Product not found');
        }

        const { id, ...updateData } = data;

        span.addEvent('db.query.start', { query: 'update', id });

        const updated = await this.prisma.product.update({
          where: { id },
          data: updateData,
        });

        span.addEvent('db.query.end');

        span.addEvent('product.updated', { id });

        return updated;
      } catch (error) {
        span.recordException(error);
        span.addEvent('product.update.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('product.update.end');
        span.end();
      }
    });
  }

  async deleteProduct(productId: string) {
    return this.tracer.startActiveSpan('delete_product', async (span: Span) => {
      span.setAttribute('product.id', productId);
      span.addEvent('product.delete.start');

      try {
        // Check
        span.addEvent('db.query.start', { query: 'findUnique', id: productId });

        const existingProduct = await this.prisma.product.findUnique({
          where: { id: productId },
        });

        span.addEvent('db.query.end');

        if (!existingProduct) {
          span.addEvent('product.not_found', { productId });
          throw new NotFoundException('Product not found');
        }

        // Delete
        span.addEvent('db.query.start', { query: 'delete', id: productId });

        const deleted = await this.prisma.product.delete({
          where: { id: productId },
        });

        span.addEvent('db.query.end');

        span.addEvent('product.deleted', { productId });

        return deleted;
      } catch (error) {
        span.recordException(error);
        span.addEvent('product.delete.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('product.delete.end');
        span.end();
      }
    });
  }

  async getAllProducts() {
    return this.tracer.startActiveSpan('get_all_products', async (span: Span) => {
      span.addEvent('products.fetch_all.start');

      try {
        span.addEvent('db.query.start', { query: 'findMany' });

        const products = await this.prisma.product.findMany();

        span.addEvent('db.query.end');
        span.addEvent('products.fetch_all.success', { count: products.length });

        return products;
      } catch (error) {
        span.recordException(error);
        span.addEvent('products.fetch_all.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('products.fetch_all.end');
        span.end();
      }
    });
  }
}
