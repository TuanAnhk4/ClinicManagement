import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// 1. Import Request và Response từ express để định nghĩa kiểu
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  // 2. Đổi Observable<any> thành Observable<unknown> để tránh lỗi "Unexpected any"
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // 3. Ép kiểu Generic <Request> cho getRequest()
    const request = context.switchToHttp().getRequest<Request>();

    const userAgent = request.get('user-agent') || '';

    // 4. Destructuring an toàn từ đối tượng Request đã được định kiểu
    // Lưu ý: Express dùng 'originalUrl' hoặc 'url', 'ip', 'method'
    const { ip, method, originalUrl } = request;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        // 5. Ép kiểu Generic <Response> cho getResponse()
        const response = context.switchToHttp().getResponse<Response>();
        const delay = Date.now() - now;

        // 6. Truy cập .statusCode an toàn
        this.logger.log(`${method} ${originalUrl} ${response.statusCode} - ${userAgent} ${ip}: ${delay}ms`);
      }),
    );
  }
}
