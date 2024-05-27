import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = request;

    if (!request || !request.get) {
      next();
      return;
    }
    const userAgent = request.get('user-agent') || '';

    const send = response.send;
    response.send = (exitData) => {
      if (
        response
          ?.getHeader('content-type')
          ?.toString()
          .includes('application/json')
      ) {
        const { statusCode } = response;
        const diff = process.hrtime(startAt);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${userAgent} ${ip}`,
        );
        console.log({
          code: response.statusCode,
          exit: exitData.toString().substring(0, 1000),
          endDate: new Date(),
        });
      }
      response.send = send;
      return response.send(exitData);
    };

    next();
  }
}
