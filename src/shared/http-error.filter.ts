import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from "@nestjs/common";

@Catch()
export class HttpErrorFilter implements ExceptionFilter{
    catch(exception: HttpException, host:ArgumentsHost){
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        const errorResponse={
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path:request.url,
            method: request.method,
            message: exception.message.error || exception.message || null
        }

        response.status(404).json(errorResponse);
    }
}
