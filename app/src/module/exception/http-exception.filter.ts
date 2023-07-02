import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = status === 404 ? 'Page Not Found' : exception.message;

    // エラーページをレンダリングするロジックを実装
    response.status(status).render('errors/error', {
      message: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
