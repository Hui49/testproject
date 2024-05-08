import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfController } from './pdf/pdf.controller';
import { PdfService } from './pdf/pdf.service';
import { PdfModule } from './pdf/pdf.module';
import { StorageService } from './storage/storage.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfigService } from './dynamoose-config.service';
import { AuthService } from './auth1/auth.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
// import { AuthModule } from './auth1/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [ 
    DynamooseModule.forRootAsync({ useClass: DynamooseConfigService }),
    // ConfigModule.forRoot({ isGlobal: true }),
    PdfModule,
    AuthModule,
    UsersModule,
    // UserModule
  ],
  controllers: [AppController],
  providers: [AppService, StorageService, AuthService, UsersService,{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class AppModule {}
