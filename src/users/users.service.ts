import { Injectable } from '@nestjs/common';
import { Role } from 'src/shared/enum/role.enum';

export interface User {
  userId: number;
  username: string;
  password: string;
  role: Role; // Assuming role is represented as a Role enum value
}

@Injectable()
export class UsersService {
  //TODO: user shouldb be in database and with hashed password
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: '1234',
      role: Role.Admin,
    },
    {
      userId: 2,
      username: 'maria',
      password: '5678',
      role: Role.User,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}