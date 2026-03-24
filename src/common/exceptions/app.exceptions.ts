import { HttpCode, HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException{
constructor(
public readonly message: string,
public readonly StatusCode: HttpStatus = HttpStatus.BAD_REQUEST,
public readonly ErrorCode: string,

)

{super( message, StatusCode)}



}