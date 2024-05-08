import { Injectable } from '@nestjs/common';
import { Role } from 'src/common/role.enum';

export interface User {
  userId: number;
  username: string;
  password: string;
  role: Role; // Assuming role is represented as a Role enum value
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: Role.Admin,
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: Role.User,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}