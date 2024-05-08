import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth1/auth.service';
import { Observable, map } from 'rxjs';
import { User } from './user.schema';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('login')
    login(@Body() user: User): Observable<object> {
      return this.userService
        .login(user)
        .pipe(map((jwt: string) => ({ access_token: jwt })));
    }
}