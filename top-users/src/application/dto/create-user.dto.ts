import { UserAddress } from '@domain/entities/user.entity';

export class CreateUserDto {
  declare nome: string;
  declare email: string;
  declare endereco: UserAddress;
}

