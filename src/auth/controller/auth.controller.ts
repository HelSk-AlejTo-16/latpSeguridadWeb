import { AuthDto } from '../dto/auth.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { UtilService } from 'src/common/services/util.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AppException } from 'src/common/exceptions/app.exceptions';


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

      const { password, ...payload } = user;

      //FIXME: Generar refresh token por 7d
      const refresh = await this.utilSvc.generateJWT(payload, '7d');
      const hashRT = await this.utilSvc.hash(refresh);
      await this.authSvc.updateHash(user.id, hashRT);

      payload.hash = hashRT;
      const jwt = await this.utilSvc.generateJWT(payload, '1h');

      return { access_token: jwt, refresh_token: hashRT };

    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  @ApiOperation({ summary: 'Extrae el ID del usuario desde el token y busca la información' })
  @Get("me")
  @UseGuards(AuthGuard)
  public async getProfile(@Req() request: any){
    const userId = request['user'];
    return userId;
  }


  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Recibe un "Refresh Token", valida que no haya expirado y entrega un nuevo  "Access Token "' })
  public async refreshToken(@Req() request: any) {
    //Tener el usuario en sesión
    const userSession = request['user'];
    const user = await this.authSvc.getUserById(userSession.id);
    if(!user || !user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');
    //Comparar le token recibido con el hash guardado en la base de datos
    if( userSession.hash != user.hash) throw new AppException('Acceso denegado', HttpStatus.FORBIDDEN, '0');
    //Si es válido, generar un nuevo JWT de acceso
    return { token: '', refresh_token: '' };
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Invalida los tokens en el lado del servidor y limpia las cookies' })
  public async logout(@Req() request: any) {
    const session = request['user'];
    const user = await this.authSvc.updateHash(session.id, null);
     return user;  
  }

}