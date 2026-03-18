import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {

    constructor(private readonly jwtSvc: JwtService) { }


    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }

    public async generateJWT(payload: any, expireIn: any = '60s'): Promise<String> {
        return await this.jwtSvc.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn:expireIn});

//expiresIn:'1s'
    }


    public async getPayload(jwt: string): Promise<any> {
        return await this.jwtSvc.verifyAsync(jwt, { secret: process.env.JWT_SECRET });


    }
}