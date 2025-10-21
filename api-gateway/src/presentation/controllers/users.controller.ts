import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export interface UserAddress {
  rua: string;
  numero: string;
  bairro: string;
  complemento?: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface CreateUserDto {
  nome: string;
  email: string;
  endereco: UserAddress;
}

export interface UpdateUserDto {
  nome?: string;
  endereco?: UserAddress;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nome: string;
  email: string;
  password: string;
  endereco: UserAddress;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

@Controller('api/users')
export class UsersController {
  constructor(@Inject('TOP_USERS') private topUsersClient: ClientProxy) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('create_user', createUserDto),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAllUsers(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('find_all_users', { skip, take }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('find_user_by_id', { id }),
      );
      if (!result) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('update_user', { id, ...updateUserDto }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('delete_user', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/activate')
  async activateUser(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('activate_user', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to activate user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/deactivate')
  async deactivateUser(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('deactivate_user', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to deactivate user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/restore')
  async restoreUser(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('restore_user', { id }),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to restore user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('register_user', registerDto),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to register user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('login_user', loginDto),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to login',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('auth/refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    try {
      const result = await firstValueFrom(
        this.topUsersClient.send('refresh_token', refreshDto),
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

