import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto, UpdateProfileDto } from '@app/shared-lib';
import { trace, Span } from '@opentelemetry/api';

@Injectable()
export class AuthService {
  private readonly tracer = trace.getTracer('auth-service');
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto) {
    return this.tracer.startActiveSpan('register_user', async (span: Span) => {
      span.setAttribute('user.email', data.email);
      span.addEvent('user.register.start');
      try {
        // Check duplicate
        span.addEvent('db.query.start', {
          query: 'findUnique',
          email: data.email,
        });
        const existing = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        span.addEvent('db.query.end');
        if (existing) {
          span.addEvent('validation.failed', {
            reason: 'duplicate_email',
            email: data.email,
          });
          throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        // Create user
        span.addEvent('db.query.start', { query: 'create', email: data.email });
        const user = await this.prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            name: data.name,
            role: {
              connect: {
                name: 'user',
              },
            },
          },
        });
        span.addEvent('db.query.end');
        span.addEvent('user.register.success', { userId: user.id });
        return { id: user.id, email: user.email };
      } catch (error) {
        span.recordException(error);
        span.addEvent('user.register.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('user.register.end');
        span.end();
      }
    });
  }

  async login(data: LoginUserDto) {
    return this.tracer.startActiveSpan('login_user', async (span: Span) => {
      span.setAttribute('user.email', data.email);
      span.addEvent('user.login.start');
      try {
        // Find user
        span.addEvent('db.query.start', {
          query: 'findUnique',
          email: data.email,
        });
        const user = await this.prisma.user.findUnique({
          where: { email: data.email },
          include: { role: true },
        });
        span.addEvent('db.query.end');
        if (!user) {
          span.addEvent('validation.failed', {
            reason: 'user_not_found',
            email: data.email,
          });
          throw new UnauthorizedException('Invalid credentials');
        }
        // Verify password
        const passwordValid = await bcrypt.compare(
          data.password,
          user.password,
        );
        if (!passwordValid) {
          span.addEvent('validation.failed', {
            reason: 'invalid_password',
            email: data.email,
          });
          throw new UnauthorizedException('Invalid credentials');
        }
        // Generate JWT
        const payload = {
          sub: user.id,
          email: user.email,
          role: user.role.name,
        };
        const token = this.jwtService.sign(payload);
        span.addEvent('user.login.success', { userId: user.id });
        return { accessToken: token };
      } catch (error) {
        span.recordException(error);
        span.addEvent('user.login.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('user.login.end');
        span.end();
      }
    });
  }

  async updateProfile(data: UpdateProfileDto) {
    return this.tracer.startActiveSpan('update_profile', async (span: Span) => {
      span.setAttribute('user.id', data.userId);
      span.addEvent('profile.update.start');
      try {
        // Check user existence
        span.addEvent('db.query.start', {
          query: 'findUnique',
          userId: data.userId,
        });
        const user = await this.prisma.user.findUnique({
          where: { id: data.userId },
        });
        span.addEvent('db.query.end');
        if (!user) {
          span.addEvent('validation.failed', {
            reason: 'user_not_found',
            userId: data.userId,
          });
          throw new NotFoundException('User not found');
        }
        // Update profile
        span.addEvent('db.query.start', {
          query: 'update',
          userId: data.userId,
        });
        const updatedUser = await this.prisma.user.update({
          where: { id: data.userId },
          data: {
            name: data.name,
          },
        });
        span.addEvent('db.query.end');
        span.addEvent('profile.update.success', { userId: updatedUser.id });
        return {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
        };
      } catch (error) {
        span.recordException(error);
        span.addEvent('profile.update.error', { message: error.message });
        throw error;
      } finally {
        span.addEvent('profile.update.end');
        span.end();
      }
    });
  }
}
