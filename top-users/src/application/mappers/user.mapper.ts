import { User } from '@domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toDomain(dto: CreateUserDto): User {
    return new User(
      dto.nome,
      dto.email,
      dto.endereco,
    );
  }

  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      endereco: user.endereco,
      status: user.status,
      created: user.created,
      updated: user.updated,
    };
  }

  static toResponseArray(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}

