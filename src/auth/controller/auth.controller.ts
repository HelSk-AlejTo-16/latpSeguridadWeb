import { AuthDto } from '../dto/auth.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiOperation } from '@nestjs/swagger';

import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService
  ) { }

  // POST /register 200
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica las credenciales y genera un JWT' })
  public async logIn(@Body() auth: AuthDto): Promise<any> {
    const { username, password } = auth;

    const user = await this.authSvc.getUserByUsername(username);
    if (!user)
      throw new UnauthorizedException('Credenciales inválidas');

    if (await this.utilSvc.checkPassword(password, user.password!)) {

      //Obtener token de acceso por 60s
      const { password, ...payload } = user;

      const jwt = await this.utilSvc.generateJWT(payload, '1h');
      //FIXME: Generar refresh token por 7d
      const refresh = await this.utilSvc.generateJWT(payload, '7d');
      return { access_token: jwt, refresh_token: refresh };

    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }




  @ApiOperation({ summary: 'Extrae el ID del usuario desde el token y busca la información' })
  @Get("me")
  @UseGuards(AuthGuard)
  public async getProfile(@Req() request: any) {
    const user = request['user'];
    return user;


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
