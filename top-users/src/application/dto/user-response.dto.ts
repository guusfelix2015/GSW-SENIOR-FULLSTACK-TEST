import { UserAddress, UserStatus } from '@domain/entities/user.entity';

export class UserResponseDto {
  declare id: string;
  declare nome: string;
  declare email: string;
  declare endereco: UserAddress;
  declare status: UserStatus;
  declare created: Date;
  declare updated: Date;
}

