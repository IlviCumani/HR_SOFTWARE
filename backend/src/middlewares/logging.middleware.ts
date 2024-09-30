import { Logger, NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('Response');

  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime();

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();

      if (statusCode === 201 || statusCode === 200) {
        this.logger.log(`${method} ${url} - ${resTime - reqTime} ms`);
      }
    });

    next();
  }
}
