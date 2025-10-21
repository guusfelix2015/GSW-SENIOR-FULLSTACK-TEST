import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { UserService } from '@application/services/user.service';
import { AuthService } from '@application/services/auth.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'AuthService',
      useClass: AuthService,
    },
  ],
  exports: [UserService, AuthService],
})
export class UserModule { }

