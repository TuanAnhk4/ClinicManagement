import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Response as ExpressResponse } from 'express';
// 2. Import Interface chung (đã tách)
import { BaseApiResponse } from '../interfaces';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        // 3. Ép kiểu Generic <ExpressResponse>
        const response = ctx.getResponse<ExpressResponse>();
        // 4. Giờ statusCode đã an toàn (number)
        const statusCode = response.statusCode;

        return {
          statusCode,
          message: 'Success',
          data: data as T, // 5. Ép kiểu data về T cho an toàn (hoặc giữ nguyên data)
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
