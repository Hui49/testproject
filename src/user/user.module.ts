
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth1/auth.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from './user.schema';

@Module({
  imports: [AuthModule, 
    DynamooseModule.forFeature([
    { name: 'User', schema: UserSchema },
  ])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
