import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ErrorResponse } from '../interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // --- SỬA LỖI 1: Xử lý message an toàn ---
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      // Kiểm tra xem response có phải là object không
      if (typeof response === 'object' && response !== null) {
        // Ép kiểu về ErrorResponse thay vì any
        const responseObj = response as ErrorResponse;
        message = responseObj.message;
      } else {
        message = response;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }
    // ---------------------------------------

    // --- SỬA LỖI 2: So sánh Enum an toàn ---
    // Ép kiểu Enum về number để so sánh với httpStatus (vốn là number)
    if (httpStatus === (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      this.logger.error(`Exception: ${JSON.stringify(exception)}`);
    }
    // ---------------------------------------

    // --- SỬA LỖI 3: Ép kiểu đường dẫn ---
    // Bảo với TS rằng getRequestUrl chắc chắn trả về string
    const path = httpAdapter.getRequestUrl(ctx.getRequest()) as string;
    // ------------------------------------

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: path,
      message: message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
