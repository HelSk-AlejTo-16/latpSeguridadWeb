import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  public async getUserByUsername(username:string): Promise<User | null> {
    return await this.prisma.users.findFirst({
      where: { username }
    });


  }

   public async getUserById(id:number): Promise<User | null> {
    return await this.prisma.users.findFirst({
      where: { id }
    });
  }
public async updateHash(user_id: number, hash: string | null):Promise<User>{
    return await this.prisma.users.update({
      where: {id: user_id},
      data: {hash}
    });
}




  public logIn(): string {
    return 'Sesión exitosa';
  }





}