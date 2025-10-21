import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { User, UserAddress } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository.interface';

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
}

export interface JwtRefreshPayload {
  sub: string;
  iat: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository') private userRepository: IUserRepository,
  ) { }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '24h') as string;

    return jwt.sign(
      {
        sub: userId,
        email,
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      { expiresIn } as SignOptions,
    );
  }

  generateRefreshToken(userId: string): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
    const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string;

    return jwt.sign(
      {
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      { expiresIn } as SignOptions,
    );
  }

  verifyToken(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  verifyRefreshToken(token: string): JwtRefreshPayload {
    const secret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
    try {
      return jwt.verify(token, secret) as JwtRefreshPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async register(
    nome: string,
    email: string,
    password: string,
    endereco: UserAddress,
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = new User(nome, email, endereco, hashedPassword);
    const createdUser = await this.userRepository.create(user);

    const token = this.generateToken(createdUser.id, createdUser.email);
    const refreshToken = this.generateRefreshToken(createdUser.id);

    return {
      user: createdUser,
      token,
      refreshToken,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive()) {
      throw new Error('User is not active');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user,
      token,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const decoded = this.verifyRefreshToken(refreshToken);
    const user = await this.userRepository.findById(decoded.sub);

    if (!user) {
      throw new Error('User not found');
    }

    const newToken = this.generateToken(user.id, user.email);
    return { token: newToken };
  }
}

