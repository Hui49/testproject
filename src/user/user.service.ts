import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from './user.schema';
import { AuthService } from 'src/auth1/auth.service';
import { Observable, map, switchMap } from 'rxjs';
  
  @Injectable()
  export class UserService {
	constructor(private authService: AuthService,
        @InjectModel('User')
        private userModel: Model<User, UserKey>,
      ) {}
  
	  login(user: User): Observable<string> {
		return this.validateUser(user.email, user.password).pipe(
		  switchMap((user: User) => {
			if (user) return this.authService.generateJWT(user);
			else throw Error('Unauthorized user!');
		  }),
		);
	  }
	
	  validateUser(email: string, password: string): Observable<User> {
		return this.findByEmail(email).pipe(
		  switchMap((user: User) => {
			return this.authService.comparePassword(password, user.password).pipe(
			  map((isMatched: boolean) => {
				console.log('isMatched', isMatched);
				if (isMatched) {
					// to do :
				  const { password, ...res } = user;
				  return user;
				}
				throw new UnauthorizedException('Not Authorized');
			  }),
			);
		  }),
		);
	  }
	
	  findByEmail(email: string): Observable<User> {
		return Observable.apply(observer => {
		  this.userModel.get({email}, (err, user) => {
			if (err) {
			  observer.error(err);
			} else {
			  observer.next(user);
			  observer.complete();
			}
		  });
		});
	  }
	}
  