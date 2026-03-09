import { AuthDto } from './dto/auth.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService,
    private jwtSvc: JwtService
  ) { }

  //POST /register 200
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica las credenciales y genera un JWT' })
  public async logIn(@Body() auth: AuthDto): Promise <string> {
    const { username, password } = auth;

    const jwt = await this.jwtSvc.signAsync(auth,{secret: process.env.JWT_SECRET});


    // TODO: Verificar usuario y contraseña

    //TODO: Obtener la información a enviar (payload)

    //TODO: Generar Token de acceso por 60s

    //TODO: Generar refresh Token por 7d

    //return this.authSvc.logIn();
    return jwt;
  }


  @ApiOperation({ summary: 'Extrae el ID del usuario desde el token y busca la información' })
  @Get("me")
  public async getProfile() {

  }


  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recibe un "Refresh Token", valida que no haya expirado y entrega un nuevo  "Access Token "' })
  public async refreshToken() {

  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Invalida los tokens en el lado del servidor y limpia las cookies' })
  public async logout() {

  }

}