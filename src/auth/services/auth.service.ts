import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  public async getUserByUsername(username: string): Promise<User | null> {
    return await this.prisma.users.findFirst({
      where: { username }
    });


  }





  public logIn(): string {
    return 'Sesión exitosa';
  }





}