import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfigService } from './dynamoose-config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [ 
    DynamooseModule.forRootAsync({ useClass: DynamooseConfigService }),
    ApplicationModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService,{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class AppModule {}
