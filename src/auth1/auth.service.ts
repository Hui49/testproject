import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Observable<string> {
    console.log(`hashPassword`, password);
    return from(bcrypt.hashSync(password, 12));
  }

  comparePassword(
    newPassword: string,
    hashPassword: string,
  ): Observable<any | boolean> {
    console.log(`comparePassword`, newPassword, hashPassword);
    return of<any | boolean>(bcrypt.compareSync(newPassword, hashPassword));
  }
}