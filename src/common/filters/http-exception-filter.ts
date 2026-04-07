import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from 'express';
import { PrismaService } from "../services/prisma.service";

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
constructor(private readonly prisma: PrismaService) {}

    async catch(exception: any, host: ArgumentsHost) {
        console.log('--- ¡FILTRO CAPTURADO! ---'); // 👈 Añade esto
    console.log('Error detectado:', exception.message);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        //FIXME: Almacenar la información en la base de datos.
        const status = exception instanceof HttpException
            ? exception.getStatus() :
            HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorMsg = typeof message === 'string' ? message : (message as any).message;
        const errorCode = (exception as any).errorCode || (exception as any).code || 'UNKNOWN_ERROR';

        // Intentamos capturar el ID del usuario si está en el request (ej. por un JWT Guard)
        const userId = (request as any).user?.id || null;
        try {
            // No bloqueamos la respuesta del usuario, pero esperamos la creación
            await this.prisma.logs.create({
                data: {
                    statusCode: status,
                    timestamp: new Date(),
                    path: request.url,
                    error: String(errorMsg),
                    errorCode: String(errorCode),
                    session_id: userId,
                },
            });
        } catch (dbError) {
            // Si falla la base de datos, solo lo logueamos en consola para no romper el flujo
            console.error('No se pudo guardar el Log en la base de datos:', dbError);
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: typeof message == 'string' ? message : (message as any).message,
            errorCode: (exception as any).errorCode || 'UNKNOWN_ERROR'
        });
//almacenar el response en la base da datos

    }

}