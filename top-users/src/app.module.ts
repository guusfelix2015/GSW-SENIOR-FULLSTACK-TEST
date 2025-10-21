import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './presentation/modules/user.module';
import { UserMicroserviceController } from './presentation/microservice/user.microservice.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
  ],
  controllers: [UserMicroserviceController],
  providers: [],
})
export class AppModule { }

