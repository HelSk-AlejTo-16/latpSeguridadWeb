import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from '../dto/create-users';
import { UpdateUserDto } from '../dto/update-users';
import { User } from '../entity/users.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Client,
    private prisma: PrismaService,
  ) {}

  public async getUsers(): Promise<User[]> {
    const users = await this.prisma.users.findMany();
    return users;
  }

  public async getUserById(id: number): Promise<User> {
    const user = await this.prisma.users.findUniqueOrThrow({
      where: { id },
    });
    return user;
  }

  public async insertUser(user: CreateUserDto): Promise<User> {
    const newUser = await this.prisma.users.create({
      data: user,
    });
    return newUser;
  }

  public async updateUser(id: number, userUpdated: UpdateUserDto): Promise<User> {
    const user = await this.prisma.users.update({
      where: { id },
      data: userUpdated,
    });
    return user;
  }

  public async deleteUser(id: number): Promise<boolean> {
    await this.prisma.users.delete({
      where: { id },
    });
    return true;
  }
}