import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '@application/services/user.service';
import { AuthService } from '@application/services/auth.service';
import { CreateUserDto } from '@application/dto/create-user.dto';
import { UpdateUserDto } from '@application/dto/update-user.dto';
import { UserAddress } from '@/domain/entities/user.entity';
import { RegisterDto } from '@/application/dto/auth.dto';

@Controller()
export class UserMicroserviceController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @MessagePattern('create_user')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { success: true, data: user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('find_user_by_id')
  async findUserById(@Payload() payload: { id: string }) {
    try {
      const user = await this.userService.findById(payload.id);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('find_all_users')
  async findAllUsers(@Payload() payload: { skip?: number; take?: number }) {
    try {
      const users = await this.userService.findAll(payload.skip, payload.take);
      return { success: true, data: users };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('update_user')
  async updateUser(
    @Payload() payload: { id: string; nome?: string; endereco?: UserAddress },
  ) {
    try {
      const updateUserDto: UpdateUserDto = {};
      if (payload.nome) updateUserDto.nome = payload.nome;
      if (payload.endereco) updateUserDto.endereco = payload.endereco;

      const user = await this.userService.update(payload.id, updateUserDto);
      return { success: true, data: user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('delete_user')
  async deleteUser(@Payload() payload: { id: string }) {
    try {
      await this.userService.delete(payload.id);
      return { success: true, message: 'User deleted successfully' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('activate_user')
  async activateUser(@Payload() payload: { id: string }) {
    try {
      const user = await this.userService.activate(payload.id);
      return { success: true, data: user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('deactivate_user')
  async deactivateUser(@Payload() payload: { id: string }) {
    try {
      const user = await this.userService.deactivate(payload.id);
      return { success: true, data: user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('restore_user')
  async restoreUser(@Payload() payload: { id: string }) {
    try {
      const user = await this.userService.restore(payload.id);
      return { success: true, data: user };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('register_user')
  async register(@Payload() payload: RegisterDto) {
    try {
      const result = await this.authService.register(
        payload.nome,
        payload.email,
        payload.password,
        payload.endereco,
      );
      return { success: true, data: result };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('login_user')
  async login(@Payload() payload: { email: string; password: string }) {
    try {
      const result = await this.authService.login(payload.email, payload.password);
      return { success: true, data: result };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  @MessagePattern('refresh_token')
  async refreshToken(@Payload() payload: { refreshToken: string }) {
    try {
      const result = await this.authService.refreshToken(payload.refreshToken);
      return { success: true, data: result };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }
}

