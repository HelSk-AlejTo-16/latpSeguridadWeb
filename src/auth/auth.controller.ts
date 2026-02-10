
import { AuthService } from './auth.service';
import { Controller, Get } from "@nestjs/common";

@Controller({})
export class AuthController{
    constructor(private readonly authSvc:AuthService){}


    @Get('1')
    public logIn(): string{
return this.authSvc.login()

    }

}