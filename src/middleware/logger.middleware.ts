import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `HTTP Request: Method: ${req.method} ${req.originalUrl} Status: ${res.statusCode}`,
    );
    next();
  }
}
