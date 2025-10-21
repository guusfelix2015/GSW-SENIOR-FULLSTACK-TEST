import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AuthService } from '@application/services/auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from '@application/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private authService: AuthService,
  ) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(
        registerDto.nome,
        registerDto.email,
        registerDto.password,
        registerDto.endereco,
      );

      return {
        success: true,
        data: {
          user: {
            id: result.user.id,
            nome: result.user.nome,
            email: result.user.email,
            status: result.user.status,
          },
          token: result.token,
          refreshToken: result.refreshToken,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
      throw new HttpException(
        errorMessage,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );

      return {
        success: true,
        data: {
          user: {
            id: result.user.id,
            nome: result.user.nome,
            email: result.user.email,
            status: result.user.status,
          },
          token: result.token,
          refreshToken: result.refreshToken,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      throw new HttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.authService.refreshToken(
        refreshTokenDto.refreshToken,
      );

      return {
        success: true,
        data: {
          token: result.token,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh token';
      throw new HttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

