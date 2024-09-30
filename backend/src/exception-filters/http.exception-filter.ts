import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Logger,
  Catch,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger();
  constructor() {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    this.logger.error(
      `${req.method} ${req.originalUrl} ${status} error:${exception.message}`,
    );
    const errorDetails = exception.getResponse();
    res.status(status).json({
      error: true,
      errorDetails,
    });
  }
}
