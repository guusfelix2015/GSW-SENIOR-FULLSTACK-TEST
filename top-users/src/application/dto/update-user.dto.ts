import { UserAddress } from '@domain/entities/user.entity';

export class UpdateUserDto {
  nome?: string;
  endereco?: UserAddress;
}

